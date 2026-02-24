import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Target, DollarSign, AlertTriangle } from 'lucide-react';

const PredictiveInsightsPanel = () => {
  const [predictions, setPredictions] = useState(null);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    try {
      const [predictionsRes, analyticsRes] = await Promise.all([
        fetch('http://localhost:8000/metrics/predictions'),
        fetch('http://localhost:8000/metrics/advanced')
      ]);
      const predictionsData = await predictionsRes.json();
      const analyticsData = await analyticsRes.json();
      setPredictions(predictionsData);
      setAdvancedAnalytics(analyticsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur rounded-lg p-6 border border-cyan-500/30">
        <h3 className="text-lg font-bold text-white mb-3">Predictive Insights</h3>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!predictions || !advancedAnalytics) return null;

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-red-400" />;
    if (trend === 'falling') return <TrendingDown className="w-4 h-4 text-green-400" />;
    return <Target className="w-4 h-4 text-blue-400" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'rising') return 'text-red-400';
    if (trend === 'falling') return 'text-green-400';
    return 'text-blue-400';
  };

  const getPatternColor = (pattern) => {
    if (pattern === 'impulsive') return 'text-red-400 bg-red-500/20 border-red-500/50';
    if (pattern === 'stable') return 'text-green-400 bg-green-500/20 border-green-500/50';
    return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
  };

  return (
    <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur rounded-lg p-6 border border-cyan-500/30">
      <h3 className="text-lg font-bold text-white mb-4">Predictive Insights & Trends</h3>

      {/* Spending Trend & Pattern */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            {getTrendIcon(advancedAnalytics.trend)}
            <p className="text-xs text-gray-400">Spending Trend</p>
          </div>
          <p className={`text-xl font-bold ${getTrendColor(advancedAnalytics?.trend || 'stable')}`}>
            {(advancedAnalytics?.trend || 'stable').toUpperCase()}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-2">Pattern</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getPatternColor(advancedAnalytics?.spending_pattern || 'normal')}`}>
            {(advancedAnalytics?.spending_pattern || 'normal').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Velocity Metrics */}
      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30 mb-4">
        <p className="text-sm text-gray-300 mb-3 font-semibold">Spending Velocity</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Per Minute</p>
            <p className="text-2xl font-bold text-purple-300">
              ₹{advancedAnalytics?.spending_velocity?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Per Day (Est)</p>
            <p className="text-2xl font-bold text-purple-300">
              ₹{predictions.burn_rate_per_day?.toFixed(0) || '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Depletion Warning */}
      {predictions.days_until_zero_balance !== null && (
        <div className={`rounded-lg p-4 border mb-4 ${predictions.days_until_zero_balance < 7
            ? 'bg-red-500/20 border-red-500/50'
            : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className={`w-5 h-5 ${predictions.days_until_zero_balance < 7 ? 'text-red-400' : 'text-yellow-400'
              }`} />
            <h4 className="font-bold text-white">Balance Depletion Forecast</h4>
          </div>
          <p className="text-sm text-gray-300 mb-2">
            At current spending rate, your balance may reach zero in:
          </p>
          <p className={`text-3xl font-bold ${predictions.days_until_zero_balance < 7 ? 'text-red-400' : 'text-yellow-400'
            }`}>
            {predictions.days_until_zero_balance} days
          </p>
        </div>
      )}

      {/* Monthly Projections */}
      <div className="space-y-3">
        {predictions.projected_monthly_deficit > 0 && (
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-gray-300">Projected Monthly Deficit</p>
              </div>
              <p className="text-xl font-bold text-red-400">
                -₹{predictions.projected_monthly_deficit.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {predictions.projected_monthly_surplus > 0 && (
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-sm text-gray-300">Projected Monthly Surplus</p>
              </div>
              <p className="text-xl font-bold text-green-400">
                +₹{predictions.projected_monthly_surplus.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Recommended Daily Budget */}
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-gray-300">Recommended Daily Budget</p>
            </div>
            <p className="text-xl font-bold text-blue-400">
              ₹{predictions.recommended_daily_budget?.toFixed(0) || '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Escalation Warning */}
      {predictions.risk_escalation_warning && (
        <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <p className="text-sm font-bold text-red-300">
              ⚠️ Risk Escalation: Spending is accelerating rapidly!
            </p>
          </div>
        </div>
      )}

      {/* Anomaly Detection */}
      {advancedAnalytics.anomaly_detected && advancedAnalytics.recent_anomalies?.length > 0 && (
        <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Recent Anomalies Detected
          </h4>
          <div className="space-y-2">
            {advancedAnalytics.recent_anomalies.slice(-3).map((anomaly, idx) => (
              <div key={idx} className="text-sm text-gray-300 bg-white/5 rounded p-2">
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(anomaly.time).toLocaleString()}
                </p>
                <p>{anomaly.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveInsightsPanel;
