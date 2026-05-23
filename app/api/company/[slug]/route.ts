import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const searchKey = params.slug.toLowerCase().trim();
    
    const { data: company, error } = await supabase
      .from("companies")
      .select("*")
      .eq("search_key", searchKey)
      .single();

    if (error || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
