import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";
import { Trophy, Coins, TrendingUp, History, Star, Shield, Crown } from "lucide-react";

// --- 3D Components ---

const Coin3D = ({ size = "md" }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    };

    return (
        <div className={`${sizeClasses[size]} relative group`}>
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-lg shadow-yellow-500/30 transform transition-transform group-hover:rotate-y-12 border-2 border-yellow-200">
                {/* Inner Face */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-200 flex items-center justify-center border border-yellow-600/50">
                    <span className="font-bold text-yellow-800 text-xs">$</span>
                </div>
            </div>
            {/* Shine */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/40 blur-sm rounded-full pointer-events-none"></div>
        </div>
    );
};

const Badge3D = ({ type, locked }) => {
    const styles = {
        bronze: {
            bg: "from-orange-400 to-orange-700",
            border: "border-orange-300",
            shadow: "shadow-orange-900/50",
            icon: Shield,
            label: "BRONZE"
        },
        silver: {
            bg: "from-slate-300 to-slate-500",
            border: "border-slate-200",
            shadow: "shadow-slate-500/50",
            icon: Star,
            label: "SILVER"
        },
        gold: {
            bg: "from-yellow-300 to-yellow-600",
            border: "border-yellow-200",
            shadow: "shadow-yellow-500/50",
            icon: Crown,
            label: "GOLD"
        }
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <div className={`relative flex flex-col items-center ${locked ? "opacity-50 grayscale" : ""}`}>
            <motion.div
                whileHover={!locked ? { scale: 1.1, rotateZ: 5 } : {}}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${style.bg} relative flex items-center justify-center shadow-xl ${style.shadow} border-y-4 ${style.border} transform-style-3d`}
            >
                <div className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none"></div>
                <div className="relative z-10 text-white drop-shadow-md">
                    <Icon size={40} strokeWidth={2.5} />
                </div>

                {/* 3D Depth Sides (Fake) */}
                <div className="absolute -bottom-2 w-full h-4 bg-black/30 rounded-b-xl blur-sm"></div>
            </motion.div>

            {/* Label Plate */}
            <div className={`mt-3 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md`}>
                <span className={`text-[10px] font-black tracking-widest ${locked ? "text-slate-500" : "text-white"}`}>
                    {style.label}
                </span>
            </div>

            {locked && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-slate-800 text-slate-400 p-1 rounded-full border border-slate-600 z-20">
                    <History size={12} />
                </div>
            )}
        </div>
    );
};

export default function TransactionsArea() {
    const { user } = useContext(UserContext);

    // --- Logic ---
    const STARTING_BALANCE = 1000;
    const currentBalance = user?.balance || 0;

    // Progress Logic
    const BRONZE_REQ = 3000;
    const SILVER_REQ = 4000;
    const GOLD_REQ = 5000;

    let nextGoal = BRONZE_REQ;
    let nextLabel = "Bronze";
    let progressPercent = 0;

    if (currentBalance < BRONZE_REQ) {
        nextGoal = BRONZE_REQ;
        nextLabel = "Bronze";
        progressPercent = Math.min(100, (currentBalance / BRONZE_REQ) * 100);
    } else if (currentBalance < SILVER_REQ) {
        nextGoal = SILVER_REQ;
        nextLabel = "Silver";
        progressPercent = Math.min(100, ((currentBalance - BRONZE_REQ) / (SILVER_REQ - BRONZE_REQ)) * 100);
    } else if (currentBalance < GOLD_REQ) {
        nextGoal = GOLD_REQ;
        nextLabel = "Gold";
        progressPercent = Math.min(100, ((currentBalance - SILVER_REQ) / (GOLD_REQ - SILVER_REQ)) * 100);
    } else {
        nextGoal = GOLD_REQ;
        nextLabel = "MAX";
        progressPercent = 100;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 font-sans perspective-1000">

            {/* Header Area */}
            <div className="text-center relative">
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-heading uppercase tracking-tighter drop-shadow-sm">
                    My Treasury
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-4 rounded-full"></div>
            </div>

            {/* 3D Dashboard Deck */}
            <div className="grid md:grid-cols-2 gap-8 items-center">

                {/* Left: Balance Card (Tilt Effect) */}
                <motion.div
                    initial={{ rotateX: 10, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="relative group perspective-card"
                >
                    <div className="absolute inset-0 bg-blue-600 blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>

                    <div className="relative bg-[#0f0f11]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden transform transition-transform group-hover:scale-[1.02]">
                        {/* Decorative Grid */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Coins size={120} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-blue-400 font-mono text-sm uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                Live Balance
                            </div>
                            <div className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
                                <Coin3D size="md" />
                                {currentBalance.toLocaleString()}
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                <div>
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Starting Balance</div>
                                    <div className="text-xl font-bold text-slate-300 font-mono">{STARTING_BALANCE}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Total Logic Gain</div>
                                    <div className={`text-xl font-bold font-mono ${currentBalance >= STARTING_BALANCE ? "text-green-400" : "text-red-400"}`}>
                                        {currentBalance >= STARTING_BALANCE ? "+" : ""}{currentBalance - STARTING_BALANCE}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Badge Progression System */}
                <div className="bg-[#0f0f11]/50 border border-white/5 rounded-3xl p-8 relative">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Trophy className="text-yellow-400" />
                        Rank Progression
                    </h3>

                    {/* Badge Row */}
                    <div className="flex justify-between items-end mb-8 relative z-10 px-2">
                        <Badge3D type="bronze" locked={currentBalance < BRONZE_REQ} />
                        <Badge3D type="silver" locked={currentBalance < SILVER_REQ} />
                        <Badge3D type="gold" locked={currentBalance < GOLD_REQ} />

                        {/* Connecting Line (Behind) */}
                        <div className="absolute bottom-12 left-0 w-full h-2 bg-white/5 rounded-full -z-10 top-1/2 -translate-y-1/2"></div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase">
                            <span>Current</span>
                            <span>Next: {nextLabel} ({nextGoal})</span>
                        </div>
                        <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
                            {/* Liquid Gold Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.6)] relative"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </motion.div>
                        </div>
                        <p className="text-center text-xs text-slate-400 mt-3">
                            Earn <strong>{nextGoal - currentBalance}</strong> more coins to unlock {nextLabel} Badge!
                        </p>
                    </div>
                </div>
            </div>

            {/* 3D Transaction List */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <History size={24} className="text-slate-400" />
                    Ledger History
                </h3>

                {(!user.transactions || user.transactions.length === 0) ? (
                    <div className="text-center py-20 text-slate-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="mb-4 flex justify-center opacity-20">
                            <Coins size={48} />
                        </div>
                        No transactions yet. Play games to earn logic points!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {user.transactions
                            ?.slice()
                            .reverse()
                            .map((tx, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={tx.id}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                                    <div className="relative bg-[#1a1a1c] border border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-black/20 transform transition-all hover:translate-x-1 hover:border-white/10 hover:shadow-xl">

                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${tx.amount >= 0
                                                    ? "bg-gradient-to-br from-green-900/50 to-green-800/20 border border-green-500/30 text-green-400"
                                                    : "bg-gradient-to-br from-red-900/50 to-red-800/20 border border-red-500/30 text-red-400"
                                                }`}>
                                                {tx.amount >= 0 ? <TrendingUp size={20} /> : <TrendingUp size={20} className="rotate-180" />}
                                            </div>

                                            <div>
                                                <div className="font-bold text-slate-200 group-hover:text-white transition-colors text-lg">
                                                    {tx.label || tx.source}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono">
                                                    ID: {tx.id.toString().slice(-6)} • {new Date(tx.ts).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`text-xl font-black font-mono tracking-tight ${tx.amount >= 0 ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]" : "text-red-400"
                                            }`}>
                                            {tx.amount >= 0 ? "+" : ""}
                                            {Math.abs(tx.amount).toFixed(0)}
                                            <span className="text-xs ml-1 opacity-50">PTS</span>
                                        </div>

                                    </div>
                                </motion.div>
                            ))}
                    </div>
                )}
            </div>

        </div>
    );
}
