"use client";

import { useState } from "react";
import EcosystemGraph from "@/components/EcosystemGraph";
import { CompanyData } from "@/types";
import { Search, Loader2, ArrowLeft, ArrowRightLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  
  const [data1, setData1] = useState<{ company: CompanyData, nodes: any[], edges: any[] } | null>(null);
  const [data2, setData2] = useState<{ company: CompanyData, nodes: any[], edges: any[] } | null>(null);
  
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleSearch1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query1.trim()) return;
    setLoading1(true);
    try {
      const res = await fetch(`/api/research?q=${encodeURIComponent(query1)}`);
      const json = await res.json();
      if (!json.error) setData1(json);
    } catch (err) {}
    setLoading1(false);
  };

  const handleSearch2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query2.trim()) return;
    setLoading2(true);
    try {
      const res = await fetch(`/api/research?q=${encodeURIComponent(query2)}`);
      const json = await res.json();
      if (!json.error) setData2(json);
    } catch (err) {}
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
      <div className="flex flex-1 overflow-hidden divide-x divide-slate-800">
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
              <Search className="absolute left-4 top-3.5 text-blue-400" size={18} />
            </form>
          </div>
          
          {loading1 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
              <p className="animate-pulse font-medium text-blue-400">Đang càn quét dữ liệu Hệ sinh thái 1...</p>
            </div>
          ) : data1 ? (
            <div className="flex-1 relative">
              <EcosystemGraph 
                initialNodes={data1.nodes} 
                initialEdges={data1.edges} 
                companyData={data1.company} 
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
              <Search className="absolute left-4 top-3.5 text-purple-400" size={18} />
            </form>
          </div>
          
          {loading2 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4 text-purple-500" size={40} />
              <p className="animate-pulse font-medium text-purple-400">Đang càn quét dữ liệu Hệ sinh thái 2...</p>
            </div>
          ) : data2 ? (
            <div className="flex-1 relative">
              <EcosystemGraph 
                initialNodes={data2.nodes} 
                initialEdges={data2.edges} 
                companyData={data2.company} 
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <ArrowRightLeft size={48} className="text-slate-700 mb-4" />
              <p>Nhập tên đối thủ để so sánh</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
