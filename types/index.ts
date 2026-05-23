export interface CompanyData {
  id?: string;
  search_key?: string;
  company_name: string;
  business_registration_name: string | null;
  industry: string | null;
  parent_company: string | null;
  subsidiaries: { name: string; role: string; ownership_percent: number | null }[];
  associated_companies: { name: string; relationship: string }[];
  ecosystem_role: string | null;
  industry_value_chain_position: string | null;
  description: string | null;
  ownership_structure: string | null;
  notable_relationships: { company: string; type: string }[];
  sources: string[];
  raw_json?: any;
  created_at?: string;
  updated_at?: string;
}

export interface ResearchResponse {
  company: CompanyData;
  nodes: any[];
  edges: any[];
  cached?: boolean;
}
