import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";

// ---------- Habit Tracker (Premium Redesign) ----------
export default function HabitTracker() {
    const { user, updateHabitStats } = useContext(UserContext);
    const today = new Date().toISOString().split("T")[0];

    // Automating tasks from UserContext
    // If usage data is missing (legacy), default to empty
    const daily = user.dailyActions?.date === today ? user.dailyActions : { readArticle: false, careerLevel: false, reviewPortfolio: false };

    const tasks = [
        { id: 'readArticle', text: "Read 1 Article", done: daily.readArticle },
        { id: 'careerLevel', text: "Complete Career Level", done: daily.careerLevel },
        { id: 'reviewPortfolio', text: "Review Portfolio", done: daily.reviewPortfolio },
    ];

    // Streak is now managed in Context, we just read it.
    // We can keep `streak` variable for compatibility if used below.
    const streak = { current: user.streak || 0 };

    const [selfAssessment, setSelfAssessment] = useState(() => {
        return user?.habitStats || { savings: { score: 1, note: "" }, spending: { score: 1, note: "" }, investing: { score: 1, note: "" } };
    });

    // No toggleTask needed (Automated)
    const getYesterday = () => {
        const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split("T")[0];
    };

    // No useEffect for streak calculation needed here anymore.

    const handleReset = () => {
        if (window.confirm("Reset habits? (Dev Only)")) {
            // No-op for now as state is in Context
            // localStorage.removeItem("fintwitch_streak");
            // setStreak({ current: 0, best: 0, lastDate: null, history: [] });
            // setTasks((t) => t.map((task) => ({ ...task, done: false })));
        }
    };

    // Simplified Heatmap - Just show current day for now as history migration is tricky
    // Or we keep it static.
    const last30 = [...Array(30)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (29 - i));
        const dateStr = d.toISOString().split("T")[0];
        // Check local state or user context logic if we added history. 
        // For now, let's just highlight today if streak is active.
        const active = user.lastStreakCompletion === dateStr;
        return { dateStr, active };
    });

    const handleSelfChange = (domain, field, value) => {
        setSelfAssessment((prev) => {
            const updated = { ...prev, [domain]: { ...(prev[domain] || {}), [field]: value } };
            if (field === "score" || field === "note") updateHabitStats(domain, Number(updated[domain].score) || 1, updated[domain].note || "");
            return updated;
        });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Habit Tracker 🔥</h2>
                    <p className="text-slate-400">Consistency is the currency of success.</p>
                </div>
                <button onClick={handleReset} className="text-xs text-slate-500 hover:text-brand-danger transition">
                    Reset Progress
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Tasks */}
                <div className="card-glass p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Today's Focus</h3>
                    <div className="space-y-3">
                        {tasks.map((t) => (
                            <div
                                key={t.id}
                                className={`w-full flex items-center p-3 rounded-xl border transition-all ${t.done
                                    ? "bg-brand-success/10 border-brand-success/30 text-brand-success"
                                    : "bg-brand-surface border-slate-700 text-slate-300"
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-md border mr-3 flex items-center justify-center ${t.done ? "bg-brand-success border-brand-success" : "border-slate-500"}`}>
                                    {t.done && <span className="text-black text-xs">✓</span>}
                                </div>
                                <span className={t.done ? "line-through opacity-70" : ""}>{t.text}</span>
                                {!t.done && <span className="ml-auto text-[10px] text-slate-500 bg-brand-dark px-2 py-1 rounded">Auto</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Streak Heatmap */}
                <div className="card-glass p-6">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-bold text-white">Consistency Streak</h3>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-brand-accent">{streak.current}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider block">Current Streak</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-10 gap-2 mb-2">
                        {last30.map((d, i) => (
                            <div
                                key={i}
                                title={d.dateStr}
                                className={`w-full aspect-square rounded-sm transition-all ${d.active
                                    ? "bg-brand-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                    : "bg-brand-dark border border-slate-800"
                                    }`}
                            ></div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 text-right mt-2">Past 30 Days</p>
                </div>
            </div>

            {/* Reflections */}
            <div className="card-glass p-6">
                <h3 className="text-lg font-bold text-white mb-6">Weekly Self-Review 🧠</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {["savings", "spending", "investing"].map((domain) => (
                        <div key={domain} className="bg-brand-dark/50 p-4 rounded-xl border border-white/5">
                            <p className="font-bold text-brand-primary capitalize mb-3 text-sm tracking-wide border-b border-white/5 pb-2">
                                {domain}
                            </p>

                            <div className="mb-3">
                                <label className="text-xs text-slate-400 block mb-1">Performance (1-5)</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => handleSelfChange(domain, "score", star)}
                                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition ${(selfAssessment[domain]?.score || 0) >= star
                                                ? "bg-brand-primary text-white"
                                                : "bg-brand-surface text-slate-600"
                                                }`}
                                        >
                                            {star}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <label className="block">
                                <span className="text-xs text-slate-400 block mb-1">Notes</span>
                                <textarea
                                    rows={3}
                                    value={selfAssessment[domain]?.note || ""}
                                    onChange={(e) => handleSelfChange(domain, "note", e.target.value)}
                                    className="w-full p-2 rounded-lg bg-brand-surface border border-slate-700 text-xs text-white resize-none focus:border-brand-primary outline-none"
                                    placeholder="..."
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
