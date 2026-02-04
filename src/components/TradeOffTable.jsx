import React from 'react';
import { Clock, IndianRupee, Zap, Users } from 'lucide-react';

export default function TradeOffTable({ choice }) {
    if (!choice) return <div className="text-center text-slate-500 text-sm mt-4 italic">Hover over a choice to see impact</div>;

    const { cost, impact } = choice;

    const items = [
        {
            icon: <IndianRupee size={16} />,
            label: "Money",
            val: cost.money > 0 ? `-₹${cost.money}` : "Free",
            color: cost.money > 0 ? "text-red-400" : "text-slate-400"
        },
        {
            icon: <Clock size={16} />,
            label: "Time",
            val: cost.time > 0 ? `-${cost.time}h` : "0h",
            color: cost.time > 0 ? "text-amber-400" : "text-slate-400"
        },
        {
            icon: <Zap size={16} />,
            label: "Skills",
            val: impact.skills > 0 ? `+${impact.skills}` : (impact.skills < 0 ? impact.skills : "-"),
            color: impact.skills > 0 ? "text-cyan-400" : "text-slate-500"
        },
        {
            icon: <Users size={16} />,
            label: "Network",
            val: impact.network > 0 ? `+${impact.network}` : "-",
            color: impact.network > 0 ? "text-purple-400" : "text-slate-500"
        }
    ];

    return (
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Projected Impact</h4>
            <div className="grid grid-cols-4 gap-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className={`mb-1 ${item.color}`}>{item.icon}</div>
                        <div className={`text-sm font-bold ${item.color}`}>{item.val}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
