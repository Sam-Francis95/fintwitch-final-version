import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import AnimatedBalance from "./AnimatedBalance";
import { Search, User, LogOut } from "lucide-react"; // Added Icons
import { Link, useNavigate } from "react-router-dom";
import { findBestMatch } from "../data/searchIndex";

// ---------- Header (Polished) ----------
export default function Header() {
    const { user, login, logout } = useUser();
    const { push } = useToast();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const match = findBestMatch(searchQuery);

            if (match) {
                navigate(match.path);
                push(`Navigating to ${match.title}`, "success");
            } else {
                push("No matching tool or game found. Try 'stock', 'career', or 'tools'.", "error");
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-[1440px] mx-auto px-6 h-[90px] flex items-center justify-between">

                {/* Logo Area */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white font-bold text-2xl group-hover:rotate-12 transition-transform">
                            F
                        </div>
                        <div>
                            {/* Gamified Header text with Neon Pulse */}
                            <h1 className="text-4xl font-heading font-black text-white tracking-wide relative text-glow-mega">
                                <span className="absolute -inset-1 blur-sm bg-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
                                <span className="relative drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">FinTwitch</span>
                            </h1>
                            <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">City</span>
                        </div>
                    </Link>

                    {/* Search Bar (Functional) */}
                    <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all w-[350px] group/search">
                        <Search size={18} className="text-slate-500 group-hover/search:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Type keyword & hit Enter (e.g. 'stock', 'tools')"
                            className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {!user?.username ? (
                        <Link to="/login" className="btn-primary py-2 px-6 text-sm">
                            Login / Sign Up
                        </Link>
                    ) : (
                        <>
                            {/* Notifications Removed as requested */}

                            {/* Balance Pill */}
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Balance</span>
                                <div className="font-mono font-bold text-brand-success text-lg leading-none drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                                    <AnimatedBalance value={user.balance || 0} />
                                </div>
                            </div>

                            {/* Mode Switcher */}
                            <button
                                onClick={() => navigate("/mode-selection")}
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all text-xs font-medium text-slate-400 hover:text-white mr-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                                Switch Mode
                            </button>

                            {/* User Profile */}
                            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                                <div className="text-right hidden lg:block">
                                    <div className="font-bold text-white text-sm">{user.username}</div>
                                    <div className="text-xs text-cyan-400 font-bold">
                                        {user.mode === 'financial_tools' ? 'Financial Wizard' : `Lvl ${user.careerLevel || 1} Investor`}
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-transparent hover:border-cyan-500 transition-all flex items-center justify-center shadow-lg">
                                    <User size={20} className="text-slate-300" />
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
