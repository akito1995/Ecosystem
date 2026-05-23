import { Handle, Position } from "@xyflow/react";
import { Building2, Landmark, Crown, Link } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomNode({ data }: { data: any }) {
  const [prices, setPrices] = useState<number[]>([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (data.ticker) {
      axios.get(`/api/finance?ticker=${data.ticker}`)
        .then(res => {
          if (res.data.prices) setPrices(res.data.prices);
        })
        .catch(err => console.error("Failed to fetch finance data", err));
    }
  }, [data.ticker]);

  let icon = <Building2 size={16} />;
  let bgColor = "bg-white/10";
  let borderColor = "border-white/20";
  let fallbackColor = "475569"; // slate-600

  if (data.nodeType === "center") {
    icon = <Crown size={16} />;
    bgColor = "bg-blue-600/30";
    borderColor = "border-blue-400/50";
    fallbackColor = "2563EB";
  } else if (data.nodeType === "parent") {
    icon = <Landmark size={16} />;
    bgColor = "bg-purple-600/30";
    borderColor = "border-purple-400/50";
    fallbackColor = "9333EA";
  } else if (data.nodeType === "subsidiary") {
    icon = <Landmark size={16} />;
    bgColor = "bg-emerald-600/30";
    borderColor = "border-emerald-400/50";
    fallbackColor = "10B981";
  } else if (data.nodeType === "associated") {
    icon = <Link size={16} />;
    bgColor = "bg-amber-500/30";
    borderColor = "border-amber-400/50";
    fallbackColor = "F59E0B";
  }

  const initials = data.label.substring(0, 2).toUpperCase();
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${fallbackColor}&color=fff&size=64&bold=true`;
  
  // Clean domain just in case (e.g. https://www.vingroup.net -> vingroup.net)
  let cleanDomain = data.website || "";
  if (cleanDomain) {
    cleanDomain = cleanDomain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
  }
  const logoUrl = cleanDomain && !imgError ? `https://logo.clearbit.com/${cleanDomain}` : avatarUrl;

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
    <div className={`px-4 py-4 mt-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl backdrop-blur-md ${bgColor} border ${borderColor} flex flex-col items-center justify-center text-center w-full h-full relative hover:scale-105 hover:bg-white/20 transition-all duration-300`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400 border-none opacity-0" />
      
      {/* Floating Logo */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-white mb-2 shadow-2xl overflow-hidden group">
        <img 
          src={logoUrl} 
          alt={data.label} 
          className="w-full h-full object-cover" 
          onError={() => setImgError(true)} 
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
      
      <div className="text-white font-bold text-xs tracking-tight line-clamp-2 mt-3 w-full">
        {data.label}
      </div>
      
      {data.percentage && (
        <div className="absolute -bottom-3 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full font-mono border border-slate-600 shadow-lg">
          {data.percentage}%
        </div>
      )}

      {renderSparkline()}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400 border-none opacity-0" />
    </div>
  );
}
