-- Bảng lưu thông tin công ty
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_key TEXT UNIQUE NOT NULL, -- normalized tên để lookup
  company_name TEXT NOT NULL,
  business_registration_name TEXT,
  industry TEXT,
  parent_company TEXT,
  subsidiaries JSONB DEFAULT '[]',
  associated_companies JSONB DEFAULT '[]',
  ecosystem_role TEXT,
  industry_value_chain_position TEXT,
  description TEXT,
  ownership_structure TEXT,
  notable_relationships JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  raw_json JSONB, -- lưu full response gốc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng lưu ecosystem graph data
CREATE TABLE ecosystems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_company_id UUID REFERENCES companies(id),
  nodes JSONB NOT NULL, -- React Flow nodes
  edges JSONB NOT NULL, -- React Flow edges
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index để tìm kiếm nhanh
CREATE INDEX idx_companies_search_key ON companies(search_key);
CREATE INDEX idx_companies_industry ON companies(industry);
