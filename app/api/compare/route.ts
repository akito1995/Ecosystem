import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { company1, company2 } = await req.json();

    if (!company1 || !company2) {
      return NextResponse.json({ error: "Missing companies data" }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const prompt = `Bạn là một chuyên gia phân tích kinh tế và chiến lược kinh doanh hạng nhất.
Hãy phân tích sự cạnh tranh giữa 2 tập đoàn sau đây:
Tập đoàn 1: ${company1.company_name} (Lĩnh vực: ${company1.industry})
Tập đoàn 2: ${company2.company_name} (Lĩnh vực: ${company2.industry})

Dữ liệu chi tiết Tập đoàn 1: ${JSON.stringify(company1)}
Dữ liệu chi tiết Tập đoàn 2: ${JSON.stringify(company2)}

Hãy phân tích và trả về DUY NHẤT một chuỗi JSON hợp lệ theo đúng cấu trúc sau (không dùng markdown, không có text dư thừa, tất cả giá trị text bằng Tiếng Việt):
{
  "core_battleground": "Mô tả ngắn gọn về mặt trận cạnh tranh cốt lõi (vd: Cả 2 đều đang giành giật thị phần bán lẻ và tiêu dùng nhanh).",
  "key_clashes": [
    { "c1_subsidiary": "Tên công ty con bên 1", "c2_subsidiary": "Tên công ty con bên 2", "field": "Lĩnh vực đối đầu (vd: Bán lẻ siêu thị)", "winner_prediction": "Ai đang chiếm ưu thế và vì sao (ngắn gọn)" }
  ],
  "swot_c1": { "strength": "Điểm mạnh nhất", "weakness": "Điểm yếu nhất" },
  "swot_c2": { "strength": "Điểm mạnh nhất", "weakness": "Điểm yếu nhất" },
  "final_verdict": "Kết luận cuối cùng: Ai là người có hệ sinh thái mạnh hơn, hoặc họ có khả năng hợp tác/bổ trợ cho nhau không?"
}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("Empty response from Gemini API");

    let jsonStr = content.trim();
    if (jsonStr.startsWith("```json")) jsonStr = jsonStr.substring(7);
    if (jsonStr.startsWith("```")) jsonStr = jsonStr.substring(3);
    if (jsonStr.endsWith("```")) jsonStr = jsonStr.substring(0, jsonStr.length - 3);

    const json = JSON.parse(jsonStr.trim());
    return NextResponse.json(json);

  } catch (error: any) {
    console.error("Compare API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
