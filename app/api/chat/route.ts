import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { message, companyContext } = await req.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing" }, { status: 500 });
    }

    const systemPrompt = `You are an expert corporate analyst and AI assistant for an Ecosystem Explorer app.
The user is currently viewing the ecosystem graph for the following company:
${JSON.stringify(companyContext, null, 2)}

Answer the user's questions about this company, its ecosystem, risks, opportunities, or anything else.
Keep your answers concise, insightful, and strictly in Vietnamese (Tiếng Việt). Use markdown formatting for readability.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.3 }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json({ error: data.error?.message || "Lỗi từ Google API" }, { status: response.status });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không thể trả lời lúc này.";
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Lỗi Server: " + error.message }, { status: 500 });
  }
}
