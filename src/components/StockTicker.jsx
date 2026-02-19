import React, { useState, useEffect } from "react";
import { fetchInitialPrices } from "../utils/StockDataService";

export default function StockTicker() {
    const [prices, setPrices] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await fetchInitialPrices();
            // Calculate random daily change for display
            const formatted = Object.entries(data).map(([symbol, price]) => {
                const change = (Math.random() * 4) - 2; // +/- 2%
                return { symbol, price, change };
            });
            // Duplicate list 4 times for seamless infinite scroll on wide screens
            setPrices([...formatted, ...formatted, ...formatted, ...formatted]);
        }
        load();
    }, []);

    if (prices.length === 0) return null;

    return (
        <div className="w-full bg-black border-b border-white/10 overflow-hidden h-10 flex items-center relative z-40 shadow-xl">
            {/* Fade Gradients matching pure black */}
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-10"></div>

            <div
                className="flex whitespace-nowrap gap-12 pl-4 animate-marquee hover:pause-animation"
                style={{ animationDuration: '60s' }} // Slowed down from default (usually 20-30s)
            >
                {prices.map((item, i) => (
                    <div key={`${item.symbol}-${i}`} className="flex items-center gap-3 text-sm font-mono min-w-max">
                        <span className="font-bold text-white tracking-wider">{item.symbol}</span>
                        <span className="text-slate-200">₹{item.price.toFixed(1)}</span>
                        <span className={`font-bold text-xs ${item.change >= 0 ? 'text-[#00FF94]' : 'text-[#FF4D4D]'}`}>
                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
