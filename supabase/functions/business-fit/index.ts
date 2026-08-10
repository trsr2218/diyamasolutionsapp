import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, businessType, stage, targetCustomers, currentChallenge, currentGoal } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a senior business growth consultant at Diyama Solutions, a consultancy based in Zambia serving African businesses.

A business owner has submitted their details. Analyse them and return a JSON object with your assessment.

Business details:
- Name: ${businessName}
- Type: ${businessType}
- Stage: ${stage}
- Target customers: ${targetCustomers}
- Biggest challenge: ${currentChallenge}
- Main goal this quarter: ${currentGoal}

Return a JSON object with exactly these fields:
{
  "summary": "2-3 sentence honest assessment of where this business is and what they most need",
  "services": ["3-5 specific Diyama service names that fit their situation"],
  "quickWins": ["3-4 specific actions they can take in the next 2 weeks for free or low cost"],
  "blindSpots": ["2-3 things they are probably not thinking about that could hurt their growth"],
  "risks": ["2 risks specific to their business type and stage"],
  "nextStep": "One clear, specific recommended next step for them to take"
}

Be specific, warm, and practical. Reference their actual business type and challenge. Do not be generic.`;

    // Fallback chain: free-tier models can return 503/429 under load. Each model
    // is retried a few times on transient errors so a single hiccup no longer
    // bounces the visitor back to the form; only a total outage fails the request.
    const MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash-preview"];
    const TRANSIENT = new Set([429, 500, 502, 503, 504]);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const generateReportText = async (): Promise<string> => {
      let lastError = "Gemini API error";
      for (const model of MODELS) {
        for (let attempt = 1; attempt <= 3; attempt++) {
          let resp: Response;
          try {
            resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: prompt }] }],
                  generationConfig: {
                    responseMimeType: "application/json",
                    maxOutputTokens: 1024,
                    temperature: 0.7,
                  },
                }),
              }
            );
          } catch (e) {
            lastError = e instanceof Error ? e.message : "Network error reaching Gemini";
            await sleep(400 * attempt);
            continue;
          }

          if (resp.ok) {
            const data = await resp.json().catch(() => ({}));
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
            lastError = "Empty response from Gemini";
            await sleep(400 * attempt);
            continue;
          }

          const err = await resp.json().catch(() => ({}));
          lastError = err.error?.message || `Gemini API error (${model}: ${resp.status})`;
          // Retry the same model only on transient statuses; otherwise fall through
          // to the next model in the chain immediately.
          if (!TRANSIENT.has(resp.status)) break;
          await sleep(500 * attempt);
        }
      }
      throw new Error(lastError);
    };

    // Tolerate models that wrap JSON in markdown fences or add stray prose.
    const parseReport = (raw: string) => {
      let s = raw.trim();
      if (s.startsWith("```")) {
        s = s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      }
      try {
        return JSON.parse(s);
      } catch {
        const start = s.indexOf("{");
        const end = s.lastIndexOf("}");
        if (start !== -1 && end > start) return JSON.parse(s.slice(start, end + 1));
        throw new Error("Could not read the generated report. Please try again.");
      }
    };

    const rawText = await generateReportText();
    const result = parseReport(rawText);

    // Store submission
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("business_fit_submissions").insert({
        business_name: businessName,
        business_type: businessType,
        stage,
        target_customers: targetCustomers,
        current_challenge: currentChallenge,
        current_goal: currentGoal,
        result,
        status: "completed",
      });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
