import { useState, useEffect } from "react";

// ---------- Local Storage Hook ----------
export function useLocalState(key, initial) {
    const [state, setState] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : initial;
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}
