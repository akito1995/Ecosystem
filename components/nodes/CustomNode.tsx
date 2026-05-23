"use client";

import { Handle, Position } from "@xyflow/react";
import { Building2, Landmark, Link, Crown } from "lucide-react";

export default function CustomNode({ data }: { data: any }) {
  const { label, nodeType, percentage } = data;

  // Determine styles and icon based on nodeType
  let bgColor = "bg-gray-800/60";
  let borderColor = "border-gray-500/50";
  let iconColor = "text-gray-400";
  let glowColor = "shadow-gray-500/20";
  let Icon = Building2;

  switch (nodeType) {
    case "root":
      bgColor = "bg-blue-600/70";
      borderColor = "border-blue-400/80";
      iconColor = "text-blue-100";
      glowColor = "shadow-blue-500/50 shadow-xl";
      Icon = Building2;
      break;
    case "parent":
      bgColor = "bg-purple-600/70";
      borderColor = "border-purple-400/80";
      iconColor = "text-purple-100";
      glowColor = "shadow-purple-500/50 shadow-xl";
      Icon = Crown;
      break;
    case "subsidiary":
      bgColor = "bg-emerald-600/70";
      borderColor = "border-emerald-400/80";
      iconColor = "text-emerald-100";
      glowColor = "shadow-emerald-500/50 shadow-xl";
      Icon = Landmark;
      break;
    case "associated":
      bgColor = "bg-amber-500/70";
      borderColor = "border-amber-400/80";
      iconColor = "text-amber-100";
      glowColor = "shadow-amber-500/50 shadow-xl";
      Icon = Link;
      break;
  }

  return (
    <div className={`px-4 py-3 min-w-[160px] max-w-[220px] backdrop-blur-md border ${borderColor} ${bgColor} rounded-xl shadow-lg ${glowColor} flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer group`}>
      {/* Invisible target handle so edges can connect */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !opacity-0" />
      
      <div className={`p-2 rounded-full bg-white/10 mb-2 ${iconColor} group-hover:scale-110 transition-transform`}>
        <Icon size={20} />
      </div>
      
      <div className="text-white font-semibold text-center text-xs md:text-sm leading-tight break-words w-full">
        {label}
      </div>
      
      {percentage && (
        <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-white/90 border border-white/10">
          {percentage}%
        </div>
      )}

      {/* Invisible source handle */}
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !opacity-0" />
    </div>
  );
}
