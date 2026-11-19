#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env if present without requiring external dotenv package
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const API_KEY = process.env.MSINGI_API_KEY || process.env.MSINGI_AI_KEY;
if (!API_KEY) {
  console.error("Error: Set MSINGI_API_KEY in your server environment or .env file before running this example.");
  process.exit(1);
}

const configuredBase = process.env.MSINGI_BASE_URL ?? "https://api.msingiai.com";
const BASE = configuredBase.endsWith("/") ? configuredBase.slice(0, -1) : configuredBase;

// The customer greeting message as documented in https://platform.msingiai.com/docs/customer-greeting.md
// Easy to customize via CLI argument: node scripts/customer-greeting.mjs "Ujumbe wako hapa"
const greetingText = process.argv[2] || process.env.GREETING_TEXT || "Karibu. Tafadhali chagua huduma unayotaka kutumia.";
const voiceId = process.env.MSINGI_VOICE_ID || "female3";
const outputFile = process.env.GREETING_OUTPUT || "greeting.wav";

console.log(`Generating Swahili speech with Msingi API...`);
console.log(`- Base URL: ${BASE}`);
console.log(`- Voice ID: ${voiceId}`);
console.log(`- Text: "${greetingText}"`);
console.log(`- Output file: ${outputFile}`);

try {
  const response = await fetch(`${BASE}/v1/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: greetingText,
      voice_id: voiceId,
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    let errorDetails = "";
    try {
      const errJson = await response.json();
      if (errJson.error) {
        errorDetails = ` (${errJson.error.code}: ${errJson.error.message}${errJson.error.param ? ` [param: ${errJson.error.param}]` : ""}, request_id: ${errJson.error.request_id})`;
      } else {
        errorDetails = ` (${JSON.stringify(errJson)})`;
      }
    } catch {
      errorDetails = `: ${await response.text()}`;
    }
    throw new Error(`Msingi API error HTTP ${response.status}${errorDetails}`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim();
  if (contentType !== "audio/wav" && contentType !== "audio/x-wav") {
    throw new Error(`Expected WAV audio (audio/wav); received '${contentType}'.`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputFile, audioBuffer);

  const sampleRate = response.headers.get("x-sample-rate") || "unknown";
  const requestId = response.headers.get("x-request-id") || "unknown";

  console.log(`✓ Successfully saved ${outputFile} (${audioBuffer.byteLength} bytes)`);
  console.log(`  Sample rate: ${sampleRate} | Request ID: ${requestId}`);
  console.log(`  You can now play ${outputFile} in any audio player.`);
} catch (error) {
  console.error("Failed to generate greeting audio:", error instanceof Error ? error.message : error);
  process.exit(1);
}
