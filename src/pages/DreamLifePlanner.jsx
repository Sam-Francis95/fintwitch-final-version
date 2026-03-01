import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";
import { Activity, AlertTriangle, Shield, Zap, Brain, TrendingUp, TrendingDown } from "lucide-react";

// Data
import { SCENARIOS } from "../data/lifeScenarios";

// Components
import FinancialKnowledgeMeter from "../components/DreamMeter";
import AlternatePath from "../components/AlternatePath";

const INGEST_URL = "http://localhost:8000/ingest";
const METRICS_URL = "http://localhost:8000/metrics";
const ALERTS_URL = "http://localhost:8000/alerts";

const INITIAL_FK_SCORE = 10;

async function postToPathway(choice) {
    try {
        await fetch(INGEST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event_id: `finiq_${Date.now()}`,
                type: choice.cost.money > 0 ? "expense" : "income",
                amount: Math.abs(choice.cost.money) || 0,
                category: "FinanceIQ",
                timestamp: Date.now(),
                description: `Finance IQ: ${choice.label}`,
            }),
        });
    } catch (_) { /* backend offline — silently ignore */ }
}

function HealthBar({ score }) {
    const color = score > 66 ? "bg-green-500" : score > 33 ? "bg-yellow-500" : "bg-red-500";
    const label = score > 66 ? "Healthy" : score > 33 ? "At Risk" : "Critical";
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Financial Health</span>
                <span className={score > 66 ? "text-green-400" : score > 33 ? "text-yellow-400" : "text-red-400"}>{label}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}

