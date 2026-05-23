export interface CompanyData {
  id?: string;
  search_key?: string;
  company_name: string;
  business_registration_name: string | null;
  stock_ticker?: string | null;
  industry: string | null;
  parent_company: string | null;
  subsidiaries: { name: string; role: string; ownership_percent: number | null; stock_ticker?: string | null; established_year?: string | null; }[];
  associated_companies: { name: string; relationship: string; stock_ticker?: string | null; established_year?: string | null; }[];
  ecosystem_role: string | null;
  industry_value_chain_position: string | null;
  description: string | null;
  ownership_structure: string | null;
  notable_relationships: { company: string; type: string }[];
  sources: string[];
  is_foreign?: boolean | null;
  established_year?: string | null;
  tax_code?: string | null;
  employee_count?: string | null;
  legal_representative?: string | null;
  legal_issues?: string | null;
  travel_demand_assessment?: {
    flights: string;
    hotels: string;
    visa: string;
    tour: string;
    car_rental: string;
    partnership_recommendation: string;
    approach_strategy: string;
  };
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
