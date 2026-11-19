// Client-side helper for Msingi Speech (TTS) and Transcription (STT)
// Communicates solely with our secure server routes (/api/msingi/*),
// never exposing the MSINGI_API_KEY to the browser.

export interface MsingiSpeechOptions {
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

// Clean markdown, symbols, and citations so Swahili TTS sounds clean and natural
export function sanitizeTextForSpeech(text: string): string {
  return text
    // remove markdown headers
    .replace(/^#+\s+/gm, "")
    // remove bold/italic markers
    .replace(/(\*\*|\*|__|_)/g, "")
    // remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // remove code blocks and inline code
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    // remove bullet symbols
    .replace(/^[\s*-•]+\s*/gm, "")
    // remove extra whitespace
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1950); // stay safely within Msingi 2000 char limit
}

let activeAudio: HTMLAudioElement | null = null;

export function stopCurrentAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}

export async function requestMsingiSpeech(
  text: string,
  voiceId = "female3",
): Promise<{ blob: Blob; url: string }> {
  const clean = sanitizeTextForSpeech(text);
  if (!clean) {
    throw new Error("No speech content provided.");
  }

  const res = await fetch("/api/msingi/speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: clean, voice_id: voiceId }),
  });

  if (!res.ok) {
    let errMessage = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      if (err.error?.message) {
        errMessage = `${err.error.code ? `[${err.error.code}] ` : ""}${err.error.message}`;
      }
    } catch {
      errMessage = await res.text();
    }
    throw new Error(`Msingi speech generation failed: ${errMessage}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  return { blob, url };
}

export async function playMsingiSpeech(
  text: string,
  options?: MsingiSpeechOptions,
): Promise<HTMLAudioElement> {
  stopCurrentAudio();

  const { url } = await requestMsingiSpeech(text, options?.voiceId || "female3");
  const audio = new Audio(url);
  activeAudio = audio;

  audio.onplay = () => options?.onStart?.();
  audio.onended = () => {
    options?.onEnd?.();
    if (activeAudio === audio) activeAudio = null;
  };
  audio.onerror = () => {
    const err = new Error("Audio playback failed.");
    options?.onError?.(err);
    if (activeAudio === audio) activeAudio = null;
  };

  await audio.play();
  return audio;
}

export async function transcribeVoiceRecording(audioBlob: Blob): Promise<{
  text: string;
  duration?: number;
  speech_detected?: boolean;
}> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");

  const res = await fetch("/api/msingi/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errMessage = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      if (err.error?.message) {
        errMessage = `${err.error.code ? `[${err.error.code}] ` : ""}${err.error.message}`;
      }
    } catch {
      errMessage = await res.text();
    }
    throw new Error(`Msingi transcription failed: ${errMessage}`);
  }

  return await res.json();
}
