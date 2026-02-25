import React, { useState, useEffect } from 'react';
import { Clock, TrendingDown, TrendingUp, Activity, Zap } from 'lucide-react';

const WindowedMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [windowSize, setWindowSize] = useState(5); // Default 5 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:8000/metrics/windowed?window_minutes=${windowSize}`);
        if (!response.ok) throw new Error('Failed to fetch windowed metrics');
        const data = await response.json();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [windowSize]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-blue-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-6 h-6 text-blue-400 animate-pulse" />
          <h3 className="text-xl font-bold text-blue-400">Time-Windowed Analytics</h3>
        </div>
        <p className="text-gray-400">Loading time-series data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/30">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  const windowOptions = [
    { value: 1, label: '1 min' },
    { value: 5, label: '5 min' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' }
  ];

  const netFlow = (metrics?.recent_income || 0) - (metrics?.recent_expenses || 0);
  const isPositive = netFlow >= 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-blue-500/30">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <Clock className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-blue-400">Recent Activity</h3>
          <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
            Rolling Window
          </span>
        </div>

        {/* Window Size Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Window:</span>
          <div className="flex flex-wrap gap-1">
            {windowOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setWindowSize(option.value)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all whitespace-nowrap ${windowSize === option.value
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Period Summary Banner */}
      <div className={`p-4 rounded-lg mb-6 ${metrics.recent_transactions === 0
          ? 'bg-gray-700/50 border border-gray-600'
          : isPositive
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
        <p className={`text-center font-medium ${(metrics?.recent_transactions || 0) === 0
            ? 'text-gray-400'
            : isPositive
              ? 'text-green-300'
              : 'text-red-300'
          }`}>
          {metrics?.period_summary || 'No data for this period'}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Recent Income */}
        <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Income</span>
          </div>
          <p className="text-xl font-bold text-green-300 tabular-nums break-all">
            ₹{metrics?.recent_income?.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-green-400/60 mt-1">
            Last {windowSize} min
          </p>
        </div>

        {/* Recent Expenses */}
        <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Expenses</span>
          </div>
          <p className="text-xl font-bold text-red-300 tabular-nums break-all">
            ₹{metrics?.recent_expenses?.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-red-400/60 mt-1">
            Last {windowSize} min
          </p>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Transaction Count */}
        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">
              Transactions
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-300">
            {metrics?.recent_transactions || 0}
          </p>
          <p className="text-xs text-blue-400/60 mt-1">
            {(metrics?.recent_transactions || 0) === 0
              ? 'No activity'
              : `${((metrics?.recent_transactions || 0) / windowSize).toFixed(1)}/min`
            }
          </p>
        </div>

        {/* Spending Rate */}
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">
              Spend Rate
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-300">
            ₹{metrics?.spending_rate_per_minute?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-purple-400/60 mt-1">
            Per minute
          </p>
        </div>
      </div>

      {/* High Activity Warning */}
      {(metrics?.spending_rate_per_minute || 0) > 100 && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">
              High spending velocity detected!
            </span>
          </div>
          <p className="text-xs text-orange-400/80 mt-1 ml-6">
            Spending rate is above ₹100/minute - monitor closely
          </p>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-blue-500/20">
        <p className="text-xs text-gray-500 text-center">
          🌊 Computed using Pathway time-windowed streaming analytics
          <br />
          Updates automatically every 2 seconds
        </p>
      </div>
    </div>
  );
};

export default WindowedMetrics;
