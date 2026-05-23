"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";
import { CompanyData } from "@/types";

export default function AIChatPanel({ companyData }: { companyData: CompanyData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: `Chào bạn! Tôi là trợ lý AI phân tích dữ liệu. Bạn muốn hỏi gì về hệ sinh thái của **${companyData.company_name}**?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // If company changes, reset the chat
  useEffect(() => {
    setMessages([
      { role: 'ai', text: `Chào bạn! Tôi là trợ lý AI phân tích dữ liệu. Bạn muốn hỏi gì về hệ sinh thái của **${companyData.company_name}**?` }
    ]);
  }, [companyData.company_name]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        message: userMsg,
        companyContext: companyData
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Xin lỗi, đã có lỗi xảy ra khi kết nối tới AI Chat. Vui lòng thử lại." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:scale-110 transition-transform z-50 text-white"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Trợ lý AI Phân tích</h3>
                <p className="text-emerald-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm whitespace-pre-wrap'
                }`}>
                  {msg.role === 'ai' && <Bot size={14} className="mb-2 text-blue-400" />}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> AI đang suy nghĩ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-800/50 border-t border-slate-700">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Hỏi về ${companyData.company_name}...`}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
