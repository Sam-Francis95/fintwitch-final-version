import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import {
    Home,
    Gamepad2,
    Calculator,
    BookOpen,
    Flame,
    CreditCard,
    TrendingUp,
    Sparkles,
    Rocket,
    Wallet,
    Activity
} from "lucide-react";

import useGameStore from "../store/useGameStore";
import { getLevelProgress } from "../utils/gamification";

// ---------- Left Nav (Neon Blue 3D) ----------
export default function LeftNav() {
    const location = useLocation();
    const { user } = useUser();

    // Game Store State
    const { xp, level, streak } = useGameStore();
    const { progressPercent } = getLevelProgress(xp);

    const pathname = location.pathname;

    const allLinks = [
        { label: "Mission Control", to: "/", icon: Home, modes: ['career', 'financial_tools'] },
        { label: "Career Mode", to: "/games", icon: Gamepad2, modes: ['career'] },
        { label: "Stock Market", to: "/games/stockmarket", icon: TrendingUp, modes: ['financial_tools'] },
        { label: "Dream Life", to: "/games/dreamlife", icon: Sparkles, modes: ['career', 'financial_tools'] },
        { label: "Tools Bay", to: "/tools", icon: Calculator, modes: ['career', 'financial_tools'] },
        { label: "Data Logs", to: "/articles", icon: BookOpen, modes: ['career', 'financial_tools'] },
        { label: "Habit Core", to: "/habit", icon: Flame, modes: ['career', 'financial_tools'] },
        { label: "Treasury", to: "/transactions", icon: CreditCard, modes: ['career', 'financial_tools'] },
        { label: "Budget Vault", to: "/budget", icon: Wallet, modes: ['career', 'financial_tools'] },
        { label: "Pathway Analytics", to: "/pathway", icon: Activity, modes: ['career', 'financial_tools'] },
    ];

    const links = allLinks.filter(link => !link.modes || link.modes.includes(user?.mode || 'career'));

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
            },
        }),
    };

    return (
        <nav className="h-full flex flex-col font-sans">
            {/* Scrollable Container Start */}
            <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar px-1">

                <div className="mb-6 px-4 pt-2 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Rocket className="text-cyan-400 rotate-45 animate-bounce-slow" size={20} />
                        <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">Star Map</p>
                    </div>

                    {/* NEW: Stats Card */}
                    <div className="mb-4 bg-white/5 rounded-xl p-3 border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold font-heading text-white flex items-center gap-1 tracking-wide">
                                <span className="text-yellow-400">⚡</span> LVL {level}
                            </span>
                            <span className="text-[10px] text-cyan-300 font-mono tracking-wider">{xp} XP</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Flame size={10} className={streak > 0 ? "text-orange-500" : "text-slate-600"} />
                            <span className={streak > 0 ? "text-orange-200" : ""}>{streak} Day Streak</span>
                        </div>
                    </div>

                    <div className="h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent w-full rounded-full"></div>
                </div>

                <ul className="space-y-3 px-3">
                    {links.map((link, i) => {
                        // Strict Active Logic
                        let active = false;

                        if (link.to === "/") {
                            active = pathname === "/";
                        } else if (link.to === "/games") {
                            active = pathname === "/games";
                        } else {
                            active = pathname.startsWith(link.to);
                        }

                        const Icon = link.icon;

                        return (
                            <motion.li
                                key={link.to}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={itemVariants}
                            >
                                <Link
                                    to={link.to}
                                    className="block relative"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden ${active
                                            ? "text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] translate-x-2"
                                            : "text-slate-400 hover:text-cyan-100"
                                            }`}
                                    >
                                        {/* Active Background Layer (Cyan Gradient) */}
                                        {active && (
                                            <motion.div
                                                layoutId="activeNavBackground"
                                                className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 opacity-90 border border-cyan-400/30"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        {/* Hover Effect Layer */}
                                        {!active && (
                                            <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity border border-transparent group-hover:border-cyan-400/20 rounded-2xl"></div>
                                        )}

                                        <div className="relative z-10 flex items-center gap-4 w-full">
                                            <div className={`p-1.5 rounded-lg transition-all ${active ? "bg-white/20" : "bg-white/5 group-hover:bg-cyan-400/10"}`}>
                                                <Icon
                                                    size={18}
                                                    className={`transition-colors duration-300 ${active ? "text-white" : "text-slate-400 group-hover:text-cyan-300"}`}
                                                />
                                            </div>

                                            <span className="tracking-wide">
                                                {link.label}
                                            </span>

                                            {active && <Sparkles size={14} className="ml-auto text-yellow-300 animate-pulse" />}
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>

                {/* Daily Motivation - 3D Bubble (Cyan Theme) */}
                <div className="mt-8 px-4 pb-6 shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        className="p-1 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 cursor-pointer group"
                    >
                        <div className="bg-[#020617] rounded-[22px] p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-400/30 transition-all"></div>

                            <h4 className="relative text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200 mb-2 uppercase tracking-wider">
                                Neon Wisdom
                            </h4>
                            <p className="relative text-xs text-slate-300 font-medium leading-relaxed italic">
                                "The best investment you can make is in yourself."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* Scrollable Container End */}
        </nav>
    );
}
