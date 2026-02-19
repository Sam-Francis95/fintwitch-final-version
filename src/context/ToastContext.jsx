import React, { createContext, useState, useRef, useContext } from "react";

export const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

// ---------- Toasts ----------
export function ToastsProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(1);

    const push = (text, opts = {}) => {
        const id = idRef.current++;
        setToasts((t) => [
            ...t,
            { id, text, ttl: opts.ttl || 3000, style: opts.style || "default" },
        ]);
        setTimeout(
            () => setToasts((t) => t.filter((x) => x.id !== id)),
            opts.ttl || 3000
        );
    };

    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-all
              ${t.style === "success"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : t.style === "danger"
                                    ? "bg-red-100 text-red-800 border border-red-300"
                                    : "bg-white text-slate-700 border border-slate-200"
                            }`}
                    >
                        {t.text}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
