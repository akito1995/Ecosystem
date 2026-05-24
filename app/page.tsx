"use client";

import Link from "next/link";
import { Search, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const slug = encodeURIComponent(query.trim().toLowerCase());
    router.push(`/company/${slug}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111A2D] via-[#0A0F1E] to-[#0A0F1E] z-0 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 tracking-tight">
          Corporate Ecosystem Explorer
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Khám phá hệ sinh thái doanh nghiệp, cấu trúc sở hữu và chuỗi giá trị ngành với sức mạnh của AI theo thời gian thực.
        </p>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-[#2A3441] rounded-xl leading-5 bg-[#1A2235] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-inner"
              placeholder="Nhập tên doanh nghiệp (VD: Vingroup, Masan, FPT...)"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#0B101E] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
          >
            {loading ? "Đang quét dữ liệu..." : "Bắt đầu Khám phá"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/compare" className="flex items-center gap-2 px-6 py-3 border border-purple-500/30 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <ArrowRightLeft size={18} />
              Chế độ Đại chiến (Compare)
            </Link>
            <div className="text-gray-500 text-sm flex items-center gap-2">
              hoặc ấn <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-300 text-xs border border-slate-700">Ctrl + K</kbd>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-2 bg-[#1A2235]/50 border border-[#2A3441] rounded-xl px-4 py-2 w-full max-w-sm">
            <span className="text-xs text-gray-400">Gemini Key (Tùy chọn):</span>
            <input 
              type="password"
              placeholder="Nhập API Key nếu có..."
              onChange={(e) => {
                localStorage.setItem("gemini_api_key", e.target.value);
              }}
              defaultValue={typeof window !== 'undefined' ? localStorage.getItem("gemini_api_key") || "" : ""}
              className="bg-transparent border-none outline-none text-xs text-gray-300 flex-1 focus:ring-0"
              title="Nhập API Key của riêng bạn nếu hệ thống báo lỗi hết lượt (Quota exceeded)"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
