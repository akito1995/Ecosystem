"use client";

import { CompanyData } from "../types";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompanyDetailPanel({ company }: { company: CompanyData }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const slug = encodeURIComponent(company.company_name.toLowerCase());
    router.push(`/company/${slug}?forceRefresh=true`);
  };

  const badgeColor = (position: string | null) => {
    switch (position?.toLowerCase()) {
      case "upstream": return "bg-blue-500/20 text-blue-400";
      case "midstream": return "bg-purple-500/20 text-purple-400";
      case "downstream": return "bg-green-500/20 text-green-400";
      case "integrated": return "bg-amber-500/20 text-amber-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-[#0B101E] border-l border-[#1F2937]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{company.company_name}</h2>
          {company.business_registration_name && (
            <p className="text-sm text-gray-500 mb-2">{company.business_registration_name}</p>
          )}
          {company.industry && (
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
              {company.industry}
            </span>
          )}
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 bg-[#1A2235] hover:bg-[#2A3441] rounded-full text-gray-400 transition-colors"
          title="Refresh Research"
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{company.description || "N/A"}</p>
        </section>

        {/* Ownership Structure */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Ownership Structure</h3>
          <p className="text-gray-300 text-sm">{company.ownership_structure || "N/A"}</p>
        </section>

        {/* Value Chain Position */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Value Chain Position</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColor(company.industry_value_chain_position)}`}>
            {company.industry_value_chain_position || "Unknown"}
          </span>
        </section>

        {/* Subsidiaries */}
        {company.subsidiaries && company.subsidiaries.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Subsidiaries ({company.subsidiaries.length})</h3>
            <div className="space-y-2">
              {company.subsidiaries.map((sub, i) => (
                <div key={i} className="p-3 bg-[#1A2235] rounded-lg border border-[#2A3441] cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => router.push(`/company/${encodeURIComponent(sub.name.toLowerCase())}`)}>
                  <p className="font-medium text-white text-sm">{sub.name}</p>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{sub.role || "Subsidiary"}</span>
                    {sub.ownership_percent && <span>{sub.ownership_percent}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Associated Companies */}
        {company.associated_companies && company.associated_companies.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Associated Companies ({company.associated_companies.length})</h3>
            <div className="space-y-2">
              {company.associated_companies.map((assoc, i) => (
                <div key={i} className="p-3 bg-[#1A2235] rounded-lg border border-[#2A3441] cursor-pointer hover:border-amber-500/50 transition-colors" onClick={() => router.push(`/company/${encodeURIComponent(assoc.name.toLowerCase())}`)}>
                  <p className="font-medium text-white text-sm">{assoc.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{assoc.relationship}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notable Relationships */}
        {company.notable_relationships && company.notable_relationships.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Notable Relationships</h3>
            <ul className="space-y-2">
              {company.notable_relationships.map((rel, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{rel.company}</span>
                  <span className="text-xs px-2 py-1 bg-[#1A2235] text-gray-400 rounded">{rel.type}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sources */}
        {company.sources && company.sources.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Sources</h3>
            <ul className="space-y-2">
              {company.sources.map((source, i) => {
                const isUrl = source.startsWith('http');
                return (
                  <li key={i} className="text-sm">
                    {isUrl ? (
                      <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <ExternalLink size={14} /> Source {i + 1}
                      </a>
                    ) : (
                      <span className="text-gray-400">{source}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
