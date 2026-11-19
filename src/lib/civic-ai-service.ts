// Real-time AI Assistant Service for Katiba Lessons ("Wakili AI")
import { supabase } from "@/integrations/supabase/client";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Smart offline & fallback civic legal intelligence engine
export function getSmartLocalCivicAnswer(query: string, lessonTitle?: string, articles?: string[]): string {
  const q = query.toLowerCase();
  const artStr = articles?.join(", ") || "the relevant Articles";

  if (q.includes("sheng") || q.includes("mtaa") || q.includes("form")) {
    return `🇰🇪 **Katiba Mtaani (Sheng Translation):**
Hapa manze form ni simple sana: Kwa hii lesson ya **${lessonTitle || "Katiba"}**, sheria inakulinda bila kubembelezwa. 
- **Article 1**: Power yote ni yako, si ya politicians. Wao ni watumishi wako tu.
- **Article 3**: Usikubali order yoyote inayovunja Katiba.
- **Ukipatana na karao**: Kila mtu anafaa aheshimiwe (dignity). Hawafai kuchukua simu yako bila warrant au kukupiga. Jua haki zako mwananchi!`;
  }

  if (q.includes("police") || q.includes("arrest") || q.includes("phone") || q.includes("karao") || q.includes("search")) {
    return `👮 **Rights under Police Interactions (Articles 29, 31 & 49):**
1. **Right to Privacy (Article 31)**: An officer cannot demand your phone password or inspect private messages/M-Pesa without a valid search warrant issued by a magistrate.
2. **Right to Reasons (Article 49(1)(a))**: You must be informed promptly and in a language you understand of the exact reason for arrest.
3. **Right to Communication (Article 49(1)(d))**: You are entitled to make a phone call to an advocate or family member immediately.
4. **24-Hour Production Rule (Article 49(1)(f))**: You must be presented in court within 24 hours of arrest, not held indefinitely over the weekend.`;
  }

  if (q.includes("protest") || q.includes("demonstrat") || q.includes("picket") || q.includes("maandamano")) {
    return `📢 **Right to Peaceful Assembly (Article 37):**
- **The Core Right**: Every person has the right, peaceably and unarmed, to assemble, demonstrate, picket, and present petitions to public authorities.
- **Notice vs Permission**: Under the Public Order Act, you notify police for traffic and security coordination; police do NOT 'grant permission' as the right is constitutionally guaranteed.
- **Use of Force**: Police use of live ammunition against unarmed protesters is unconstitutional and violates the right to life (Article 26) and human dignity (Article 28).`;
  }

  if (q.includes("case") || q.includes("court") || q.includes("ruling") || q.includes("precedent")) {
    return `⚖️ **Landmark Precedent on ${lessonTitle || "Civic Governance"}:**
- **BBI Supreme Court Ruling (2022)**: Confirmed that sovereign power belongs directly to the people and cannot be usurped by executive decree.
- **Muruatetu v Republic (2017)**: The Supreme Court held that mandatory death penalty was unconstitutional because it robbed judges of discretion and violated human dignity (Article 28).
- **Okiya Omtatah Petitions**: Kenyan courts have repeatedly reaffirmed Article 258: ANY citizen has the legal right to challenge an unconstitutional government action in court without paying heavy filing fees.`;
  }

  if (q.includes("complain") || q.includes("ombudsman") || q.includes("help") || q.includes("report")) {
    return `🛡️ **Where to Seek Help or File Complaints in Kenya:**
1. **Independent Policing Oversight Authority (IPOA)**: Report police brutality, unlawful detention, or extortion (Call toll-free 1559).
2. **Commission on Administrative Justice (Office of the Ombudsman)**: File complaints about unfair government service, lack of information, or delayed decisions (info@ombudsman.go.ke).
3. **Kenya National Commission on Human Rights (KNCHR)**: Free human rights legal protection (toll-free SMS 22359).
4. **High Court Constitutional Division**: File a petition under Article 22 / 258 against any unconstitutional conduct.`;
  }

  return `🏛️ **Wakili AI Insights for ${lessonTitle || "This Lesson"}:**
Regarding your question on "${query}":

According to the Constitution of Kenya 2010 (${artStr}):
- **Constitutional Principle**: Authority assigned to any public officer is a public trust under Article 73. It must be exercised with transparency, accountability, and respect for citizens.
- **Your Protection**: Under Article 2(4), any order or regulation that contradicts your constitutional rights is void.
- **Actionable Step**: You are entitled to written reasons under Article 47 (Fair Administrative Action) if any public officer denies you service or takes adverse action.

Feel free to ask for a Sheng explanation, real court examples, or a quick scenario drill!`;
}

// Stream or fetch AI responses with seamless fallback
export async function askWakiliAI(
  messages: ChatMessage[],
  lessonContext?: { title: string; articles: string[]; summary: string },
  onChunk?: (token: string) => void,
): Promise<string> {
  const lastUserMsg = messages[messages.length - 1]?.content || "";

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const url = `${supabaseUrl}/functions/v1/civic-chat`;
      const systemContext = lessonContext
        ? `You are "Wakili AI", an enthusiastic, ultra-sharp Kenyan civic education AI mentor inside the JuaKatiba app.
The user is currently studying the lesson: "${lessonContext.title}" (Articles: ${lessonContext.articles.join(", ")}).
Summary: "${lessonContext.summary}".
Ground your explanations in the Constitution of Kenya 2010. You can explain in clear English or authentic Kenyan Sheng when requested. Keep answers punchy, actionable, and cite specific Kenyan articles.`
        : undefined;

      const payload = {
        messages: [
          ...(systemContext ? [{ role: "system", content: systemContext }] : []),
          ...messages,
        ],
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          
          // Parse SSE or plain text chunks
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content || "";
                if (delta) {
                  fullText += delta;
                  if (onChunk) onChunk(fullText);
                }
              } catch {
                // not json
              }
            } else if (chunk.length > 0 && !chunk.startsWith(":")) {
              fullText += chunk;
              if (onChunk) onChunk(fullText);
            }
          }
        }

        if (fullText.trim().length > 0) {
          return fullText;
        }
      }
    }
  } catch (err) {
    console.warn("Civic AI remote fetch fallback triggered:", err);
  }

  // Instant Smart Local Fallback
  const fallback = getSmartLocalCivicAnswer(lastUserMsg, lessonContext?.title, lessonContext?.articles);
  if (onChunk) {
    onChunk(fallback);
  }
  return fallback;
}
