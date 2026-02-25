import React, { useEffect, useState } from 'react';
import { Layers, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { MOCK_FUSION } from '../utils/pathwayMockData';

const MultiSourceFusionPanel = () => {
  const [fusion, setFusion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFusion();
    const interval = setInterval(fetchFusion, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFusion = async () => {
    try {
      const response = await fetch('http://localhost:8000/metrics/fusion');
      const data = await response.json();
      setFusion(data);
      setLoading(false);
    } catch (error) {
      setFusion(MOCK_FUSION);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur rounded-lg p-6 border border-pink-500/30">
        <h3 className="text-lg font-bold text-white mb-3">Multi-Source Risk Fusion</h3>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!fusion) return null;

  const getRiskColor = (risk) => {
    if (risk > 70) return 'text-red-400';
    if (risk > 50) return 'text-orange-400';
    if (risk > 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBgColor = (risk) => {
    if (risk > 70) return 'bg-red-500';
    if (risk > 50) return 'bg-orange-500';
    if (risk > 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLabel = (risk) => {
    if (risk > 70) return 'CRITICAL';
    if (risk > 50) return 'HIGH';
    if (risk > 30) return 'MEDIUM';
    return 'LOW';
  };

  const getActionIcon = (action) => {
    if (action === 'urgent_action_needed') return <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />;
    if (action === 'reduce_spending') return <TrendingUp className="w-5 h-5 text-orange-400" />;
    return <Shield className="w-5 h-5 text-blue-400" />;
  };

  const getActionMessage = (action) => {
    const messages = {
      'urgent_action_needed': 'Immediate action required to prevent financial distress',
      'reduce_spending': 'Consider reducing non-essential spending',
      'monitor_closely': 'Monitor your financial situation closely',
      'maintain_current_habits': 'Continue your current financial habits'
    };
    return messages[action] || 'Review your financial strategy';
  };

  return (
    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur rounded-lg p-6 border border-pink-500/30">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-white">Multi-Source Risk Fusion</h3>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Combining user spending + market signals + economic indicators
      </p>

      {/* Overall Risk Score */}
      <div className="bg-white/5 rounded-lg p-6 mb-4 border border-white/10">
        <p className="text-sm text-gray-400 mb-3 text-center">Overall Financial Risk</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <p className={`text-5xl font-bold tabular-nums ${getRiskColor(fusion?.overall_financial_risk || 0)}`}>
            {(fusion?.overall_financial_risk || 0)?.toFixed(0)}
          </p>
          <p className="text-gray-400 text-xl self-end pb-1">/ 100</p>
        </div>

        {/* Risk Bar */}
        <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-500 ${getRiskBgColor(fusion?.overall_financial_risk || 0)}`}
            style={{ width: `${fusion?.overall_financial_risk || 0}%` }}
          />
        </div>

        <div className="text-center">
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${getRiskColor(fusion?.overall_financial_risk || 0)}`}>
            {getRiskLabel(fusion?.overall_financial_risk || 0)} RISK
          </span>
        </div>
      </div>

      {/* Market-Adjusted Health */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 mb-4 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1">Market-Adjusted Health Score</p>
            <p className="text-xs text-gray-400">Includes external market conditions</p>
          </div>
          <div className="text-right flex items-baseline gap-1 justify-end">
            <p className="text-3xl font-bold text-purple-300 tabular-nums">
              {fusion?.market_adjusted_health?.toFixed(0) || '0'}
            </p>
            <p className="text-sm text-gray-400">/ 100</p>
          </div>
        </div>
      </div>

      {/* Risk Breakdown */}
      {fusion.risk_breakdown && (
        <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
          <p className="text-sm font-semibold text-gray-300 mb-3">Risk Breakdown</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Your Spending Risk</span>
              <span className={`text-sm font-bold ${getRiskColor(fusion.risk_breakdown.user_spending_risk)}`}>
                {fusion.risk_breakdown.user_spending_risk?.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Market Risk Multiplier</span>
              <span className="text-sm font-bold text-orange-400">
                {fusion.risk_breakdown?.market_risk_multiplier?.toFixed(2) || '1.00'}x
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Economic Factors Risk</span>
              <span className={`text-sm font-bold ${getRiskColor(fusion.risk_breakdown?.economic_factors_risk || 0)}`}>
                +{fusion.risk_breakdown?.economic_factors_risk?.toFixed(0) || '0'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className={`rounded-lg p-4 border ${fusion.recommended_action === 'urgent_action_needed'
          ? 'bg-red-500/20 border-red-500'
          : fusion.recommended_action === 'reduce_spending'
            ? 'bg-orange-500/20 border-orange-500'
            : 'bg-blue-500/20 border-blue-500'
        }`}>
        <div className="flex items-start gap-3">
          {getActionIcon(fusion.recommended_action)}
          <div className="flex-1">
            <p className="font-bold text-white mb-1">Recommended Action</p>
            <p className="text-sm text-gray-300">
              {getActionMessage(fusion.recommended_action)}
            </p>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <p className="text-xs text-gray-500 text-center">
          ⚡ Powered by real-time multi-source data fusion via Pathway streaming
        </p>
      </div>
    </div>
  );
};

export default MultiSourceFusionPanel;
