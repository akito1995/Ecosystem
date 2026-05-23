"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { addRecentSearch, recentSearches } = useAppStore();

  const QUICK_SEARCHES = ["PVN", "Vingroup", "Masan", "Viettel", "Hàng không", "Ngân hàng"];

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          useAppStore.setState({ recentSearches: parsed });
        }
      } catch (e) {}
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      alert("Query too short");
      return;
    }
    addRecentSearch(searchQuery.trim());
    const slug = encodeURIComponent(searchQuery.trim().toLowerCase());
    router.push(`/company/${slug}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <form onSubmit={onSubmit} className="w-full relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên công ty hoặc ngành... Ví dụ: PVN, Vingroup, dầu khí"
          className="w-full bg-[#1A2235] border border-[#2A3441] text-white px-6 py-4 pl-12 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
      </form>
      
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {QUICK_SEARCHES.map((term) => (
          <button
            key={term}
            onClick={() => handleSearch(term)}
            className="px-4 py-2 bg-[#1A2235] hover:bg-[#2A3441] text-sm text-gray-300 rounded-full transition-colors border border-[#2A3441]"
          >
            {term}
          </button>
        ))}
      </div>

      {recentSearches.length > 0 && (
        <div className="mt-8 text-sm text-gray-400">
          <p className="mb-2 text-center">Tìm kiếm gần đây:</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {recentSearches.map((term, idx) => (
              <span 
                key={idx} 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSearch(term)}
              >
                {term}{idx < recentSearches.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
