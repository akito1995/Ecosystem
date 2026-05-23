"use client";

import { CompanyData } from "../types";
import { ExternalLink, RefreshCw, Briefcase, Plane } from "lucide-react";
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
          title="Làm mới dữ liệu"
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Tổng quan</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{company.description || "N/A"}</p>
        </section>

        {/* B2B Info */}
        <section className="bg-[#1A2235] p-5 rounded-xl border border-[#2A3441] space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2A3441] pb-2">
            <Briefcase size={16} className="text-blue-400" /> Hồ sơ Doanh nghiệp
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 block text-xs mb-1 uppercase tracking-wider">Loại hình</span>
              <span className="text-white font-medium">{company.is_foreign === true ? 'Nước ngoài' : company.is_foreign === false ? 'Việt Nam' : 'Không rõ'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs mb-1 uppercase tracking-wider">Năm thành lập</span>
              <span className="text-white font-medium">{company.established_year || "N/A"}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs mb-1 uppercase tracking-wider">Mã số thuế</span>
              <span className="text-white font-medium">{company.tax_code || "N/A"}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs mb-1 uppercase tracking-wider">Nhân sự</span>
              <span className="text-white font-medium">{company.employee_count || "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500 block text-xs mb-1 uppercase tracking-wider">Người đại diện pháp luật</span>
              <span className="text-white font-medium">{company.legal_representative || "N/A"}</span>
            </div>
          </div>
          {company.legal_issues && company.legal_issues.toLowerCase() !== "none" && company.legal_issues.toLowerCase() !== "null" && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Lịch sử Pháp lý / Rủi ro</span>
              <p className="text-red-200 text-sm leading-relaxed">{company.legal_issues}</p>
            </div>
          )}
        </section>

        {/* Travel Demand Assessment */}
        {company.travel_demand_assessment && (
          <section className="bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/20 space-y-4 shadow-lg shadow-emerald-500/5">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-emerald-500/20 pb-2">
              <Plane size={16} /> Tiềm năng B2B Du lịch & Lữ hành
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="bg-[#0B101E]/50 p-3 rounded-lg border border-emerald-500/10">
                <span className="text-emerald-500 font-bold block text-xs uppercase mb-1">Vé máy bay & Khách sạn</span>
                <p><strong>Vé máy bay:</strong> {company.travel_demand_assessment.flights}</p>
                <p className="mt-1"><strong>Khách sạn:</strong> {company.travel_demand_assessment.hotels}</p>
              </div>
              <div className="bg-[#0B101E]/50 p-3 rounded-lg border border-emerald-500/10">
                <span className="text-emerald-500 font-bold block text-xs uppercase mb-1">Dịch vụ Khác</span>
                <p><strong>Visa/Passport:</strong> {company.travel_demand_assessment.visa}</p>
                <p className="mt-1"><strong>Tour Đoàn (Teambuilding):</strong> {company.travel_demand_assessment.tour}</p>
                <p className="mt-1"><strong>Thuê xe:</strong> {company.travel_demand_assessment.car_rental}</p>
              </div>
            </div>
            <div className="mt-3 p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <span className="text-emerald-300 font-black block text-xs uppercase tracking-wider mb-2">💡 Đề xuất Hợp tác</span>
              <p className="text-emerald-50 text-sm leading-relaxed font-medium">{company.travel_demand_assessment.partnership_recommendation}</p>
            </div>
          </section>
        )}

        {/* Ownership Structure */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Cấu trúc sở hữu</h3>
          <p className="text-gray-300 text-sm">{company.ownership_structure || "N/A"}</p>
        </section>

        {/* Value Chain Position */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Vị trí trong chuỗi giá trị</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColor(company.industry_value_chain_position)}`}>
            {company.industry_value_chain_position || "Không rõ"}
          </span>
        </section>

        {/* Subsidiaries */}
        {company.subsidiaries && company.subsidiaries.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Công ty con ({company.subsidiaries.length})</h3>
            <div className="space-y-2">
              {company.subsidiaries.map((sub, i) => (
                <div key={i} className="p-3 bg-[#1A2235] rounded-lg border border-[#2A3441] cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => router.push(`/company/${encodeURIComponent(sub.name.toLowerCase())}`)}>
                  <p className="font-medium text-white text-sm">{sub.name}</p>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{sub.role || "Công ty con"}</span>
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
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Công ty liên kết ({company.associated_companies.length})</h3>
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
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Mối quan hệ đáng chú ý</h3>
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
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Nguồn tham khảo</h3>
            <ul className="space-y-2">
              {company.sources.map((source, i) => {
                const isUrl = source.startsWith('http');
                return (
                  <li key={i} className="text-sm">
                    {isUrl ? (
                      <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <ExternalLink size={14} /> Nguồn {i + 1}
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
