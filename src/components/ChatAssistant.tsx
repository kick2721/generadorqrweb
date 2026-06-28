"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatAssistant({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const ask = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, question: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer || "Lo siento, no pude procesar tu pregunta." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ocurrió un error. Intenta de nuevo." }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => { setOpen(true); setMessages([{ role: "assistant", content: `¡Hola! Soy el asistente de **${title}**. ¿Qué quieres saber sobre este enlace?` }]); }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition active:scale-90 flex items-center justify-center z-50"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-purple-600 text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="font-semibold text-sm">Asistente QR</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-purple-600 text-white rounded-br-md"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md"
                }`}>
                  {m.content.split("**").map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="Pregunta sobre este enlace..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
              <button onClick={ask} disabled={loading || !input.trim()} className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
