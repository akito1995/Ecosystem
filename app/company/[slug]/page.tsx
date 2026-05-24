"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import EcosystemGraph from "@/components/EcosystemGraph";
import CompanyDetailPanel from "@/components/CompanyDetailPanel";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { ResearchResponse } from "@/types";

import AIChatPanel from "@/components/AIChatPanel";

export default function CompanyPage({ params, searchParams }: { params: { slug: string }, searchParams: { forceRefresh?: string } }) {
  const [data, setData] = useState<ResearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decodedSlug = decodeURIComponent(params.slug);
  const forceRefresh = searchParams.forceRefresh === "true";

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const customApiKey = localStorage.getItem("gemini_api_key") || undefined;
      const res = await fetch(`/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: decodedSlug, forceRefresh, customApiKey })
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (err: any) {
      console.error(err);
      setError("Lỗi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedSlug, forceRefresh]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0A0F1E]">
        <LoadingState message={`Đang research ${decodedSlug}...`} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0A0F1E]">
        <ErrorState error={error || "Không có dữ liệu"} retry={fetchResearch} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0A0F1E]">
      <div className="w-[60%] h-full relative">
        <EcosystemGraph initialNodes={data.nodes} initialEdges={data.edges} />
      </div>
      <div className="w-[40%] h-full">
        <CompanyDetailPanel company={data.company} />
      </div>
      <AIChatPanel companyData={data.company} />
    </div>
  );
}
