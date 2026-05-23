"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Building2, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]">
      <Command 
        className="w-[600px] max-w-[90vw] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <div className="flex items-center border-b border-slate-800 px-4">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <Command.Input 
            autoFocus
            id="cmd-input"
            placeholder="Tìm kiếm công ty, tập đoàn (VD: Vingroup, Masan) rồi ấn Enter..." 
            className="w-full bg-transparent text-white placeholder-slate-400 text-base py-4 outline-none border-none ring-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value;
                if (val.trim()) {
                  router.push(`/company/${encodeURIComponent(val.trim())}`);
                  setOpen(false);
                }
              }
            }}
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
          <Command.Empty className="py-6 text-center text-slate-400 text-sm">Không tìm thấy kết quả nào.</Command.Empty>

          <Command.Group heading="Gợi ý phổ biến" className="text-xs text-slate-500 px-2 py-2 mb-2">
            <Command.Item 
              onSelect={() => { router.push("/company/Vingroup"); setOpen(false); }}
              className="group flex items-center px-3 py-3 text-sm text-slate-200 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
            >
              <Building2 className="w-4 h-4 mr-3 text-blue-400 group-hover:text-white" />
              Tập đoàn Vingroup
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/company/Masan"); setOpen(false); }}
              className="group flex items-center px-3 py-3 text-sm text-slate-200 rounded-lg hover:bg-emerald-600 hover:text-white cursor-pointer transition-colors"
            >
              <Building2 className="w-4 h-4 mr-3 text-emerald-400 group-hover:text-white" />
              Tập đoàn Masan
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/company/FPT"); setOpen(false); }}
              className="group flex items-center px-3 py-3 text-sm text-slate-200 rounded-lg hover:bg-orange-600 hover:text-white cursor-pointer transition-colors"
            >
              <Briefcase className="w-4 h-4 mr-3 text-orange-400 group-hover:text-white" />
              Tập đoàn FPT
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
      
      {/* Click overlay to close */}
      <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
    </div>
  );
}
