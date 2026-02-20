import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { useBudgetStore } from '../store/useBudgetStore';
import BudgetDashboard from '../components/BudgetDashboard';
import BudgetAllocator from '../components/BudgetAllocator';
import BudgetAlerts from '../components/BudgetAlerts';
import { useToast } from '../context/ToastContext';
import { 
    Wallet, 
    TrendingUp, 
    AlertTriangle, 
    History, 
    Plus,
    RefreshCw,
    DollarSign,
    ArrowRight
} from 'lucide-react';

export default function BudgetArea() {
    const { user, transact } = useContext(UserContext);
    const { push } = useToast();
    const { 
        buckets, 
        metrics, 
        alerts, 
        transactions,
        isLoading, 
        isInitialized,
        initializeBudget,
        allocateIncome,
        syncAll,
        refreshTransactions
    } = useBudgetStore();

    const [showAllocator, setShowAllocator] = useState(false);
    const [incomeAmount, setIncomeAmount] = useState('');
    const [showTransactions, setShowTransactions] = useState(false);

    // Initialize budget system
    useEffect(() => {
        if (user?.username && !isInitialized) {
            initializeBudget(user.username);
        }
    }, [user?.username, isInitialized]);

    // Auto-refresh data periodically
    useEffect(() => {
        if (!user?.username || !isInitialized) return;
        
        const interval = setInterval(() => {
            syncAll(user.username);
        }, 10000); // Refresh every 10 seconds
        
        return () => clearInterval(interval);
    }, [user?.username, isInitialized]);

    // Handle manual income allocation
    const handleAllocateIncome = async (allocations, description) => {
        if (!user?.username) {
            push('Please log in to allocate income', { style: 'danger' });
            return;
        }

        const income = parseFloat(incomeAmount);
        if (isNaN(income) || income <= 0) {
            push('Invalid income amount', { style: 'danger' });
            return;
        }

        const result = await allocateIncome(user.username, income, allocations, description);
        
        if (result.success) {
            push(`✅ Income allocated: ₹${income.toLocaleString()}`, { style: 'success' });
            
            // Also update main balance
            transact(income, { source: 'manual_income', label: description || 'Manual Income' });
            
            setShowAllocator(false);
            setIncomeAmount('');
            
            // Refresh data
            syncAll(user.username);
        } else {
            push(`❌ ${result.error}`, { style: 'danger' });
        }
    };

    const handleRefresh = () => {
        if (user?.username) {
            syncAll(user.username);
            push('Budget data refreshed', { style: 'success' });
        }
    };

    const handleViewTransactions = () => {
        if (user?.username) {
            refreshTransactions(user.username, 100);
            setShowTransactions(!showTransactions);
        }
    };

    if (!user?.username) {
        return (
            <div className="max-w-5xl mx-auto min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                    <p className="text-slate-400">Please log in to access the Budget Allocation System</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-sans">
            {/* Header */}
            <div className="text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-heading uppercase tracking-tighter drop-shadow-sm mb-4">
                        Budget Allocation
                    </h1>
                    <p className="text-lg text-slate-400 mb-6">
                        Real-time financial intelligence simulator • Manage your budget buckets strategically
                    </p>
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full"></div>
                </motion.div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3 justify-center">
                <button 
                    onClick={() => setShowAllocator(!showAllocator)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/50"
                >
                    <Plus size={20} />
                    {showAllocator ? 'Cancel Allocation' : 'Allocate Income'}
                </button>
                
                <button 
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                </button>

                <button 
                    onClick={handleViewTransactions}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
                >
                    <History size={20} />
                    Budget History
                </button>
            </div>

            {/* Allocator Modal */}
            <AnimatePresence>
                {showAllocator && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-800">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Income Amount (₹)
                                </label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type="number"
                                        value={incomeAmount}
                                        onChange={(e) => setIncomeAmount(e.target.value)}
                                        placeholder="Enter income amount"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white text-xl font-bold focus:outline-none focus:border-blue-500"
                                        min="0"
                                        step="100"
                                    />
                                </div>
                            </div>

                            {parseFloat(incomeAmount) > 0 && (
                                <BudgetAllocator 
                                    incomeAmount={parseFloat(incomeAmount)}
                                    onAllocate={handleAllocateIncome}
                                    onCancel={() => {
                                        setShowAllocator(false);
                                        setIncomeAmount('');
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <BudgetAlerts alerts={alerts} />
                </motion.div>
            )}

            {/* Dashboard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <BudgetDashboard buckets={buckets} metrics={metrics} />
            </motion.div>

            {/* Transaction History */}
            <AnimatePresence>
                {showTransactions && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <History size={24} className="text-blue-400" />
                                    Budget Transaction History
                                </h3>
                                <span className="text-sm text-slate-400">
                                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {transactions.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <History size={48} className="mx-auto mb-3 opacity-30" />
                                    <p>No budget transactions yet</p>
                                    <p className="text-sm mt-2">Start by allocating income to your budget buckets</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {transactions.slice().reverse().map((tx, index) => (
                                        <motion.div
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            tx.type === 'income' 
                                                                ? 'bg-green-500/20 text-green-400' 
                                                                : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {tx.type.toUpperCase()}
                                                        </span>
                                                        {tx.bucket && (
                                                            <span className="text-xs text-slate-400 font-mono">
                                                                {tx.bucket.replace('_', ' ')}
                                                            </span>
                                                        )}
                                                        {tx.deficit > 0 && (
                                                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 flex items-center gap-1">
                                                                <AlertTriangle size={12} />
                                                                Deficit: ₹{tx.deficit.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-300 mb-1">
                                                        {tx.description || tx.category || 'Transaction'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-mono">
                                                        {new Date(tx.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold font-mono ${
                                                        tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                        {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                                                    </div>
                                                    {tx.resulting_balance !== undefined && (
                                                        <div className="text-xs text-slate-500 font-mono mt-1">
                                                            Balance: ₹{tx.resulting_balance.toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Info Panel */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-800"
            >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-400" />
                    How Budget Allocation Works
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <ArrowRight size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                            <span><strong>Income Allocation:</strong> Distribute incoming funds across budget buckets strategically</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <ArrowRight size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                            <span><strong>Automatic Expenses:</strong> System deducts from appropriate buckets automatically</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <ArrowRight size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                            <span><strong>Risk Alerts:</strong> Real-time warnings when buckets run low</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <ArrowRight size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                            <span><strong>Financial Resilience:</strong> Better allocation = better stability</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
