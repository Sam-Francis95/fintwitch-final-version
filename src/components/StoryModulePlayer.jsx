import React, { useState } from 'react';
import { ChevronRight, CheckCircle, AlertTriangle, Award, BarChart2, Star, Activity, BookOpen, RefreshCw, Lock, Unlock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ModuleActivity from './ModuleActivities';

// Simple Markdown Replacer 
const MD = ({ content }) => {
    const lines = content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-brand-primary mb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('*   ')) return <li key={i} className="ml-5 list-disc text-slate-300 mb-2">{line.replace('*   ', '')}</li>;
        return <p key={i} className="mb-2 text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>') }}></p>;
    });
    return <div className="space-y-4">{lines}</div>;
};

export default function StoryModulePlayer({ module, onComplete }) {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [finished, setFinished] = useState(false);
    const [failed, setFailed] = useState(false);

    // Analytics State
    const [skillScores, setSkillScores] = useState({});

    // User Feedback State
    const [userReflection, setUserReflection] = useState("");
    const [submittedReflection, setSubmittedReflection] = useState(false);

    // Stage State
    const [feedback, setFeedback] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [activityCompleted, setActivityCompleted] = useState(false);

    if (!module || !module.stages) return <div className="text-white">Loading Module...</div>;

    const currentStage = module.stages[currentStageIndex];
    const totalQuestions = module.stages.filter(s => s.type === 'quiz').length;
    const maxScore = totalQuestions * 10 + 15; // 10 per quiz + 15 for activity
    const currentScorePercentage = questionsAnswered > 0 ? (score / (questionsAnswered * 10)) * 100 : 0;

    const updateSkills = (impact) => {
        if (!impact) return;
        setSkillScores(prev => {
            const newScores = { ...prev };
            Object.entries(impact).forEach(([skill, value]) => {
                newScores[skill] = (newScores[skill] || 0) + value; // Accumulate points
            });
            return newScores;
        });
    };

    const handleNext = () => {
        setFeedback(null);
        setSelectedOption(null);
        setActivityCompleted(false);

        // CHECK PROGRESSION RULE (Before Activity)
        // Assuming Activity is always the last stage or near end.
        // If next stage is activity, check score.
        const nextIndex = currentStageIndex + 1;

        if (nextIndex < module.stages.length) {
            const nextStage = module.stages[nextIndex];

            // If entering activity zone, check pass criteria
            if (nextStage.type === 'activity') {
                const passPercent = module.passingScore || 70;
                // Calculate logic considering only quizzes done so far
                const quizScorePercent = (score / (totalQuestions * 10)) * 100;

                if (quizScorePercent < passPercent) {
                    setFailed(true);
                    return;
                }
            }
            setCurrentStageIndex(nextIndex);
        } else {
            setFinished(true);
        }
    };

    const handleRetry = () => {
        setCurrentStageIndex(0);
        setScore(0);
        setQuestionsAnswered(0);
        setSkillScores({});
        setFailed(false);
        setFinished(false);
        setFeedback(null);
        setSelectedOption(null);
    };

    // --- SUB-VIEWS ---

    const SlideView = ({ data }) => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <BookOpen size={24} className="text-brand-primary" />
                    <h2 className="text-xl font-bold text-white">{data.title}</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                    <MD content={data.content} />
                </div>
                <button onClick={handleNext} className="mt-8 btn-primary flex items-center gap-2 px-8 py-3">
                    Continue <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );

    const QuizView = ({ data }) => {
        const handleAnswer = (idx) => {
            setSelectedOption(idx);
            const isCorrect = idx === data.answer;
            setQuestionsAnswered(q => q + 1);

            if (isCorrect) {
                setScore(s => s + 10);
                updateSkills(data.skillImpact);
            }
            // Logic for showing detailed feedback
            setFeedback({
                isCorrect,
                explanation: data.explanation || { correct: data.feedback, wrong: "", source: "" } // Fallback for old data
            });
        };

        return (
            <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">❓ Question</h2>
                    <span className="text-xs font-mono text-slate-500">Progress: {currentStageIndex + 1}/{module.stages.length}</span>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <p className="text-lg text-white mb-6 font-medium">{data.question}</p>

                    <div className="space-y-3 mb-6">
                        {data.options.map((opt, idx) => (
                            <button
                                key={idx}
                                disabled={selectedOption !== null}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full p-4 rounded-xl text-left border transition-all ${selectedOption === idx
                                    ? idx === data.answer ? "bg-emerald-500/20 border-emerald-500 text-emerald-100" : "bg-red-500/20 border-red-500 text-red-100"
                                    : "bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-200"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    {opt}
                                    {selectedOption === idx && (
                                        idx === data.answer ? <CheckCircle size={18} /> : <AlertTriangle size={18} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            {/* Correct Reason (Green) */}
                            {feedback.isCorrect ? (
                                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                                    <h4 className="font-bold flex items-center gap-2 mb-1"><CheckCircle size={16} /> Correct Answer</h4>
                                    <p className="text-sm">{feedback.explanation.correct}</p>
                                </div>
                            ) : (
                                /* Wrong Reason (Red) */
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200">
                                    <h4 className="font-bold flex items-center gap-2 mb-1"><AlertTriangle size={16} /> Why This Is Correct</h4>
                                    <p className="text-sm">{feedback.explanation.correct}</p>
                                    <div className="mt-2 pt-2 border-t border-red-500/20">
                                        <h5 className="font-bold text-xs uppercase opacity-70 mb-1">Why Others Are Wrong</h5>
                                        <p className="text-sm opacity-90">{feedback.explanation.wrong}</p>
                                    </div>
                                </div>
                            )}

                            {feedback.explanation.source && (
                                <div className="text-xs text-slate-500 italic text-right">
                                    Source: <a href={feedback.explanation.source} target="_blank" rel="noreferrer" className="underline hover:text-blue-400">Reference Link</a>
                                </div>
                            )}

                            <button onClick={handleNext} className="mt-4 w-full btn-primary py-3">Next Question</button>
                        </div>
                    )}
                </div>
            </div>
        )
    };

    const ActivityView = ({ data }) => (
        <div className="animate-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-bold mb-2">
                    <Unlock size={14} /> Activity Zone Unlocked
                </div>
                <h1 className="text-3xl font-bold text-white">{data.title}</h1>
                <p className="text-slate-400">{data.description}</p>
            </div>

            <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-2xl">
                <ModuleActivity
                    type={data.activityType}
                    items={data.items}
                    correctItem={data.correctItem}
                    onComplete={(success) => {
                        setActivityCompleted(true);
                        setScore(s => s + 15);
                    }}
                />
            </div>
            {activityCompleted && (
                <button onClick={handleNext} className="mt-8 w-full btn-primary py-3 flex justify-center items-center gap-2">
                    Finish Level <ChevronRight size={18} />
                </button>
            )}
        </div>
    );

    // --- FAILED VIEW ---
    if (failed) {
        return (
            <div className="max-w-md mx-auto text-center py-12 animate-in zoom-in-50">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Level Failed</h2>
                <p className="text-slate-400 mb-6">You need <strong>{module.passingScore}%</strong> to unlock the Activity Zone.</p>

                <div className="bg-slate-800 p-4 rounded-xl mb-8">
                    <p className="text-slate-500 text-sm mb-1">Your Score</p>
                    <p className="text-3xl font-bold text-red-400">
                        {Math.round((score / (totalQuestions * 10)) * 100)}%
                    </p>
                </div>

                <button onClick={handleRetry} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    <RefreshCw size={18} /> Reset Level {module.id}
                </button>
            </div>
        );
    }

    // --- RESULTS VIEW ---
    if (finished) {
        const finalPercentage = Math.round((score / maxScore) * 100);

        return (
            <div className="max-w-4xl mx-auto py-8 animate-in fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <Award size={64} className="text-brand-primary mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white">Level {module.id} Completed!</h1>
                    <p className="text-slate-400">Overall Score: <strong className="text-white">{finalPercentage}%</strong></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Performance Analysis */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <BarChart2 size={20} className="text-blue-400" /> Performance Analysis
                        </h3>

                        <div className="space-y-4">
                            {Object.entries(skillScores).map(([skill, val]) => (
                                <div key={skill}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">{skill}</span>
                                        <span className="text-emerald-400 font-bold">{val} pts</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500"
                                            style={{ width: `${Math.min(val * 4, 100)}%` }} // Rough scaling
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rewards */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-6 rounded-2xl border border-yellow-500/30">
                            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                                <Award size={20} /> Level Rewards
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase">Cash Earned</p>
                                    <p className="text-2xl font-bold text-white">₹{module.rewards?.cash || 0}</p>
                                </div>
                                <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase">XP Gained</p>
                                    <p className="text-2xl font-bold text-brand-primary">+{module.rewards?.xp || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progression Rule Status */}
                        <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                            <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">🚦 Progression Rule</h4>
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle size={16} />
                                <span>Passed ({finalPercentage}% {">"} 70%)</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{module.progression?.success}</p>
                        </div>
                    </div>
                </div>

                {/* User Reflection Feedback System */}
                <div className="mt-8 bg-slate-800 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">📝 Feedback System</h3>
                    <p className="text-slate-400 text-sm mb-4">User Reflection: "What did you learn about money from this level?"</p>

                    {!submittedReflection ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userReflection}
                                onChange={(e) => setUserReflection(e.target.value)}
                                placeholder="Type your learning here..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                            />
                            <button
                                onClick={() => setSubmittedReflection(true)}
                                className="btn-primary px-6"
                            >
                                Submit
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                            <strong className="block mb-1">System Feedback:</strong>
                            Money Basics: 80% clarity achieved. Great job reflecting on your learning!
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-8">
                    <button onClick={() => onComplete(true, score)} className="btn-primary py-3 px-12 text-lg font-bold shadow-lg shadow-brand-primary/20">
                        Complete Level
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header / Meta */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-1">Module {module.id}</h2>
                    <h1 className="text-2xl font-bold text-white">{module.title}</h1>
                </div>
                <div className="text-right">
                    <div className="text-emerald-400 font-mono font-bold text-xl">{score} XP</div>
                </div>
            </div>

            {/* Stage Container */}
            <div className="min-h-[400px]">
                {currentStage.type === 'slide' && <SlideView data={currentStage} />}
                {currentStage.type === 'quiz' && <QuizView data={currentStage} />}
                {currentStage.type === 'activity' && <ActivityView data={currentStage} />}
            </div>
        </div>
    );
}
