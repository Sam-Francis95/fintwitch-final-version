import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Lightbulb, TrendingUp, Shield, Activity } from 'lucide-react';

const IntelligencePanel = () => {
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIntelligence = async () => {
      try {
        const response = await fetch('http://localhost:8000/intelligence');
        if (!response.ok) throw new Error('Failed to fetch intelligence');
        const data = await response.json();
        setIntelligence(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIntelligence();
    const interval = setInterval(fetchIntelligence, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-6 h-6 text-purple-400 animate-pulse" />
          <h3 className="text-xl font-bold text-purple-400">Financial Intelligence</h3>
        </div>
        <p className="text-gray-400">Loading intelligence data...</p>
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

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'LOW': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBg = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'bg-red-500/10 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'LOW': return 'bg-green-500/10 border-green-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/30">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-6 h-6 text-purple-400 flex-shrink-0" />
          <h3 className="text-xl font-bold text-purple-400 whitespace-nowrap">Financial Intelligence</h3>
          <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300 whitespace-nowrap flex-shrink-0">
            Real-Time
          </span>
        </div>

        {/* Risk Indicator */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded flex-shrink-0 ${getRiskBg(intelligence?.risk_level || 'LOW')}`}>
          <Shield className={`w-4 h-4 flex-shrink-0 ${getRiskColor(intelligence?.risk_level || 'LOW')}`} />
          <span className={`font-semibold whitespace-nowrap text-sm ${getRiskColor(intelligence?.risk_level || 'LOW')}`}>
            {intelligence?.risk_level || 'LOW'}
          </span>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-medium">Financial Health Score</span>
          <span className="text-2xl font-bold text-purple-400 tabular-nums">
            {typeof intelligence?.financial_health_score === 'number'
              ? parseFloat(intelligence.financial_health_score.toFixed(1))
              : 0}/100
          </span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${(intelligence?.financial_health_score || 0) >= 80 ? 'bg-green-500' :
                (intelligence?.financial_health_score || 0) >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
              }`}
            style={{ width: `${typeof intelligence?.financial_health_score === 'number' ? parseFloat(intelligence.financial_health_score.toFixed(1)) : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Critical Alerts */}
        {intelligence.alerts && intelligence.alerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-red-400 font-semibold mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Critical Alerts</span>
            </div>
            {intelligence.alerts.map((alert, index) => (
              <div
                key={index}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
              >
                {alert}
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {intelligence.warnings && intelligence.warnings.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-yellow-400 font-semibold mb-2">
              <AlertCircle className="w-5 h-5" />
              <span>Warnings</span>
            </div>
            {intelligence.warnings.map((warning, index) => (
              <div
                key={index}
                className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm"
              >
                {warning}
              </div>
            ))}
          </div>
        )}

        {/* Insights */}
        {intelligence.insights && intelligence.insights.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold mb-2">
              <Lightbulb className="w-5 h-5" />
              <span>Insights</span>
            </div>
            {intelligence.insights.map((insight, index) => (
              <div
                key={index}
                className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm"
              >
                {insight}
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {intelligence.recommendations && intelligence.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-green-400 font-semibold mb-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recommendations</span>
            </div>
            {intelligence.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm"
              >
                {rec}
              </div>
            ))}
          </div>
        )}

        {/* No issues - all clear */}
        {(!intelligence.alerts || intelligence.alerts.length === 0) &&
          (!intelligence.warnings || intelligence.warnings.length === 0) &&
          intelligence.risk_level === 'LOW' && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-center font-medium">
                ✅ All systems operational - financial health is excellent!
              </p>
            </div>
          )}
      </div>

      {/* Risk Factors Summary */}
      {intelligence.risk_factors && Object.keys(intelligence.risk_factors).length > 0 && (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Active Risk Factors:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(intelligence.risk_factors).map((factor, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs"
              >
                {factor.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligencePanel;
