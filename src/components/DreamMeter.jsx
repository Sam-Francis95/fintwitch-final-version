import React from 'react';
import { motion } from 'framer-motion';
import { FINANCIAL_KNOWLEDGE } from '../data/lifeScenarios';

const TIERS = FINANCIAL_KNOWLEDGE.tiers;

function getTier(score) {
    return TIERS.find(t => score >= t.min && score <= t.max) || TIERS[0];
}

function getNextTier(score) {
    return TIERS.find(t => t.min > score) || null;
}

export default function FinancialKnowledgeMeter({ score }) {
    const clampedScore = Math.min(100, Math.max(0, score));
    const tier = getTier(clampedScore);
    const nextTier = getNextTier(clampedScore);
    const progressToNext = nextTier
        ? ((clampedScore - tier.min) / (nextTier.min - tier.min)) * 100
        : 100;

    const barColor =
        clampedScore >= 80 ? '#f59e0b' :
        clampedScore >= 60 ? '#10b981' :
        clampedScore >= 40 ? '#3b82f6' :
        clampedScore >= 20 ? '#8b5cf6' :
        '#64748b';

    return (
        <div className="space-y-4">
            {/* Score Display */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{tier.badge}</span>
                    <div>
                        <div className="text-base font-black text-white">{tier.label}</div>
                        <div className="text-xs text-slate-400">{tier.description}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black font-mono" style={{ color: barColor }}>
                        {clampedScore}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">IQ pts</div>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                    <span>0 — Novice</span>
                    <span>100 — Expert</span>
                </div>
                <div className="h-3 bg-slate-800/60 rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clampedScore}%` }}
                        transition={{ duration: 1, type: 'spring', stiffness: 60 }}
                        className="h-full rounded-full relative z-10"
                        style={{ backgroundColor: barColor, boxShadow: `0 0 10px ${barColor}88` }}
                    />
                    {/* Tier markers */}
                    {TIERS.slice(1).map(t => (
                        <div
                            key={t.min}
                            className="absolute top-0 bottom-0 w-px bg-white/10"
                            style={{ left: `${t.min}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Tier step badges */}
            <div className="flex items-center justify-between gap-1">
                {TIERS.map((t, i) => {
                    const reached = clampedScore >= t.min;
                    const isCurrent = tier.min === t.min;
                    return (
                        <div key={t.min} className="flex-1 flex flex-col items-center gap-1 relative group">
                            {/* connector line */}
                            {i < TIERS.length - 1 && (
                                <div className={`absolute top-4 left-1/2 w-full h-px transition-all duration-500 ${reached && clampedScore >= TIERS[i+1]?.min ? 'bg-amber-500/40' : 'bg-white/5'}`} />
                            )}
                            <span className={`text-xl leading-none relative z-10 transition-all duration-500 ${reached ? '' : 'grayscale opacity-30'} ${isCurrent ? 'scale-125' : ''}`}>
                                {t.badge}
                            </span>
                            {/* tooltip on hover */}
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-4 whitespace-nowrap">
                                {t.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Progress to next tier */}
            {nextTier && (
                <div className="border-t border-white/5 pt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress to <span className="text-slate-300">{nextTier.badge} {nextTier.label}</span></span>
                        <span className="font-mono" style={{ color: barColor }}>{Math.round(progressToNext)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: barColor }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5">
                        {nextTier.min - clampedScore} more points to unlock {nextTier.badge} {nextTier.label}
                    </p>
                </div>
            )}

            {clampedScore >= 80 && (
                <div className="text-center py-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">🏆 Maximum Tier Reached</span>
                </div>
            )}
        </div>
    );
}

