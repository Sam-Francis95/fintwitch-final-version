import React, { useState, useEffect, useRef } from "react";
import { round2, fmt } from "../utils/format";

// ---------- Animated Balance ----------
export default function AnimatedBalance({ value }) {
    const [display, setDisplay] = useState(value);
    const rafRef = useRef(null);

    useEffect(() => {
        const start = display;
        const end = value;
        const dur = 400;
        const startTime = performance.now();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        const step = (now) => {
            const t = Math.min(1, (now - startTime) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            const v = start + (end - start) * eased;
            setDisplay(round2(v));
            if (t < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [value]);

    return <div className="font-semibold text-lg">{fmt(display)}</div>;
}
