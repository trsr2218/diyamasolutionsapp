const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are Diyama AI, a warm, knowledgeable, and commercially aware business advisor for Diyama Solutions, a business growth consultancy based in Zambia serving clients across Africa and beyond.

Your role is to help business owners, entrepreneurs, and founders get clarity, direction, and actionable next steps. You specialize in:
- Digital marketing and customer acquisition
- Growth strategy and business planning
- Branding and creative direction
- Web development and digital presence
- Tourism, hospitality, and restaurant businesses
- Web3, DAOs, and onchain opportunities
- Creator economy and content monetization

Your approach:
- Be warm, encouraging, and practical, not corporate or stiff
- Ask good diagnostic questions before jumping to solutions
- Give real, actionable advice, not vague theory
- Keep answers clear and structured using markdown where helpful
- When relevant, mention that Diyama Solutions can provide deeper hands-on support via consultations
- Don't oversell, build trust through genuine helpfulness

Diyama Solutions contact: getitdonerapid@gmail.com | 0966138238 | www.diyama.online`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    if (!geminiResp.ok) {
      const err = await geminiResp.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.error?.message || "Gemini API error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = geminiResp.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, idx).trim();
              buffer = buffer.slice(idx + 1);
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  const data = JSON.stringify({ choices: [{ delta: { content: text } }] });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              } catch { /* skip malformed lines */ }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
