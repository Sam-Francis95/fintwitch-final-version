import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { UserContext } from '../context/UserContext';

/**
 * PathwayMetrics Component
 * Displays real-time financial metrics computed by Pathway streaming engine
 */
export default function PathwayMetrics() {
    const { user } = useContext(UserContext);
    const [metrics, setMetrics] = useState({
        balance: 0,
        total_income: 0,
        total_expenses: 0,
        net_cash_flow: 0,
        transaction_count: 0,
        risk: 'LOW'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    // Fetch metrics from Pathway streaming engine
    const fetchMetrics = async () => {
        try {
            const response = await fetch('http://localhost:8000/metrics');
            if (response.ok) {
                const data = await response.json();
                setMetrics(prev => ({ ...prev, ...data }));
                setIsConnected(true);
                setIsLoading(false);
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            console.log('Pathway streaming engine not available');
            setIsConnected(false);
            setIsLoading(false);
        }
    };

    // Real-time polling - update every 2 seconds
    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!isConnected) {
        return (
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <div className="text-center text-slate-400">
                    <Activity size={48} className="mx-auto mb-3 opacity-30 animate-pulse" />
                    <p className="text-sm">Pathway Streaming Engine Offline</p>
                    <p className="text-xs mt-2">Start: backend/start_pathway_streaming.bat</p>
                </div>
            </div>
        );
    }

    const MetricCard = ({ label, value, icon: Icon, color, prefix = '' }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${color} rounded-xl p-4 border border-white/10`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                    {label}
                </span>
                <Icon size={18} className="text-white/60" />
            </div>
            <div className="text-2xl font-bold text-white">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-blue-400" />
                        Pathway Real-Time Metrics
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Live streaming analytics • Updates every 2 seconds
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-slate-400">{isConnected ? 'Streaming' : 'Offline'}</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    label="Current Balance"
                    value={user?.balance ?? 0}
                    icon={TrendingUp}
                    color="from-blue-600 to-cyan-600"
                    prefix="₹"
                />
                <MetricCard
                    label="Total Income"
                    value={metrics.total_income}
                    icon={TrendingUp}
                    color="from-green-600 to-emerald-600"
                    prefix="₹"
                />
                <MetricCard
                    label="Total Expenses"
                    value={Math.abs(metrics.total_expenses ?? 0)}
                    icon={TrendingDown}
                    color="from-red-600 to-rose-600"
                    prefix="₹"
                />
            </div>

            {/* Risk & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`rounded-xl p-6 border ${
                    metrics.risk === 'HIGH' 
                        ? 'bg-red-900/20 border-red-500/50' 
                        : 'bg-green-900/20 border-green-500/50'
                }`}>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className={metrics.risk === 'HIGH' ? 'text-red-400' : 'text-green-400'} size={24} />
                        <div>
                            <div className="text-sm text-slate-400">Risk Level</div>
                            <div className={`text-2xl font-bold ${
                                metrics.risk === 'HIGH' ? 'text-red-400' : 'text-green-400'
                            }`}>
                                {metrics.risk}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                        {metrics.risk === 'HIGH' 
                            ? '⚠️ Expenses exceed income' 
                            : '✓ Financial health stable'}
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                    <div className="flex items-center gap-3">
                        <Activity className="text-blue-400" size={24} />
                        <div>
                            <div className="text-sm text-slate-400">Net Cash Flow</div>
                            <div className={`text-2xl font-bold ${
                                (metrics.net_cash_flow ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                                ₹{(metrics.net_cash_flow ?? 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                        {metrics.transaction_count} transactions processed • net of ingested events
                    </div>
                </div>
            </div>

            {/* Pathway Badge */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Activity className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Powered by Pathway</div>
                            <div className="text-xs text-slate-400">Real-time streaming engine</div>
                        </div>
                    </div>
                    <a 
                        href="http://localhost:8000/docs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 underline"
                    >
                        API Docs →
                    </a>
                </div>
            </div>
        </div>
    );
}
