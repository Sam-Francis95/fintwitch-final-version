import React from 'react';
import { motion } from 'framer-motion';

export default function DreamMeter({ dream, score }) {
    // Score is 0-100
    const clampedScore = Math.min(100, Math.max(0, score));

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{dream.icon}</span>
                    <span className="text-sm font-bold text-slate-200">{dream.label}</span>
                </div>
                <span className="text-sm font-mono font-bold" style={{ color: dream.color }}>
                    {clampedScore}%
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden border border-white/5 relative">
                {/* Glow Effect behind the bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedScore}%` }}
                    transition={{ duration: 1, type: "spring" }}
                    className="h-full relative z-10"
                    style={{ backgroundColor: dream.color }}
                />

                {/* Ambient Glow */}
                <div
                    className="absolute top-0 left-0 h-full w-full blur-sm opacity-50"
                    style={{
                        width: `${clampedScore}%`,
                        backgroundColor: dream.color
                    }}
                />
            </div>
        </div>
    );
}
