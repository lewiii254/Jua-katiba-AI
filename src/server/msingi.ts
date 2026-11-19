// Server-side Msingi Speech & Audio Integration
// Endpoints adhere to official Msingi documentation:
// - TTS: POST https://api.msingiai.com/v1/audio/speech
// - STT: POST https://api.msingiai.com/v1/audio/transcriptions
// - Base URL: https://api.msingiai.com
// - API Key read exclusively from server environment variables (MSINGI_API_KEY or MSINGI_AI_KEY)

export interface MsingiErrorEnvelope {
  error: {
    code: string;
    message: string;
    request_id?: string;
    param?: string;
  };
}

export function getMsingiConfig() {
  const apiKey = process.env.MSINGI_API_KEY || process.env.MSINGI_AI_KEY;
  const baseUrl = (process.env.MSINGI_BASE_URL || "https://api.msingiai.com").replace(/\/+$/, "");
  return { apiKey, baseUrl };
}

export async function synthesizeSpeechDirect({
  text,
  voiceId = "female3",
}: {
  text: string;
  voiceId?: string;
}): Promise<Response> {
  const { apiKey, baseUrl } = getMsingiConfig();

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          code: "missing_api_key",
          message: "MSINGI_API_KEY is not set on the server.",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const cleanText = text?.trim();
  if (!cleanText || cleanText.length > 2000) {
    return new Response(
      JSON.stringify({
        error: {
          code: "invalid_request",
          message: "Text must be between 1 and 2000 characters.",
          param: "text",
        },
      }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const upstream = await fetch(`${baseUrl}/v1/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: cleanText,
        voice_id: voiceId,
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      let errPayload: unknown;
      try {
        errPayload = JSON.parse(errText);
      } catch {
        errPayload = {
          error: {
            code: "upstream_error",
            message: errText || `Upstream returned HTTP ${upstream.status}`,
          },
        };
      }
      return new Response(JSON.stringify(errPayload), {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contentType = upstream.headers.get("content-type")?.split(";")[0]?.trim();
    if (contentType !== "audio/wav" && contentType !== "audio/x-wav") {
      return new Response(
        JSON.stringify({
          error: {
            code: "unexpected_format",
            message: `Expected WAV audio; received '${contentType}'`,
          },
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const audioBytes = await upstream.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", "audio/wav");
    headers.set("Content-Length", String(audioBytes.byteLength));
    if (upstream.headers.has("x-request-id")) {
      headers.set("X-Request-ID", upstream.headers.get("x-request-id")!);
    }
    if (upstream.headers.has("x-sample-rate")) {
      headers.set("X-Sample-Rate", upstream.headers.get("x-sample-rate")!);
    }

    return new Response(audioBytes, {
      status: 200,
      headers,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        error: {
          code: "internal_error",
          message: msg,
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function transcribeAudioDirect(request: Request): Promise<Response> {
  const { apiKey, baseUrl } = getMsingiConfig();

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          code: "missing_api_key",
          message: "MSINGI_API_KEY is not set on the server.",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let upstreamFormData: FormData;

    if (contentType.includes("multipart/form-data")) {
      const incomingForm = await request.formData();
      const fileEntry = incomingForm.get("file");
      if (!fileEntry || !(fileEntry instanceof Blob)) {
        return new Response(
          JSON.stringify({
            error: {
              code: "invalid_request",
              message: "Missing 'file' field in multipart form data.",
              param: "file",
            },
          }),
          { status: 422, headers: { "Content-Type": "application/json" } },
        );
      }
      upstreamFormData = new FormData();
      upstreamFormData.append("file", fileEntry, (fileEntry as File).name || "audio.wav");
    } else if (contentType.includes("application/json")) {
      const body = (await request.json()) as { audioBase64?: string; filename?: string; mimeType?: string };
      if (!body.audioBase64) {
        return new Response(
          JSON.stringify({
            error: {
              code: "invalid_request",
              message: "Missing audioBase64 string in JSON body.",
              param: "audioBase64",
            },
          }),
          { status: 422, headers: { "Content-Type": "application/json" } },
        );
      }
      const rawBase64 = body.audioBase64.replace(/^data:audio\/[^;]+;base64,/, "");
      const buffer = Buffer.from(rawBase64, "base64");
      const blob = new Blob([buffer], { type: body.mimeType || "audio/wav" });
      upstreamFormData = new FormData();
      upstreamFormData.append("file", blob, body.filename || "audio.wav");
    } else {
      return new Response(
        JSON.stringify({
          error: {
            code: "unsupported_media_type",
            message: "Content-Type must be multipart/form-data or application/json.",
          },
        }),
        { status: 415, headers: { "Content-Type": "application/json" } },
      );
    }

    const upstream = await fetch(`${baseUrl}/v1/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstreamFormData,
      signal: AbortSignal.timeout(120000),
    });

    const responseText = await upstream.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = {
        error: {
          code: "upstream_error",
          message: responseText || `Upstream returned status ${upstream.status}`,
        },
      };
    }

    return new Response(JSON.stringify(parsed), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        error: {
          code: "internal_error",
          message: msg,
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
