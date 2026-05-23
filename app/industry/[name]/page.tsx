import CompanyPage from "../../company/[slug]/page";

export default function IndustryPage({ params, searchParams }: { params: { name: string }, searchParams: { forceRefresh?: string } }) {
  // Reuse CompanyPage but map params.name to params.slug
  return <CompanyPage params={{ slug: params.name }} searchParams={searchParams} />;
}
