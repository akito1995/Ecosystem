"use client";

import { useState, useEffect } from "react";
import EcosystemGraph from "@/components/EcosystemGraph";
import { CompanyData } from "@/types";
import { Search, Loader2, ArrowLeft, ArrowRightLeft, Sparkles, Swords, Trophy, Target, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  
  const [data1, setData1] = useState<{ company: CompanyData, nodes: any[], edges: any[] } | null>(null);
  const [data2, setData2] = useState<{ company: CompanyData, nodes: any[], edges: any[] } | null>(null);
  
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const [compareResult, setCompareResult] = useState<any>(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (data1 && data2) {
      setComparing(true);
      fetch('/api/compare', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company1: data1.company, company2: data2.company })
      })
      .then(res => res.json())
      .then(json => {
        if (!json.error) setCompareResult(json);
      })
      .finally(() => setComparing(false));
    } else {
      setCompareResult(null);
    }
  }, [data1, data2]);

  const handleSearch1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query1.trim()) return;
    setLoading1(true);
    setError1(null);
    try {
      const res = await fetch(`/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query1 })
      });
      const json = await res.json();
      if (!json.error) {
        setData1(json);
      } else {
        setError1(json.error);
      }
    } catch (err: any) {
      setError1(err.message);
    }
    setLoading1(false);
  };

  const handleSearch2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query2.trim()) return;
    setLoading2(true);
    setError2(null);
    try {
      const res = await fetch(`/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query2 })
      });
      const json = await res.json();
      if (!json.error) {
        setData2(json);
      } else {
        setError2(json.error);
      }
    } catch (err: any) {
      setError2(err.message);
    }
    setLoading2(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020817] text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0B101E] z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-300">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
            <ArrowRightLeft size={24} className="text-purple-400" />
            CHẾ ĐỘ ĐẠI CHIẾN (COMPARE)
          </h1>
        </div>
      </div>

      {/* Split Screen */}
      <div className="flex flex-1 overflow-hidden divide-x divide-slate-800 relative">
        {/* Left Side */}
        <div className="flex-1 flex flex-col relative bg-[#0B101E]">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[80%] max-w-md">
            <form onSubmit={handleSearch1} className="relative">
              <input 
                value={query1}
                onChange={e => setQuery1(e.target.value)}
                placeholder="Nhập tên tập đoàn 1 (VD: Vingroup)..."
                className="w-full bg-slate-900/90 backdrop-blur-md border border-blue-500/30 text-white rounded-xl px-4 py-3 pl-11 shadow-[0_0_20px_rgba(59,130,246,0.15)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button type="submit" className="absolute left-4 top-3.5 text-blue-400 hover:text-blue-300">
                <Search size={18} />
              </button>
            </form>
          </div>
          
          {loading1 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
              <p className="animate-pulse font-medium text-blue-400">Đang càn quét dữ liệu Hệ sinh thái 1...</p>
            </div>
          ) : error1 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-red-400 px-8 text-center">
              <AlertTriangle size={48} className="mb-4" />
              <p>{error1}</p>
            </div>
          ) : data1 ? (
            <div className="flex-1 relative">
              <EcosystemGraph 
                initialNodes={data1.nodes} 
                initialEdges={data1.edges} 
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <Sparkles size={48} className="text-slate-700 mb-4" />
              <p>Nhập tên tập đoàn đầu tiên để bắt đầu</p>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col relative bg-[#0B101E]">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[80%] max-w-md">
            <form onSubmit={handleSearch2} className="relative">
              <input 
                value={query2}
                onChange={e => setQuery2(e.target.value)}
                placeholder="Nhập tên tập đoàn 2 (VD: Masan)..."
                className="w-full bg-slate-900/90 backdrop-blur-md border border-purple-500/30 text-white rounded-xl px-4 py-3 pl-11 shadow-[0_0_20px_rgba(168,85,247,0.15)] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button type="submit" className="absolute left-4 top-3.5 text-purple-400 hover:text-purple-300">
                <Search size={18} />
              </button>
            </form>
          </div>
          
          {loading2 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4 text-purple-500" size={40} />
              <p className="animate-pulse font-medium text-purple-400">Đang càn quét dữ liệu Hệ sinh thái 2...</p>
            </div>
          ) : error2 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-red-400 px-8 text-center">
              <AlertTriangle size={48} className="mb-4" />
              <p>{error2}</p>
            </div>
          ) : data2 ? (
            <div className="flex-1 relative">
              <EcosystemGraph 
                initialNodes={data2.nodes} 
                initialEdges={data2.edges} 
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <ArrowRightLeft size={48} className="text-slate-700 mb-4" />
              <p>Nhập tên đối thủ để so sánh</p>
            </div>
          )}
        </div>

        {/* Center Analysis Panel */}
        {data1 && data2 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-blue-900/50 to-purple-900/50 flex items-center justify-center gap-3">
              <Swords className="text-pink-500" size={24} />
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Trọng tài AI Phân tích</h2>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              {comparing ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <Loader2 className="animate-spin mb-4 text-pink-500" size={32} />
                  <p className="animate-pulse text-sm">Trí tuệ nhân tạo đang phân tích thế trận...</p>
                </div>
              ) : compareResult ? (
                <div className="space-y-6">
                  {/* Core Battleground */}
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                      <Target size={16} className="text-red-400" /> Mặt trận Cốt lõi
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{compareResult.core_battleground}</p>
                  </div>

                  {/* Key Clashes */}
                  {compareResult.key_clashes && compareResult.key_clashes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <Swords size={16} className="text-orange-400" /> Điểm nóng Xung đột
                      </h3>
                      <div className="space-y-3">
                        {compareResult.key_clashes.map((clash: any, i: number) => (
                          <div key={i} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 text-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-blue-400">{clash.c1_subsidiary}</span>
                              <span className="text-xs text-slate-500 mx-2">VS</span>
                              <span className="font-bold text-purple-400">{clash.c2_subsidiary}</span>
                            </div>
                            <div className="text-xs text-slate-400 mb-1 bg-slate-900/50 inline-block px-2 py-0.5 rounded">Lĩnh vực: {clash.field}</div>
                            <div className="text-slate-300 text-xs mt-1"><span className="text-emerald-400">Dự đoán:</span> {clash.winner_prediction}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SWOT Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-900/20 p-3 rounded-xl border border-blue-500/20">
                      <h4 className="text-xs font-bold text-blue-400 mb-2">{data1.company.company_name}</h4>
                      <div className="text-xs space-y-2">
                        <p><span className="text-emerald-400 font-bold block mb-0.5">Điểm mạnh:</span><span className="text-slate-300">{compareResult.swot_c1?.strength}</span></p>
                        <p><span className="text-red-400 font-bold block mb-0.5">Điểm yếu:</span><span className="text-slate-300">{compareResult.swot_c1?.weakness}</span></p>
                      </div>
                    </div>
                    <div className="bg-purple-900/20 p-3 rounded-xl border border-purple-500/20">
                      <h4 className="text-xs font-bold text-purple-400 mb-2">{data2.company.company_name}</h4>
                      <div className="text-xs space-y-2">
                        <p><span className="text-emerald-400 font-bold block mb-0.5">Điểm mạnh:</span><span className="text-slate-300">{compareResult.swot_c2?.strength}</span></p>
                        <p><span className="text-red-400 font-bold block mb-0.5">Điểm yếu:</span><span className="text-slate-300">{compareResult.swot_c2?.weakness}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Final Verdict */}
                  <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-4 rounded-xl border border-emerald-500/30">
                    <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                      <Trophy size={16} /> Phán quyết Cuối cùng
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed">{compareResult.final_verdict}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
                  <p>Không thể phân tích dữ liệu lúc này</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
