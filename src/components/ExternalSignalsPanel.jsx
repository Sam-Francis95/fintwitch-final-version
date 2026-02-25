import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Globe, Activity, Calendar } from 'lucide-react';

const ExternalSignalsPanel = () => {
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchSignals = async () => {
    try {
      const response = await fetch('http://localhost:8000/external-signals');
      const data = await response.json();
      setSignals(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch external signals:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur rounded-lg p-6 border border-indigo-500/30">
        <h3 className="text-lg font-bold text-white mb-3">External Signals</h3>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!signals) return null;

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.6) return 'text-green-400';
    if (sentiment < 0.4) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.7) return 'Very Bullish';
    if (sentiment > 0.6) return 'Bullish';
    if (sentiment > 0.4) return 'Neutral';
    if (sentiment > 0.3) return 'Bearish';
    return 'Very Bearish';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur rounded-lg p-6 border border-indigo-500/30">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">External Market Signals</h3>
      </div>

      {/* Market Sentiment */}
      <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-400">Market Sentiment</p>
          <span className={`font-bold ${getSentimentColor(signals?.market_sentiment || 0.5)}`}>
            {getSentimentLabel(signals?.market_sentiment || 0.5)}
          </span>
        </div>

        {/* Sentiment Bar */}
        <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-500 ${(signals?.market_sentiment || 0.5) > 0.5 ? 'bg-green-500' : 'bg-red-500'
              }`}
            style={{ width: `${(signals?.market_sentiment || 0.5) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
      </div>

      {/* Economic Indicators Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-400">Volatility</p>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {((signals?.market_volatility ?? 0) * 100).toFixed(0)}%
          </p>
          <p className={`text-xs mt-1 ${signals.market_volatility > 0.5 ? 'text-red-400' : 'text-green-400'
            }`}>
            {(signals?.market_volatility || 0) > 0.5 ? 'High' : 'Moderate'}
          </p>
        </div>

        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400">Interest Rate</p>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {signals?.interest_rate?.toFixed(2) || '0.00'}%
          </p>
          <p className={`text-xs mt-1 ${signals.interest_rate > 7 ? 'text-red-400' : 'text-green-400'
            }`}>
            {(signals?.interest_rate || 0) > 7 ? 'High' : 'Favorable'}
          </p>
        </div>

        <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-orange-400" />
              <p className="text-xs text-gray-400">Inflation Rate</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {signals?.inflation_rate?.toFixed(1) || '0.0'}%
            </p>
          </div>
          <div className="mt-2">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${(signals?.inflation_rate || 0) > 6 ? 'bg-red-500' :
                    (signals?.inflation_rate || 0) > 4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                style={{ width: `${Math.min((signals?.inflation_rate || 0) * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Impact on Spending */}
      <div className={`rounded-lg p-4 border ${signals.impact_on_spending < -0.2 ? 'bg-red-500/10 border-red-500/30' :
          signals.impact_on_spending > 0.2 ? 'bg-green-500/10 border-green-500/30' :
            'bg-blue-500/10 border-blue-500/30'
        }`}>
        <p className="text-sm text-gray-300 mb-2">Market Impact on Your Spending</p>
        <div className="flex items-center gap-3">
          {(signals?.impact_on_spending || 0) < 0 ? (
            <>
              <TrendingDown className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-400 font-bold">Negative Impact</p>
                <p className="text-xs text-gray-400">Market conditions suggest cautious spending</p>
              </div>
            </>
          ) : (signals?.impact_on_spending || 0) > 0 ? (
            <>
              <TrendingUp className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-green-400 font-bold">Positive Impact</p>
                <p className="text-xs text-gray-400">Favorable conditions for financial planning</p>
              </div>
            </>
          ) : (
            <>
              <Activity className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-blue-400 font-bold">Neutral Impact</p>
                <p className="text-xs text-gray-400">Stable market conditions</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Events */}
      {signals.recent_events && signals.recent_events.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-400 font-semibold">Recent External Events</p>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {signals.recent_events.slice(-5).reverse().map((event, idx) => (
              <div key={idx} className="bg-white/5 rounded p-3 border border-white/10">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 text-xs rounded flex-shrink-0">
                    {event.category?.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                    {event.time ? new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-300 break-words">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalSignalsPanel;
