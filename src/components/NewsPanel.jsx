import React from "react";
import { ExternalLink, TrendingUp, Radio, AlertCircle } from "lucide-react";

// Dummy data with more "feed-like" structure
const NEWS_DATA = [
    {
        id: 1,
        source: "MKW",
        timestamp: "10:42 AM",
        headline: "Credit Score Strategy",
        snippet: "5 moves to boost score for better loan rates.",
        tag: "CREDIT",
        sentiment: "neutral",
    },
    {
        id: 2,
        source: "CNBC",
        timestamp: "10:15 AM",
        headline: "Portfolio Adjustment",
        snippet: "Trimming position in high-growth tech stock.",
        tag: "EQUITIES",
        sentiment: "bearish",
    },
    {
        id: 3,
        source: "BBG",
        timestamp: "09:58 AM",
        headline: "Inflation Data",
        snippet: "Global rally as inflation prints lower than exp.",
        tag: "MACRO",
        sentiment: "bullish",
    },
    {
        id: 4,
        source: "RTRS",
        timestamp: "09:30 AM",
        headline: "Oil Prices Surge",
        snippet: "OPEC+ signals potential supply cut extension.",
        tag: "COMMODITIES",
        sentiment: "bullish",
    },
    {
        id: 5,
        source: "WSJ",
        timestamp: "08:45 AM",
        headline: "Fed Minutes",
        snippet: "Officials divided on rate path for Q2.",
        tag: "FED",
        sentiment: "neutral",
    },
];

const TerminalRow = ({ item }) => {
    const getSentimentColor = (s) => {
        if (s === "bullish") return "text-emerald-400";
        if (s === "bearish") return "text-red-400";
        return "text-brand-muted";
    };

    return (
        <div className="group flex flex-col p-2 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-brand-muted">{item.timestamp}</span>
                    <span className="text-[10px] font-bold text-brand-primary">{item.source}</span>
                </div>
                <span className={`text-[9px] font-mono px-1 py-0.5 rounded border border-white/5 bg-white/5 ${getSentimentColor(item.sentiment)}`}>
                    {item.tag}
                </span>
            </div>

            <div className="flex items-start gap-2">
                <div className={`w-0.5 h-full self-stretch ${getSentimentColor(item.sentiment)} bg-current opacity-50`}></div>
                <div>
                    <h3 className="text-xs font-bold text-gray-200 mb-0.5 leading-snug group-hover:text-white">
                        {item.headline}
                    </h3>
                    <p className="text-[10px] text-gray-500 leading-tight line-clamp-1 group-hover:text-gray-400">
                        {item.snippet}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function NewsPanel() {
    return (
        <div className="h-full flex flex-col bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-[#0A0A0A] p-3 border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <h2 className="text-xs font-mono font-bold text-gray-200 tracking-widest uppercase">MARKET WIRE</h2>
                </div>
                <div className="flex gap-2">
                    <Radio size={12} className="text-brand-muted" />
                </div>
            </div>

            {/* Scrolling Feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/50">
                {NEWS_DATA.map((item) => (
                    <TerminalRow key={item.id} item={item} />
                ))}
            </div>

            {/* Footer */}
            <div className="bg-[#0A0A0A] p-2 border-t border-white/10 text-center">
                <button className="text-[10px] font-mono text-brand-primary hover:text-white transition-colors uppercase flex items-center justify-center gap-2 w-full">
                    <span>CONNECTING...</span>
                    <span className="inline-block w-1.5 h-3 bg-brand-primary animate-pulse" />
                </button>
            </div>
        </div>
    );
}
