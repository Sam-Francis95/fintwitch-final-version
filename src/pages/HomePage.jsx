import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap } from "lucide-react";

// ---------- Home Page (Masterpiece Redesign) ----------
export default function HomePage() {
    return (
        <div className="font-body">

            {/* HERO SECTION */}
            <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span>The Future of Finance Learning</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 tracking-tighter leading-[1.1] mb-8 font-heading">
                        Master Money. <br />
                        <span className="text-white">Build Legacy.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
                        Experience the thrill of the stock market, manage a virtual career,
                        and unlock premium financial tools—all in a risk-free environment.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link
                            to="/games"
                            className="btn-primary text-base h-12 px-8 flex items-center justify-center"
                        >
                            Start Career
                        </Link>
                        <Link
                            to="/tools"
                            className="h-12 px-8 rounded-xl border border-white/10 flex items-center justify-center text-slate-300 font-bold hover:bg-white/5 hover:text-white transition-colors"
                        >
                            View Tools
                        </Link>
                    </div>
                </motion.div>

                {/* Stats / Trust Grid */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    {[
                        { icon: TrendingUp, title: "Real-Time Sim", desc: "Live market volatility engine" },
                        { icon: Shield, title: "Risk-Free", desc: "Learn without losing real money" },
                        { icon: Zap, title: "Gamified", desc: "Level up to unlock new tools" }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center card-glass">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1 font-heading">{item.title}</h3>
                            <p className="text-slate-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>

            </section>

        </div>
    );
}
