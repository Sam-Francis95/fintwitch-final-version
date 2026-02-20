import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { BUDGET_CATEGORIES } from '../store/useBudgetStore';

export default function BudgetAllocator({ incomeAmount, onAllocate, onCancel }) {
    const [allocations, setAllocations] = useState({
        living_expenses: 0,
        emergency_fund: 0,
        investments: 0,
        savings: 0
    });
    
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    // Calculate totals
    const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    const remaining = incomeAmount - totalAllocated;
    const allocationPercentage = (totalAllocated / incomeAmount) * 100;

    // Handle slider change
    const handleAllocationChange = (category, value) => {
        const numValue = parseFloat(value) || 0;
        setAllocations(prev => ({
            ...prev,
            [category]: numValue
        }));
        setError('');
    };

    // Quick allocation presets
    const applyPreset = (preset) => {
        let newAllocations = {};
        
        switch(preset) {
            case 'balanced':
                // 50/30/20 rule adapted
                newAllocations = {
                    living_expenses: Math.round(incomeAmount * 0.50),
                    emergency_fund: Math.round(incomeAmount * 0.20),
                    investments: Math.round(incomeAmount * 0.15),
                    savings: Math.round(incomeAmount * 0.15)
                };
                break;
            case 'aggressive_save':
                newAllocations = {
                    living_expenses: Math.round(incomeAmount * 0.40),
                    emergency_fund: Math.round(incomeAmount * 0.20),
                    investments: Math.round(incomeAmount * 0.25),
                    savings: Math.round(incomeAmount * 0.15)
                };
                break;
            case 'conservative':
                newAllocations = {
                    living_expenses: Math.round(incomeAmount * 0.40),
                    emergency_fund: Math.round(incomeAmount * 0.35),
                    investments: Math.round(incomeAmount * 0.15),
                    savings: Math.round(incomeAmount * 0.10)
                };
                break;
            case 'growth':
                newAllocations = {
                    living_expenses: Math.round(incomeAmount * 0.35),
                    emergency_fund: Math.round(incomeAmount * 0.15),
                    investments: Math.round(incomeAmount * 0.40),
                    savings: Math.round(incomeAmount * 0.10)
                };
                break;
            default:
                return;
        }
        
        setAllocations(newAllocations);
    };

    // Handle submit
    const handleSubmit = () => {
        if (totalAllocated > incomeAmount) {
            setError(`Total allocation (₹${totalAllocated}) exceeds income (₹${incomeAmount})`);
            return;
        }
        
        if (totalAllocated === 0) {
            setError('Please allocate some amount to at least one bucket');
            return;
        }
        
        onAllocate(allocations, description || 'Income allocation');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Allocate Income</h3>
                            <p className="text-blue-100 text-sm">Distribute funds across your budget buckets</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-blue-100">Income Amount</div>
                        <div className="text-3xl font-bold">₹{incomeAmount.toLocaleString()}</div>
                    </div>
                </div>
                
                {/* Progress bar */}
                <div className="relative bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div 
                        className={`h-full rounded-full ${
                            allocationPercentage > 100 ? 'bg-red-500' : 
                            allocationPercentage === 100 ? 'bg-green-400' : 
                            'bg-yellow-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, allocationPercentage)}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                    <span>Allocated: ₹{totalAllocated.toLocaleString()} ({allocationPercentage.toFixed(1)}%)</span>
                    <span className={remaining < 0 ? 'text-red-300 font-bold' : 'text-white'}>
                        Remaining: ₹{remaining.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                    onClick={() => applyPreset('balanced')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-blue-500 transition-all text-sm"
                >
                    <div className="font-bold text-white mb-1">⚖️ Balanced</div>
                    <div className="text-xs text-slate-400">50/20/15/15</div>
                </button>
                <button 
                    onClick={() => applyPreset('aggressive_save')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-green-500 transition-all text-sm"
                >
                    <div className="font-bold text-white mb-1">💪 Aggressive</div>
                    <div className="text-xs text-slate-400">40/20/25/15</div>
                </button>
                <button 
                    onClick={() => applyPreset('conservative')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-yellow-500 transition-all text-sm"
                >
                    <div className="font-bold text-white mb-1">🛡️ Conservative</div>
                    <div className="text-xs text-slate-400">40/35/15/10</div>
                </button>
                <button 
                    onClick={() => applyPreset('growth')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-purple-500 transition-all text-sm"
                >
                    <div className="font-bold text-white mb-1">📈 Growth</div>
                    <div className="text-xs text-slate-400">35/15/40/10</div>
                </button>
            </div>

            {/* Allocation Sliders */}
            <div className="space-y-4">
                {Object.entries(BUDGET_CATEGORIES).map(([key, category]) => {
                    const percentage = incomeAmount > 0 ? (allocations[key] / incomeAmount * 100).toFixed(1) : 0;
                    
                    return (
                        <div key={key} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div>
                                        <div className="font-bold text-white">{category.name}</div>
                                        <div className="text-xs text-slate-400">{percentage}% of income</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <input 
                                        type="number"
                                        value={allocations[key]}
                                        onChange={(e) => handleAllocationChange(key, e.target.value)}
                                        className="w-32 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-right"
                                        min="0"
                                        max={incomeAmount}
                                        step="100"
                                    />
                                </div>
                            </div>
                            <input 
                                type="range"
                                value={allocations[key]}
                                onChange={(e) => handleAllocationChange(key, e.target.value)}
                                min="0"
                                max={incomeAmount}
                                step="100"
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, ${category.color} ${percentage}%, #1e293b ${percentage}%)`
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Description Input */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (optional)
                </label>
                <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Salary March 2026"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Error Message */}
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3 text-red-400"
                >
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={totalAllocated === 0 || totalAllocated > incomeAmount}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <TrendingUp size={20} />
                    Allocate Funds
                </button>
                <button 
                    onClick={onCancel}
                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
