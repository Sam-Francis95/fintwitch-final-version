import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X, Shield, TrendingDown } from 'lucide-react';

const getSeverityIcon = (severity) => {
    switch(severity) {
        case 'critical':
            return <AlertTriangle className="text-red-500" size={20} />;
        case 'high':
            return <AlertCircle className="text-orange-500" size={20} />;
        case 'medium':
            return <AlertCircle className="text-yellow-500" size={20} />;
        default:
            return <Info className="text-blue-500" size={20} />;
    }
};

const getSeverityColor = (severity) => {
    switch(severity) {
        case 'critical':
            return 'border-red-500/30 bg-red-500/10';
        case 'high':
            return 'border-orange-500/30 bg-orange-500/10';
        case 'medium':
            return 'border-yellow-500/30 bg-yellow-500/10';
        default:
            return 'border-blue-500/30 bg-blue-500/10';
    }
};

const getSeverityBadgeColor = (severity) => {
    switch(severity) {
        case 'critical':
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'high':
            return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'medium':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        default:
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
};

export default function BudgetAlerts({ alerts, onDismiss }) {
    const [dismissedAlerts, setDismissedAlerts] = React.useState(new Set());

    const handleDismiss = (alertId) => {
        setDismissedAlerts(prev => new Set([...prev, alertId]));
        if (onDismiss) {
            onDismiss(alertId);
        }
    };

    const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

    // Sort by severity
    const sortedAlerts = [...visibleAlerts].sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });

    if (sortedAlerts.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-1">All Clear!</h3>
                        <p className="text-green-100 text-sm">No financial alerts at the moment. Keep up the good work!</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="text-red-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Financial Alerts</h3>
                        <p className="text-sm text-slate-400">{sortedAlerts.length} active warning{sortedAlerts.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            {/* Alerts List */}
            <AnimatePresence mode="popLayout">
                {sortedAlerts.map((alert, index) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-xl p-5 border ${getSeverityColor(alert.severity)} backdrop-blur-sm relative overflow-hidden group`}
                    >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                                {getSeverityIcon(alert.severity)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full border uppercase tracking-wide ${getSeverityBadgeColor(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                            {alert.category && (
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {alert.category.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white font-medium leading-relaxed">
                                            {alert.message}
                                        </p>
                                        {alert.timestamp && (
                                            <div className="text-xs text-slate-500 mt-2 font-mono">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleDismiss(alert.id)}
                                        className="text-slate-400 hover:text-white transition-colors flex-shrink-0 p-1 hover:bg-white/10 rounded"
                                        title="Dismiss alert"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Summary Banner */}
            {sortedAlerts.length > 3 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center gap-3"
                >
                    <TrendingDown className="text-yellow-400" size={20} />
                    <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                            Multiple alerts detected
                        </div>
                        <div className="text-xs text-slate-400">
                            Review your budget allocations to improve financial stability
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
