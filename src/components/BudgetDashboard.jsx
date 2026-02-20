import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BUDGET_CATEGORIES } from '../store/useBudgetStore';

export default function BudgetDashboard({ buckets, metrics }) {
    const totalBalance = Object.values(buckets).reduce((sum, val) => sum + val, 0);
    
    // Calculate bucket percentages
    const getBucketPercentage = (amount) => {
        return totalBalance > 0 ? (amount / totalBalance * 100).toFixed(1) : 0;
    };

    return (
        <div className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Balance */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-5 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 opacity-10">
                        <Wallet size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm text-blue-100 mb-1 flex items-center gap-2">
                            <DollarSign size={16} />
                            Total Balance
                        </div>
                        <div className="text-3xl font-bold mb-1">₹{totalBalance.toLocaleString()}</div>
                        <div className="text-xs text-blue-100">Across all buckets</div>
                    </div>
                </motion.div>

                {/* Total Income */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 opacity-10">
                        <ArrowUpRight size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm text-green-100 mb-1 flex items-center gap-2">
                            <TrendingUp size={16} />
                            Total Income
                        </div>
                        <div className="text-3xl font-bold mb-1">₹{(metrics.total_income || 0).toLocaleString()}</div>
                        <div className="text-xs text-green-100">All time earnings</div>
                    </div>
                </motion.div>

                {/* Total Expenses */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-5 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 opacity-10">
                        <ArrowDownRight size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm text-red-100 mb-1 flex items-center gap-2">
                            <TrendingDown size={16} />
                            Total Expenses
                        </div>
                        <div className="text-3xl font-bold mb-1">₹{(metrics.total_expenses || 0).toLocaleString()}</div>
                        <div className="text-xs text-red-100">All time spending</div>
                    </div>
                </motion.div>

                {/* Net Cash Flow */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`bg-gradient-to-br ${
                        (metrics.net_cash_flow || 0) >= 0 
                            ? 'from-purple-600 to-pink-600' 
                            : 'from-gray-700 to-gray-800'
                    } rounded-xl p-5 text-white relative overflow-hidden`}
                >
                    <div className="absolute top-0 right-0 opacity-10">
                        <PiggyBank size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm text-purple-100 mb-1 flex items-center gap-2">
                            <DollarSign size={16} />
                            Net Cash Flow
                        </div>
                        <div className="text-3xl font-bold mb-1">
                            {(metrics.net_cash_flow || 0) >= 0 ? '+' : ''}₹{(metrics.net_cash_flow || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-purple-100">Income - Expenses</div>
                    </div>
                </motion.div>
            </div>

            {/* Budget Buckets */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Wallet size={24} className="text-blue-400" />
                    Budget Buckets
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(BUDGET_CATEGORIES).map(([key, category], index) => {
                        const amount = buckets[key] || 0;
                        const percentage = getBucketPercentage(amount);
                        
                        return (
                            <motion.div 
                                key={key}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            {category.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg">{category.name}</div>
                                            <div className="text-xs text-slate-400">{percentage}% of total</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <div className="text-3xl font-bold text-white mb-1">
                                        ₹{amount.toLocaleString()}
                                    </div>
                                </div>
                                
                                {/* Visual bar */}
                                <div className="relative bg-slate-900 rounded-full h-2 overflow-hidden">
                                    <motion.div 
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: category.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                </div>
                                
                                {/* Status indicator */}
                                <div className="mt-3 flex items-center gap-2">
                                    <div 
                                        className={`w-2 h-2 rounded-full ${
                                            amount > 5000 ? 'bg-green-500' :
                                            amount > 2000 ? 'bg-yellow-500' :
                                            'bg-red-500 animate-pulse'
                                        }`}
                                    />
                                    <span className={`text-xs font-medium ${
                                        amount > 5000 ? 'text-green-400' :
                                        amount > 2000 ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                        {amount > 5000 ? 'Healthy' :
                                         amount > 2000 ? 'Moderate' :
                                         'Low - Refill Recommended'}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Distribution Visualization */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-4">Distribution Overview</h3>
                
                <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden flex">
                    {Object.entries(BUDGET_CATEGORIES).map(([key, category]) => {
                        const percentage = getBucketPercentage(buckets[key] || 0);
                        
                        if (percentage === 0 || percentage === '0.0') return null;
                        
                        return (
                            <motion.div
                                key={key}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5 }}
                                style={{ backgroundColor: category.color }}
                                className="flex items-center justify-center text-white text-xs font-bold relative group cursor-pointer"
                                title={`${category.name}: ${percentage}%`}
                            >
                                {parseFloat(percentage) > 10 && (
                                    <span className="relative z-10">{percentage}%</span>
                                )}
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                                    {category.name}: ₹{(buckets[key] || 0).toLocaleString()}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {Object.entries(BUDGET_CATEGORIES).map(([key, category]) => (
                        <div key={key} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm text-slate-400">{category.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
