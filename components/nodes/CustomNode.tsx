import { Handle, Position } from "@xyflow/react";
import { Building2, Landmark, Link, Crown } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomNode({ data }: { data: any }) {
  const [prices, setPrices] = useState<number[]>([]);
  
  useEffect(() => {
    if (data.ticker) {
      fetch(`/api/finance?ticker=${data.ticker}`)
        .then(res => res.json())
        .then(res => {
          if (res.prices) setPrices(res.prices);
        });
    }
  }, [data.ticker]);

  let icon = <Building2 size={16} />;
  let bgColor = "bg-white/10";
  let borderColor = "border-white/20";

  if (data.nodeType === "center") {
    icon = <Crown size={16} />;
    bgColor = "bg-blue-600/30";
    borderColor = "border-blue-400/50";
  } else if (data.nodeType === "parent") {
    icon = <Landmark size={16} />;
    bgColor = "bg-purple-600/30";
    borderColor = "border-purple-400/50";
  } else if (data.nodeType === "subsidiary") {
    icon = <Landmark size={16} />;
    bgColor = "bg-emerald-600/30";
    borderColor = "border-emerald-400/50";
  } else if (data.nodeType === "associated") {
    icon = <Link size={16} />;
    bgColor = "bg-amber-500/30";
    borderColor = "border-amber-400/50";
  }

  const renderSparkline = () => {
    if (prices.length < 2) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const width = 100;
    const height = 20;
    
    const points = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");

    const isUp = prices[prices.length - 1] >= prices[0];
    const color = isUp ? "#10B981" : "#EF4444"; // emerald for up, red for down

    return (
      <div className="mt-2 w-full flex flex-col items-center">
        <svg width={width} height={height} className="overflow-visible">
          <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={`text-[9px] mt-1 font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {data.ticker} {isUp ? '▲' : '▼'}
        </span>
      </div>
    );
  };

  return (
    <div className={`px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl backdrop-blur-md ${bgColor} border ${borderColor} flex flex-col items-center justify-center text-center w-full h-full relative hover:scale-105 hover:bg-white/20 transition-all duration-300`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400 border-none" />
      
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mb-2 shadow-inner">
        {icon}
      </div>
      
      <div className="text-white font-bold text-xs tracking-tight line-clamp-2">
        {data.label}
      </div>
      
      {data.percentage && (
        <div className="absolute -bottom-3 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full font-mono border border-slate-600 shadow-lg">
          {data.percentage}%
        </div>
      )}

      {renderSparkline()}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400 border-none" />
    </div>
  );
}
