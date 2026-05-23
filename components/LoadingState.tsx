import React from 'react';

export default function LoadingState({ message = "Đang tải dữ liệu..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full bg-transparent">
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        {/* Outer rotating dashed ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/30 animate-[spin_10s_linear_infinite]"></div>
        
        {/* Inner rotating gradient ring */}
        <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[spin_2s_linear_infinite]"></div>
        <div className="absolute inset-2 rounded-full border-2 border-blue-500/10"></div>

        {/* Core pulsating orb */}
        <div className="w-14 h-14 bg-blue-500/20 rounded-full blur-md animate-pulse absolute"></div>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] z-10 animate-pulse relative flex items-center justify-center">
           <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>

        {/* Orbiting particles */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
          <div className="absolute top-0 left-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)] -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite_reverse]">
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)] -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Đang Phân Tích Hệ Sinh Thái
        </h3>
        <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
