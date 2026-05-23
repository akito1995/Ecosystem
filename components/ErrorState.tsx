import { AlertCircle } from "lucide-react";

export default function ErrorState({ error, retry }: { error: string; retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full p-6 text-center">
      <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi</h3>
      <p className="text-gray-400 mb-6 max-w-md">{error}</p>
      {retry && (
        <button 
          onClick={retry}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
