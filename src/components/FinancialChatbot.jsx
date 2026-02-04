import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, User, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { CHATBOT_DATA } from '../data/chatbotData';

export default function FinancialChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Initialize messages from LocalStorage or Default
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('fintwitch_chat_history');
        return saved ? JSON.parse(saved) : [{ type: 'bot', text: CHATBOT_DATA.greeting }];
    });

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Save to LocalStorage whenever messages change
    useEffect(() => {
        localStorage.setItem('fintwitch_chat_history', JSON.stringify(messages));
        scrollToBottom();
    }, [messages, isOpen, isMinimized]);

    const clearHistory = () => {
        const resetState = [{ type: 'bot', text: CHATBOT_DATA.greeting }];
        setMessages(resetState);
        localStorage.setItem('fintwitch_chat_history', JSON.stringify(resetState));
    };

    const handleSendMessage = (textOverride = null) => {
        const textToProcess = textOverride || inputValue;
        if (!textToProcess.trim()) return;

        // User Message
        const newMessages = [...messages, { type: 'user', text: textToProcess }];

        // --- IMPROVED MATCHING LOGIC ---
        const lowerInput = textToProcess.toLowerCase();
        const inputWords = lowerInput.split(/\s+/).filter(w => w.length > 2); // Split and ignore small words

        let bestMatch = { key: null, score: 0, content: null };

        // 1. Topic Scoring
        for (const [key, value] of Object.entries(CHATBOT_DATA.topics)) {
            let score = 0;
            const keywords = value.keywords || [key]; // Fallback if no keywords array

            // Check exact string match (High priority)
            if (lowerInput.includes(key)) score += 10;

            // Check keyword matches
            keywords.forEach(k => {
                if (lowerInput.includes(k)) score += 5;

                // Word-by-word overlap (Fuzzy-ish)
                const kWords = k.split(' ');
                kWords.forEach(kw => {
                    if (inputWords.includes(kw)) score += 1;
                });
            });

            if (score > bestMatch.score) {
                bestMatch = { key, score, content: value };
            }
        }

        // 2. Scenario Scoring (if topic match isn't overwhelming)
        if (bestMatch.score < 15) { // Only check scenarios if no strong topic match
            for (const scenario of CHATBOT_DATA.scenarios) {
                let sScore = 0;
                scenario.keywords.forEach(k => {
                    if (lowerInput.includes(k)) sScore += 4;
                });

                if (sScore > bestMatch.score) {
                    bestMatch = { key: 'scenario', score: sScore, content: { title: 'Scenario', content: scenario.answer } };
                }
            }
        }

        let botResponse = CHATBOT_DATA.unknown;

        // 3. Determine Response based on Score Threshold
        if (bestMatch.score >= 3) {
            // If it's a topic
            if (bestMatch.key !== 'scenario') {
                botResponse = `**${bestMatch.content.title}**\n\n${bestMatch.content.content}`;
                if (bestMatch.content.resource) {
                    botResponse += `\n\n_${bestMatch.content.resource}_`;
                }
            } else {
                // If it's a scenario
                botResponse = bestMatch.content.content;
            }
        }

        // 4. Motivation check (Override)
        if (lowerInput.includes('motivat') || lowerInput.includes('inspire') || lowerInput.includes('sad') || lowerInput.includes('give up')) {
            const randomQuote = CHATBOT_DATA.motivation[Math.floor(Math.random() * CHATBOT_DATA.motivation.length)];
            botResponse = `Here is something to keep you going:\n\n"${randomQuote}"`;
        }

        // 5. Greetings (Override)
        if (lowerInput === 'hi' || lowerInput === 'hello' || lowerInput === 'hey') {
            botResponse = "Hello there! I'm ready to answer your finance questions. Try asking about 'Stocks', 'Budgeting', or 'Level 1'.";
        }

        // Add Bot Response with Delay
        setMessages([...newMessages, { type: 'loading' }]);

        setTimeout(() => {
            setMessages(prev => {
                const filtered = prev.filter(m => m.type !== 'loading');
                return [...filtered, { type: 'bot', text: botResponse }];
            });
        }, 600);

        setInputValue('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-[#0f0f11] border border-white/10 w-[350px] md:w-[400px] h-[600px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 glass-panel"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-white/10 flex justify-between items-center relative overflow-hidden">
                            {/* Gloss effect */}
                            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-50"></div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/20">
                                    <Bot size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm tracking-wide">FinMentor AI</h3>
                                    <p className="text-[10px] text-blue-300 flex items-center gap-1 uppercase tracking-wider font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1 relative z-10">
                                <button
                                    onClick={clearHistory}
                                    title="Clear History"
                                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <ChevronDown size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/40 backdrop-blur-sm">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.type === 'bot' && (
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 mr-2 mt-1 flex-shrink-0">
                                            <Bot size={12} className="text-blue-400" />
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm bg-gradient-to-br from-blue-600 to-blue-700'
                                        : 'bg-[#1a1a1c] text-slate-200 rounded-tl-sm border border-white/5'
                                        }`}>
                                        {msg.type === 'loading' ? (
                                            <div className="flex gap-1.5 items-center h-5 px-1">
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        ) : (
                                            <div className="markdown-content" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/_(.*?)_/g, '<em class="text-blue-300">$1</em>') }} />
                                        )}
                                    </div>

                                    {msg.type === 'user' && (
                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 ml-2 mt-1 flex-shrink-0">
                                            <User size={12} className="text-purple-400" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestion Chips */}
                        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade border-t border-white/5 bg-[#0f0f11]">
                            {['Invest in Stocks', 'Save Taxes', 'Retirement Plan', 'Crypto?'].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-200 transition-all active:scale-95"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-[#0f0f11] border-t border-white/10 flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about stocks, bonds, tax..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim()}
                                className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setIsOpen(true); setIsMinimized(false); }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white relative group border border-white/10"
                >
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 group-hover:opacity-40 duration-1000"></div>
                    <Bot size={32} strokeWidth={1.5} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#050505]"></span>
                </motion.button>
            )}

            {/* Minimized State Bubble */}
            {isOpen && isMinimized && (
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setIsMinimized(false)}
                    className="w-14 h-14 rounded-full bg-[#0F0F11] border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
                    <ChevronUp size={24} />
                </motion.button>
            )}
        </div>
    );
}
