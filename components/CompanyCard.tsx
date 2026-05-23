import { CompanyData } from "../types";

export default function CompanyCard({ company }: { company: CompanyData }) {
  return (
    <div className="bg-[#1A2235] border border-[#2A3441] rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">{company.company_name}</h3>
      {company.industry && (
        <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs mb-4">
          {company.industry}
        </span>
      )}
      <p className="text-gray-400 text-sm">{company.description || "No description available."}</p>
    </div>
  );
}
