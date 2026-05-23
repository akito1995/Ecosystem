import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a corporate research analyst specializing in Vietnamese and Asian companies.
Your task is to research corporate structures, ownership, and industry ecosystems.
You MUST respond ONLY with valid JSON matching the requested schema. No explanation, no markdown formatting.
If data is unknown, use null for strings and [] for arrays.
Focus on: corporate group structure, parent/subsidiary relationships, industry value chain.
IMPORTANT: All text values in the JSON (except keys) MUST be written in Vietnamese (Tiếng Việt).`;

const USER_PROMPT_TEMPLATE = `Research this company or industry: "{query}"

Return ONLY this exact JSON structure:
{
  "company_name": "Official company name",
  "business_registration_name": "Name as registered",
  "stock_ticker": "3-letter stock ticker if listed (e.g., VIC, FPT), otherwise null",
  "website": "Main website domain if known (e.g., 'vingroup.net'), else null",
  "is_foreign": true or false,
  "established_year": "Year founded (e.g., '1993'), or null",
  "tax_code": "Tax code/Business ID if known, else null",
  "employee_count": "Estimated employee count (e.g., '10,000+'), else null",
  "legal_representative": "Name of legal rep or CEO, else null",
  "legal_issues": "Brief summary of notable past legal issues/scandals, else null",
  "travel_demand_assessment": {
    "flights": "High/Medium/Low with brief reason",
    "hotels": "High/Medium/Low with brief reason",
    "visa": "High/Medium/Low with brief reason",
    "tour": "High/Medium/Low with brief reason",
    "car_rental": "High/Medium/Low with brief reason",
    "partnership_recommendation": "Final verdict on whether a Travel Agency should partner with them",
    "approach_strategy": "Recommended approach direction and sales solution/strategy for this client"
  },
  "industry": "Primary industry sector",
  "parent_company": "Parent company or group name (null if independent)",
  "subsidiaries": [
    { "name": "Company name", "role": "Role in group", "ownership_percent": null, "stock_ticker": null, "established_year": null, "website": "Domain if known, else null" }
  ],
  "associated_companies": [
    { "name": "Company name", "relationship": "Type of relationship", "stock_ticker": null, "established_year": null, "website": "Domain if known, else null" }
  ],
  "ecosystem_role": "Role of this company in industry ecosystem",
  "industry_value_chain_position": "upstream/midstream/downstream/integrated",
  "description": "2-3 sentence overview",
  "ownership_structure": "Who owns this company and percentage if known",
  "notable_relationships": [
    { "company": "Company name", "type": "partnership/client/competitor/regulator" }
  ],
  "sources": ["URL or source name"]
}`;

export async function fetchGeminiResearch(query: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const userPrompt = USER_PROMPT_TEMPLATE.replace("{query}", query);

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) {
    throw new Error("Empty response from Gemini API");
  }

  try {
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.substring(7);
    }
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.substring(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }
    return JSON.parse(jsonStr.trim());
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON", content);
    throw new Error("Invalid JSON response from Gemini");
  }
}