export default function DreamLifePlanner() {
    const { user, transact, trackDailyAction } = useContext(UserContext);
    const { push } = useContext(ToastContext);

    // --- State ---
    const [sceneIndex, setSceneIndex] = useState(0);
    const [knowledgeScore, setKnowledgeScore] = useState(INITIAL_FK_SCORE);
    const [lastDelta, setLastDelta] = useState(null);
    const [choiceMade, setChoiceMade] = useState(null);
    const [completed, setCompleted] = useState(false);

    // --- Intelligence System State ---
    const [liveMetrics, setLiveMetrics] = useState(null);
    const [liveAlerts, setLiveAlerts] = useState(null);
    const [backendLive, setBackendLive] = useState(false);
    const [postChoiceSnapshot, setPostChoiceSnapshot] = useState(null);

    const fetchIntelligence = async () => {
        try {
            const [mRes, aRes] = await Promise.all([fetch(METRICS_URL), fetch(ALERTS_URL)]);
            const metrics = await mRes.json();
            const alerts = await aRes.json();
            setLiveMetrics(metrics);
            setLiveAlerts(alerts);
            setBackendLive(true);
        } catch (_) {
            setBackendLive(false);
        }
    };

    useEffect(() => {
        fetchIntelligence();
        const interval = setInterval(fetchIntelligence, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentScenario = SCENARIOS[sceneIndex];

    const handleChoiceClick = async (choice) => {
        if (user.balance < choice.cost.money) {
            push("Insufficient funds for this choice!", { style: "danger" });
            return;
        }

        // Deduct money cost
        if (choice.cost.money > 0) {
            transact(-choice.cost.money, { label: choice.label });
            await postToPathway(choice);
            setTimeout(async () => {
                try {
                    const [mRes, aRes] = await Promise.all([fetch(METRICS_URL), fetch(ALERTS_URL)]);
                    setPostChoiceSnapshot({ metrics: await mRes.json(), alerts: await aRes.json() });
                } catch (_) {}
            }, 1200);
        }

        // Update Financial Knowledge score
        const delta = choice.impact.financialKnowledge ?? 0;
        setKnowledgeScore(prev => Math.min(100, Math.max(0, prev + delta)));
        setLastDelta(delta);

        setChoiceMade(choice);
        trackDailyAction('lifeSimulation');
    };

    const handleNext = () => {
        setChoiceMade(null);
        setLastDelta(null);
        setPostChoiceSnapshot(null);
        if (sceneIndex < SCENARIOS.length - 1) {
            setSceneIndex(prev => prev + 1);
        } else {
            setCompleted(true);
            push("Challenge complete! Your Financial IQ has been updated.", { style: "success" });
        }
    };

    const activeAlerts = liveAlerts
        ? [...(liveAlerts.critical || []), ...(liveAlerts.warnings || [])].slice(0, 2)
        : [];

    // Completed state
    if (completed) {
        return (
            <div className="max-w-2xl mx-auto min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-8 text-center">
                <div className="card-glass p-10 w-full">
                    <div className="text-6xl mb-4">🏆</div>
                    <h2 className="text-3xl font-black text-white mb-2">Challenge Complete!</h2>
                    <p className="text-slate-400 mb-8">You navigated all {SCENARIOS.length} financial scenarios.</p>
                    <div className="mb-8">
                        <FinancialKnowledgeMeter score={knowledgeScore} />
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => { setSceneIndex(0); setKnowledgeScore(INITIAL_FK_SCORE); setCompleted(false); }}
                            className="px-6 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/30 transition-all text-sm"
                        >
                            Replay Challenge
                        </button>
                        <Link to="/games" className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-all text-sm">
                            Back to Games
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentScenario) return <div className="p-20 text-center text-slate-400">No scenarios loaded.</div>;

    return (
        <div className="max-w-4xl mx-auto min-h-[calc(100vh-140px)] flex flex-col p-4 md:p-0">

            {/* Header / Nav */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/games" className="text-xs text-slate-500 hover:text-white uppercase tracking-wider block">← Back to Games</Link>
                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold">
                    <Brain size={12} className="text-amber-400" />
                    Finance IQ Challenge
                </div>
                <div className="text-xs text-slate-600">{sceneIndex + 1} / {SCENARIOS.length}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

                {/* LEFT: Knowledge Meter + Financial Reality */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Financial Knowledge Meter */}
                    <div className="card-glass p-6 border border-amber-500/20">
                        <h3 className="text-sm font-bold text-amber-400 uppercase mb-4 tracking-widest border-b border-amber-500/20 pb-2 flex items-center gap-2">
                            <Brain size={13} /> Financial Knowledge
                        </h3>
                        <FinancialKnowledgeMeter score={knowledgeScore} />

                        {/* Delta badge after choice */}
                        <AnimatePresence>
                            {lastDelta !== null && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold ${lastDelta > 0 ? 'bg-green-500/10 border border-green-500/20 text-green-400' : lastDelta < 0 ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-slate-700/30 text-slate-400'}`}
                                >
                                    {lastDelta > 0 ? <TrendingUp size={14} /> : lastDelta < 0 ? <TrendingDown size={14} /> : null}
                                    {lastDelta > 0 ? `+${lastDelta}` : lastDelta} IQ points
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Financial Reality Panel */}
                    <div className={`card-glass p-5 border ${backendLive ? "border-cyan-500/30" : "border-white/5"}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={13} className={backendLive ? "text-cyan-400 animate-pulse" : "text-slate-600"} />
                                Financial Reality
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${backendLive ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-white/5 border-white/5 text-slate-500"}`}>
                                {backendLive ? "LIVE" : "OFFLINE"}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Balance</span>
                                <span className={`font-bold text-sm ${(user?.balance || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                                    ₹{Math.abs(user?.balance || 0).toLocaleString()}
                                </span>
                            </div>

                            <HealthBar score={backendLive && liveMetrics ? (liveMetrics.financial_health_score ?? 100) : 100} />

                            {backendLive && activeAlerts.length > 0 && (
                                <div className="space-y-2 pt-1 border-t border-white/5">
                                    {activeAlerts.map((alert, i) => (
                                        <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-xs ${alert.level === "CRITICAL" ? "bg-red-500/10 border border-red-500/20" : "bg-yellow-500/10 border border-yellow-500/20"}`}>
                                            <AlertTriangle size={11} className={alert.level === "CRITICAL" ? "text-red-400 mt-0.5 shrink-0" : "text-yellow-400 mt-0.5 shrink-0"} />
                                            <span className={alert.level === "CRITICAL" ? "text-red-300" : "text-yellow-300"}>{alert.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {backendLive && activeAlerts.length === 0 && (
                                <div className="flex items-center gap-2 text-xs text-green-400 pt-1 border-t border-white/5">
                                    <Shield size={11} /> No active alerts
                                </div>
                            )}
                            {!backendLive && (
                                <p className="text-xs text-slate-500 text-center border-t border-white/5 pt-3">Start the backend for live health score &amp; alerts.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT: Scenario Engine */}
                <div className="lg:col-span-2 flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScenario.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card-glass p-8 flex-1 flex flex-col relative overflow-hidden"
                        >
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-600/8 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex-1 flex flex-col">
                                <span className="text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <Brain size={11} /> Scenario #{sceneIndex + 1} of {SCENARIOS.length}
                                </span>
                                <h2 className="text-3xl font-heading font-black text-white mb-4">
                                    {currentScenario.title}
                                </h2>
                                <p className="text-lg text-slate-300 leading-relaxed mb-8 border-l-4 border-amber-500/50 pl-4 bg-amber-500/5 py-2 rounded-r-lg">
                                    {currentScenario.description}
                                </p>

                                {/* Choices */}
                                {!choiceMade ? (
                                    <div className="space-y-3 mt-auto">
                                        {currentScenario.choices.map((choice) => {
                                            const fk = choice.impact.financialKnowledge ?? 0;
                                            return (
                                                <button
                                                    key={choice.id}
                                                    onClick={() => handleChoiceClick(choice)}
                                                    className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/40 transition-all group relative overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-center relative z-10">
                                                        <div className="flex-1 mr-4">
                                                            <span className="font-bold text-slate-200 group-hover:text-white block text-base">
                                                                {choice.label}
                                                            </span>
                                                            <span className="text-xs text-slate-500 group-hover:text-amber-300 transition-colors">
                                                                {choice.cost.money > 0 ? `₹${choice.cost.money.toLocaleString()} cost` : 'No cost'}
                                                                {choice.cost.time > 0 ? ` • ${choice.cost.time}h` : ''}
                                                            </span>
                                                        </div>
                                                        <div className={`text-xs font-black font-mono px-2 py-1 rounded-lg border ${fk > 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : fk < 0 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
                                                            {fk > 0 ? '+' : ''}{fk} IQ
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-auto space-y-3"
                                    >
                                        <div className={`p-6 rounded-xl border ${lastDelta > 0 ? 'bg-green-500/10 border-green-500/30' : lastDelta < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/30 border-slate-600/30'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className={`text-xl font-bold ${lastDelta > 0 ? 'text-green-400' : lastDelta < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                                                    Decision Locked {lastDelta > 0 ? '✅' : lastDelta < 0 ? '⚠️' : '🔒'}
                                                </h3>
                                                <span className={`text-lg font-black font-mono ${lastDelta > 0 ? 'text-green-400' : lastDelta < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                                    {lastDelta > 0 ? '+' : ''}{lastDelta} IQ
                                                </span>
                                            </div>
                                            <p className="text-white text-base mb-1">{choiceMade.consequence}</p>
                                            <p className="text-sm text-slate-400 mb-4">Your financial knowledge score has been updated.</p>

                                            <AlternatePath
                                                alternateText={choiceMade.alternate}
                                                onDismiss={handleNext}
                                            />

                                            <div className="mt-4 flex justify-end">
                                                <button onClick={handleNext} className="text-sm text-slate-500 hover:text-white underline">
                                                    Next Scenario →
                                                </button>
                                            </div>
                                        </div>

                                        {/* Intelligence Engine Reaction */}
                                        {backendLive && choiceMade.cost.money > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Zap size={14} className="text-cyan-400" />
                                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Intelligence Engine Reaction</span>
                                                </div>
                                                {postChoiceSnapshot ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-400">Health Score</span>
                                                            <span className={`font-bold ${(postChoiceSnapshot.metrics.financial_health_score ?? 100) > 66 ? "text-green-400" : (postChoiceSnapshot.metrics.financial_health_score ?? 100) > 33 ? "text-yellow-400" : "text-red-400"}`}>
                                                                {Math.round(postChoiceSnapshot.metrics.financial_health_score ?? 100)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-400">Balance</span>
                                                            <span className="font-bold text-white">₹{Math.abs(user?.balance || 0).toLocaleString()}</span>
                                                        </div>
                                                        {postChoiceSnapshot.alerts.critical?.length > 0 && (
                                                            <div className="flex items-start gap-2 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                                <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
                                                                <span className="text-xs text-red-300">{postChoiceSnapshot.alerts.critical[0].title}</span>
                                                            </div>
                                                        )}
                                                        {postChoiceSnapshot.alerts.warnings?.length > 0 && !postChoiceSnapshot.alerts.critical?.length && (
                                                            <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                                <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                                                                <span className="text-xs text-yellow-300">{postChoiceSnapshot.alerts.warnings[0].title}</span>
                                                            </div>
                                                        )}
                                                        {!postChoiceSnapshot.alerts.critical?.length && !postChoiceSnapshot.alerts.warnings?.length && (
                                                            <div className="flex items-center gap-2 text-xs text-green-400 mt-1">
                                                                <Shield size={11} /> Financial position still stable after this choice.
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-500 animate-pulse">Analysing impact on your financial stream…</p>
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
