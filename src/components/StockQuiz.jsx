import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, Play, Award, DollarSign } from 'lucide-react';

export default function StockQuiz({ onComplete }) {
    const [phase, setPhase] = useState('intro'); // intro, terms, scenario, complete
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);

    // Phase 1: Terminology
    const TERMS_QUESTIONS = [
        {
            q: "What is a 'Ticker Symbol'?",
            options: [
                "A machine that prints stock prices",
                "A unique series of letters representing a stock",
                "The CEO's nickname"
            ],
            a: 1,
            info: "Correct! Every listed company has a unique ticker (e.g., AAPL for Apple, TSLA for Tesla)."
        },
        {
            q: "What is a 'Share'?",
            options: [
                "A loan given to a company",
                "A unit of ownership in a company",
                "A government bond"
            ],
            a: 1,
            info: "Correct! Buying a share means you own a small piece (equity) of that company."
        },
        {
            q: "What is 'Equity'?",
            options: [
                "The amount of debt a company has",
                "The value of ownership in an asset or company",
                "A type of bank account"
            ],
            a: 1,
            info: "Spot on! Equity represents the value that would be returned to shareholders if all assets were liquidated."
        },
        {
            q: "What is a 'Portfolio'?",
            options: [
                "A collection of financial investments like stocks and bonds",
                "A briefcase for carrying documents",
                "A list of companies you want to work for"
            ],
            a: 0,
            info: "Exactly! Your portfolio is the total collection of all your investments."
        },
        {
            q: "What is a 'Bid-Ask Spread'?",
            options: [
                "The difference between the highest price a buyer is willing to pay and the lowest price a seller is willing to accept",
                "The profit a broker makes on every trade",
                "The range of prices a stock trades at during the day"
            ],
            a: 0,
            info: "Correct! The 'Bid' is what buyers want to pay, and the 'Ask' is what sellers want. The gap is the spread."
        },
        {
            q: "What is a 'Dividend'?",
            options: [
                "A fee you pay to the broker",
                "A regular payment of profit shared with shareholders",
                "The price of a stock at closing"
            ],
            a: 1,
            info: "Spot on! Some companies share their profits with investors as dividends."
        },
        {
            q: "What is a 'Bull Market'?",
            options: [
                "When prices are rising and optimism is high",
                "When prices are falling and fear is high",
                "A market where only animals are traded"
            ],
            a: 0,
            info: "Exactly! Bull = Up/Optimistic. Bear = Down/Pessimistic."
        },
        {
            q: "What is 'Diversification'?",
            options: [
                "Putting all your money in one stock",
                "Spreading investments to reduce risk",
                "Buying only tech stocks"
            ],
            a: 1,
            info: "Smart! Don't put all your eggs in one basket. It protects you if one stock fails."
        }
    ];

    // Phase 2: Workflow Scenario
    const SCENARIO_STEPS = [
        {
            title: "Step 1: The Setup",
            scenario: "You have ₹5,000 to invest. You've found a tech company, 'Cyberdyne', that you believe will grow. What is your very first logical step?",
            options: [
                "Call the company CEO to buy shares personally",
                "Open a Brokerage Account (Demat Account)",
                "Go to the bank and ask for shares"
            ],
            a: 1,
            info: "Correct! You need a gateway to the stock market, which is a Brokerage Account."
        },
        {
            title: "Step 2: Funding",
            scenario: "Your account is open. Now, how do you get your ₹5,000 ready to use?",
            options: [
                "Mail a check to the stock exchange",
                "Transfer funds from your Bank to your Brokerage Wallet",
                "Buy stocks on credit without funds"
            ],
            a: 1,
            info: "Right! You must fund your wallet before you can execute trades."
        },
        {
            title: "Step 3: Execution",
            scenario: "You have funds. You search for 'Cyberdyne' (Ticker: CYBR). You want to buy it NOW at the current price (₹150). What order type do you use?",
            options: [
                "Market Order (Buy immediately at best available price)",
                "Limit Order (Buy only if price drops to ₹140)",
                "Stop Loss Order"
            ],
            a: 0,
            info: "Yes! A Market Order guarantees immediate execution, though price may fluctuate slightly."
        },
        {
            title: "Step 4: Monitoring",
            scenario: "You own 30 shares! Two days later, the price drops to ₹145. What is the best long-term reaction?",
            options: [
                "Panic and sell everything immediately",
                "Check the company news/fundamentals, and hold if the thesis is still valid",
                "Sue the company"
            ],
            a: 1,
            info: "Wisdom! Volatility is normal. React to fundamental changes, not just daily price noise."
        }
    ];

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        const currentQ = phase === 'terms' ? TERMS_QUESTIONS[currentStep] : SCENARIO_STEPS[currentStep];
        const isCorrect = index === currentQ.a;

        if (isCorrect) {
            setScore(s => s + 10);
            setFeedback({ type: 'success', text: currentQ.info });
        } else {
            setFeedback({ type: 'error', text: "Not quite. Try learning from this: " + currentQ.info });
        }

        setTimeout(() => {
            handleNext();
        }, 3000);
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setFeedback(null);

        if (phase === 'terms') {
            if (currentStep + 1 < TERMS_QUESTIONS.length) {
                setCurrentStep(s => s + 1);
            } else {
                setPhase('scenario');
                setCurrentStep(0);
            }
        } else if (phase === 'scenario') {
            if (currentStep + 1 < SCENARIO_STEPS.length) {
                setCurrentStep(s => s + 1);
            } else {
                setPhase('complete');
            }
        }
    };

    // Rendering Logic
    if (phase === 'intro') {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#0f1219] border border-blue-500/30 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <BookOpen size={32} className="text-blue-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Trading License Required</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        To access the FinTwitch Terminal, you must verify your knowledge.
                        Complete the training module to earn your license and a <span className="text-emerald-400 font-bold">₹500 Funding Bonus</span>.
                    </p>

                    <button
                        onClick={() => setPhase('terms')}
                        className="w-full btn-primary py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        START TRAINING <Play size={16} />
                    </button>
                    <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">Est. Time: 2 Mins</p>
                </div>
            </div>
        );
    }

    if (phase === 'complete') {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
                <div className="bg-[#0f1219] border border-emerald-500/30 rounded-2xl p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500 animate-bounce">
                        <Award size={40} className="text-emerald-400" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">License Granted!</h2>
                    <div className="flex items-center justify-center gap-2 text-emerald-400 mb-6 bg-emerald-500/5 py-2 px-4 rounded-full w-fit mx-auto border border-emerald-500/20">
                        <CheckCircle size={16} />
                        <span className="font-mono font-bold text-sm">AUTHORIZED TRADER</span>
                    </div>

                    <p className="text-slate-300 mb-8">
                        You have demonstrated the necessary knowledge to trade safely.
                        <br />
                        <span className="text-emerald-400 font-bold">+₹500 Bonus Funds Added</span>
                    </p>

                    <button
                        onClick={onComplete}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                        ENTER MARKET <Play size={16} />
                    </button>
                </div>
            </div>
        )
    }

    const question = phase === 'terms' ? TERMS_QUESTIONS[currentStep] : SCENARIO_STEPS[currentStep];
    const progress = phase === 'terms'
        ? ((currentStep) / TERMS_QUESTIONS.length) * 50
        : 50 + ((currentStep) / SCENARIO_STEPS.length) * 50;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="bg-[#0f1219] border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden h-[600px]">

                {/* Header */}
                <div className="bg-black/40 p-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {phase === 'terms' ? "Phase 1: Terminology" : "Phase 2: Simulation"}
                            {phase === 'scenario' && <span className="bg-blue-500 text-[10px] px-2 py-0.5 rounded text-white">SCENARIO</span>}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Question {currentStep + 1} of {phase === 'terms' ? TERMS_QUESTIONS.length : SCENARIO_STEPS.length}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-emerald-400 font-mono font-bold">{score} XP</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {question.title && <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">{question.title}</h4>}
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-6 leading-snug">{question.scenario || question.q}</h2>

                    <div className="space-y-3">
                        {question.options.map((opt, idx) => (
                            <button
                                key={idx}
                                disabled={selectedAnswer !== null}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${selectedAnswer === idx
                                    ? idx === question.a
                                        ? "bg-emerald-500/20 border-emerald-500 text-white"
                                        : "bg-red-500/20 border-red-500 text-white"
                                    : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-between">
                                    {opt}
                                    {selectedAnswer === idx && (
                                        idx === question.a ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-red-400" />
                                    )}
                                </span>
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className={`mt-6 p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 ${feedback.type === 'success'
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                            : "bg-red-500/10 border-red-500/30 text-red-200"
                            }`}>
                            <p className="text-sm font-medium">{feedback.text}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                        FinTwitch Academy • License Examination
                    </p>
                </div>

            </div>
        </div>
    );
}
