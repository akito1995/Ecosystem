import { NextResponse } from "next/server";
import { fetchGeminiResearch } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { buildEcosystemGraph } from "@/lib/graphBuilder";

export async function POST(req: Request) {
  try {
    const { query, forceRefresh } = await req.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ error: "Query quá ngắn" }, { status: 400 });
    }

    const searchKey = query.toLowerCase().trim();

    // 1. Bypass Cache completely as requested by user
    // if (!forceRefresh) { ... }

    // 2. Call Gemini API
    let companyData;
    try {
      companyData = await fetchGeminiResearch(query);
    } catch (e: any) {
      // Retry once if failed
      console.log("Gemini failed, retrying once...", e.message);
      try {
        companyData = await fetchGeminiResearch(query + " please return ONLY valid JSON");
      } catch (retryErr: any) {
        // Return the actual error message to the frontend for easy debugging
        return NextResponse.json({ 
          error: `Lỗi từ Gemini API: ${e.response?.data?.error?.message || e.message || retryErr.message}` 
        }, { status: 500 });
      }
    }

    // 3. Build Graph
    const { nodes, edges } = buildEcosystemGraph(companyData);

    // 4. Save to DB (Fire and forget, do not block if Supabase fails)
    try {
      // Upsert company
      const { data: savedCompany, error: saveError } = await supabase
        .from("companies")
        .upsert({
          search_key: searchKey,
          company_name: companyData.company_name || query,
          business_registration_name: companyData.business_registration_name,
          industry: companyData.industry,
          parent_company: companyData.parent_company,
          subsidiaries: companyData.subsidiaries,
          associated_companies: companyData.associated_companies,
          ecosystem_role: companyData.ecosystem_role,
          industry_value_chain_position: companyData.industry_value_chain_position,
          description: companyData.description,
          ownership_structure: companyData.ownership_structure,
          notable_relationships: companyData.notable_relationships,
          sources: companyData.sources,
          raw_json: companyData,
          updated_at: new Date().toISOString()
        }, { onConflict: "search_key" })
        .select()
        .single();

      if (savedCompany) {
        // Upsert ecosystem
        await supabase
          .from("ecosystems")
          .upsert({
            root_company_id: savedCompany.id,
            nodes,
            edges
          }, { onConflict: "root_company_id" });
        
        companyData.id = savedCompany.id;
      }
    } catch (dbErr) {
      console.error("Supabase connection fail, fallback to direct return", dbErr);
    }

    return NextResponse.json({
      company: companyData,
      nodes,
      edges,
      cached: false
    });

  } catch (error: any) {
    console.error("Research API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
