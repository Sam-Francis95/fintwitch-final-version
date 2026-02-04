import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";

// Data
import { LIFE_DREAMS, SCENARIOS } from "../data/lifeScenarios";

// New Components
import DreamMeter from "../components/DreamMeter";
import TradeOffTable from "../components/TradeOffTable";
import AlternatePath from "../components/AlternatePath";

export default function DreamLifePlanner() {
    const { user, transact, trackDailyAction } = useContext(UserContext);
    const { push } = useContext(ToastContext);

    // --- State ---
    const [sceneIndex, setSceneIndex] = useState(0);
    const [dreamScores, setDreamScores] = useState({ swe: 10, startup: 10, fire: 10 });
    const [hoveredChoice, setHoveredChoice] = useState(null);
    const [choiceMade, setChoiceMade] = useState(null); // The choice object selected
    const [showAlternate, setShowAlternate] = useState(false);

    // Initial Resume logic could go here (localStorage)

    // --- Auto-select Dreams (Prototype: All Selected) ---
    // In full version, user would pick 2-3 at start.
    const activeDreams = LIFE_DREAMS;

    const currentScenario = SCENARIOS[sceneIndex];

    const handleChoiceClick = (choice) => {
        if (user.balance < choice.cost.money) {
            push("Insufficient funds!", { style: "danger" });
            return;
        }

        // Apply Costs
        if (choice.cost.money > 0) transact(-choice.cost.money, { label: choice.label });

        // Update Dream Scores
        setDreamScores(prev => {
            const next = { ...prev };
            Object.keys(choice.impact.alignment).forEach(key => {
                next[key] = Math.max(0, Math.min(100, (next[key] || 0) + choice.impact.alignment[key]));
            });
            return next;
        });

        // Set state to "Result Mode"
        setChoiceMade(choice);
        trackDailyAction('lifeSimulation'); // Custom daily action
    };

    const handleNext = () => {
        setChoiceMade(null);
        setHoveredChoice(null);
        setShowAlternate(false);
        if (sceneIndex < SCENARIOS.length - 1) {
            setSceneIndex(prev => prev + 1);
        } else {
            push("Demo complete! More scenarios coming soon.", { style: "success" });
            // Should probably reset or show summary screen
        }
    };

    if (!currentScenario) return <div className="p-20 text-center">Journey Complete.</div>;

    return (
        <div className="max-w-4xl mx-auto min-h-[calc(100vh-140px)] flex flex-col p-4 md:p-0">

            {/* Header / Nav */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/games" className="text-xs text-slate-500 hover:text-white uppercase tracking-wider block">← Back to Games</Link>
                <div className="text-xs text-slate-600 uppercase font-bold">Life Simulator v2.0</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

                {/* LEFT: Dream Alignment Dashboard */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-glass p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest border-b border-white/10 pb-2">
                            Life Vision Board
                        </h3>
                        <div className="space-y-6">
                            {activeDreams.map(dream => (
                                <DreamMeter
                                    key={dream.id}
                                    dream={dream}
                                    score={dreamScores[dream.id]}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Trade-off Visualizer (Shows on Hover or Selection) */}
                    <div className="relative">
                        <TradeOffTable choice={hoveredChoice || choiceMade} />
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
                            {/* Ambient BG */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex-1 flex flex-col">
                                <span className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
                                    Scenario #{sceneIndex + 1}
                                </span>
                                <h2 className="text-3xl font-heading font-black text-white mb-4">
                                    {currentScenario.title}
                                </h2>
                                <p className="text-lg text-slate-300 leading-relaxed mb-8 border-l-4 border-blue-500/50 pl-4 bg-blue-500/5 py-2 rounded-r-lg">
                                    {currentScenario.description}
                                </p>

                                {/* Choices Area */}
                                {!choiceMade ? (
                                    <div className="space-y-3 mt-auto">
                                        {currentScenario.choices.map((choice) => (
                                            <button
                                                key={choice.id}
                                                onMouseEnter={() => setHoveredChoice(choice)}
                                                onMouseLeave={() => setHoveredChoice(null)}
                                                onClick={() => handleChoiceClick(choice)}
                                                className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-center relative z-10">
                                                    <div>
                                                        <span className="font-bold text-slate-200 group-hover:text-white block text-lg">
                                                            {choice.label}
                                                        </span>
                                                        <span className="text-xs text-slate-500 group-hover:text-blue-300 transition-colors">
                                                            Cost: {choice.cost.money > 0 ? `₹${choice.cost.money}` : 'Free'} • {choice.cost.time}h Time
                                                        </span>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                        →
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-auto bg-green-500/10 border border-green-500/30 p-6 rounded-xl"
                                    >
                                        <h3 className="text-xl font-bold text-green-400 mb-2">Decision Locked 🔒</h3>
                                        <p className="text-white text-lg mb-1">{choiceMade.consequence}</p>
                                        <p className="text-sm text-slate-400 mb-4">Your alignment scores have been updated.</p>

                                        <AlternatePath
                                            alternateText={choiceMade.alternate}
                                            onDismiss={handleNext}
                                        />

                                        {/* If alternate is NOT clicked/shown, we still need a way to go next. 
                                            Actually AlternatePath handles "See" -> "Continue". 
                                            But if user doesn't want to see? We need a main Continue button too?
                                            The requirement said "After a choice... show CTA... On click display alternate".
                                            My AlternatePath component toggles. 
                                            Let's add a "Next" button here just in case they don't care about alternate.
                                        */}
                                        <div className="mt-4 flex justify-end">
                                            <button onClick={handleNext} className="text-sm text-slate-500 hover:text-white underline">
                                                Skip Reflection →
                                            </button>
                                        </div>
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
