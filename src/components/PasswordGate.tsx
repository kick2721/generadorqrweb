"use client";

import { useState } from "react";

export default function PasswordGate({ config, redirectTo }: { config: any; redirectTo: string }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = () => {
    if (input === config?.password) {
      setUnlocked(true);
      if (redirectTo.startsWith("http")) window.location.href = redirectTo;
    } else {
      setError(true);
    }
  };

  if (unlocked) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-lg font-semibold mb-1">Contenido Protegido</p>
        {config?.passwordHint && <p className="text-sm text-gray-500 mb-4">Pista: {config.passwordHint}</p>}
        <input type="password" placeholder="Contraseña" value={input} onChange={(e) => { setInput(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none mb-3" />
        {error && <p className="text-xs text-red-500 mb-3">Contraseña incorrecta</p>}
        <button onClick={handleSubmit} className="w-full px-5 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">Desbloquear</button>
      </div>
    </div>
  );
}
