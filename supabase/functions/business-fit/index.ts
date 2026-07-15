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

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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

    if (!geminiResp.ok) {
      const err = await geminiResp.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.error?.message || "Gemini API error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiData = await geminiResp.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("No response from Gemini");

    const result = JSON.parse(rawText);

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
