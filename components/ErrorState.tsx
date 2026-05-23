import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorState({ error, retry }: { error: string; retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full p-6 text-center">
      <div className="relative group mb-8">
        <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-[#1A2235]/80 backdrop-blur-md border border-red-500/30 text-red-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <AlertTriangle size={48} strokeWidth={1.5} />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Không Thể Tải Dữ Liệu</h3>
      <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-lg">
        {error}
      </p>
      
      {retry && (
        <button 
          onClick={retry}
          className="group relative px-8 py-3.5 bg-transparent overflow-hidden rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 w-full h-full border border-red-500/40 rounded-xl bg-red-500/5 group-hover:bg-red-500/15 transition-colors"></div>
          <div className="relative flex items-center gap-3 text-red-400 group-hover:text-red-300 font-medium tracking-wide">
            <RefreshCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
            Thử lại
          </div>
        </button>
      )}
    </div>
  );
}
