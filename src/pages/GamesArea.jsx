import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { CAREER_LEVELS } from "../data/careerLevels";
import { fmt } from "../utils/format";
import { TrendingUp, Gamepad2, Award, Lock, BookOpen, Calculator, Flame, PieChart, Home, ArrowUpCircle, Shield, Gem } from "lucide-react";
import FinancialChatbot from "../components/FinancialChatbot";

export default function GamesArea() {
    const { user } = useContext(UserContext);
    const currentLevel = user?.careerLevel || 1;

    return (
        <div className="space-y-12 font-body max-w-6xl mx-auto">

            {/* Welcome Hero */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-4xl font-heading font-bold text-white mb-2">
                        Career & Games
                    </h2>
                    <p className="text-slate-400 max-w-xl text-lg">
                        Unlock new levels, earn rewards, and simulate real-world financial scenarios.
                    </p>
                </div>
                <div className="flex gap-6">
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Current Level</div>
                        <div className="text-3xl font-bold text-white flex items-center justify-end gap-2">
                            <Award className="text-brand-accent" /> {currentLevel}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Net Worth</div>
                        <div className="text-3xl font-bold text-brand-success">{fmt(user?.balance || 0)}</div>
                    </div>
                </div>
            </div>

            {/* Career Path Grid */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-brand-accent" />
                    <h3 className="text-xl font-bold text-white">Career Path</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {CAREER_LEVELS.map((lvl) => {
                        const locked = lvl.id > currentLevel;
                        const completed = lvl.id < currentLevel;

                        return (
                            <Link
                                to={locked ? "#" : `/games/career/${lvl.id}`}
                                key={lvl.id}
                                className={`p-6 rounded-2xl border transition-all duration-300 group ${locked
                                    ? "bg-white/5 border-transparent cursor-not-allowed opacity-50"
                                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 cursor-pointer"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${locked ? "bg-white/5 text-slate-500" : "bg-white/10 text-white"
                                        }`}>
                                        LEVEL {lvl.id}
                                    </span>
                                    {locked ? <Lock size={16} className="text-slate-600" /> : completed ? <span className="text-brand-success text-lg">✓</span> : null}
                                </div>

                                <h4 className={`text-xl font-bold mb-2 ${locked ? "text-slate-500" : "text-white group-hover:text-blue-400 transition-colors"}`}>
                                    {lvl.title}
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {lvl.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
                {/* Unlocked Toolkit Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Calculator className="text-brand-accent" />
                        <h3 className="text-xl font-bold text-white">YourToolkit</h3>
                    </div>

                    {user?.unlockedTools?.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {user.unlockedTools.map(toolKey => {
                                const toolMap = {
                                    expense_splitter: { label: "Expense Splitter", icon: <PieChart size={20} /> },
                                    emergency_fund: { label: "Emergency & Savings", icon: <Shield size={20} /> },
                                    fire: { label: "FIRE & Inflation", icon: <Flame size={20} /> },
                                    tax: { label: "Tax Estimator", icon: <BookOpen size={20} /> },
                                    return: { label: "CAGR Return", icon: <TrendingUp size={20} /> },
                                    sip: { label: "SIP & Lump Sum", icon: <PieChart size={20} /> },
                                    emi: { label: "Loan EMI", icon: <Home size={20} /> },
                                    inflation: { label: "Inflation Check", icon: <ArrowUpCircle size={20} /> },
                                    wealth_dashboard: { label: "Wealth Dashboard", icon: <Gem size={20} /> }
                                };
                                const info = toolMap[toolKey] || { label: toolKey, icon: <Calculator size={20} /> };

                                return (
                                    <Link to="/tools" key={toolKey} className="group p-4 bg-brand-surface border border-white/5 rounded-xl hover:border-brand-primary/50 transition-all flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-brand-dark flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                            {info.icon}
                                        </div>
                                        <span className="font-bold text-slate-300 group-hover:text-white">{info.label}</span>
                                    </Link>
                                )
                            })}
                            {/* Placeholder for next unlock */}
                            <div className="p-4 border border-white/5 border-dashed rounded-xl flex items-center gap-4 opacity-50">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <Lock size={18} className="text-slate-500" />
                                </div>
                                <span className="text-sm text-slate-500">Play levels to unlock more</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-white/5 rounded-xl text-center text-slate-400">
                            Complete levels to unlock financial tools.
                        </div>
                    )}
                </div>

            </div>

            {/* Financial Chatbot Integration */}
            <FinancialChatbot />
        </div>
    );
}
