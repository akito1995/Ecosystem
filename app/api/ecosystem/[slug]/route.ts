import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const searchKey = params.slug.toLowerCase().trim();
    
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("search_key", searchKey)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const { data: ecosystem, error: ecosystemError } = await supabase
      .from("ecosystems")
      .select("*")
      .eq("root_company_id", company.id)
      .single();

    if (ecosystemError || !ecosystem) {
      return NextResponse.json({ error: "Ecosystem not found" }, { status: 404 });
    }

    return NextResponse.json({ nodes: ecosystem.nodes, edges: ecosystem.edges });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
