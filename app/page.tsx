import SearchBar from "@/components/SearchBar";

export default function Home() {
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
        
        <SearchBar />
      </div>
    </main>
  );
}
