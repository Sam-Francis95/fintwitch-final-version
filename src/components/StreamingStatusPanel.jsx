import React, { useEffect, useState } from 'react';
import { Activity, Zap, Wifi, WifiOff, TrendingUp, Database } from 'lucide-react';

const StreamingStatusPanel = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/status');
      const data = await response.json();
      setStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch streaming status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="text-lg font-bold text-white">Streaming Engine Status</h3>
        </div>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur rounded-lg p-6 border border-red-500/30">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-white">Streaming Engine Offline</h3>
        </div>
      </div>
    );
  }

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const pipelineHealthColor = {
    'operational': 'text-green-400',
    'warning': 'text-yellow-400',
    'error': 'text-red-400'
  }[status.pipeline_health] || 'text-gray-400';

  const pipelineHealthBg = {
    'operational': 'bg-green-500/20 border-green-500/50',
    'warning': 'bg-yellow-500/20 border-yellow-500/50',
    'error': 'bg-red-500/20 border-red-500/50'
  }[status.pipeline_health] || 'bg-gray-500/20 border-gray-500/50';

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur rounded-lg p-6 border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {status.engine_active ? (
            <Wifi className="w-5 h-5 text-green-400 animate-pulse" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
          <h3 className="text-lg font-bold text-white">Pathway Streaming Engine</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${pipelineHealthBg}`}>
          <span className={pipelineHealthColor}>{status.pipeline_health.toUpperCase()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-400 uppercase">Events Processed</p>
          </div>
          <p className="text-2xl font-bold text-white">{status.events_processed.toLocaleString()}</p>
        </div>

        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400 uppercase">Transactions</p>
          </div>
          <p className="text-2xl font-bold text-white">{status.transactions_processed.toLocaleString()}</p>
        </div>

        <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <p className="text-xs text-gray-400 uppercase">External Signals</p>
          </div>
          <p className="text-2xl font-bold text-white">{status.external_signals_processed || 0}</p>
        </div>
      </div>

      {/* Active Data Sources */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Active Data Sources:</p>
        <div className="flex flex-wrap gap-2">
          {status.active_data_sources && status.active_data_sources.length > 0 ? (
            status.active_data_sources.map((source, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium border border-green-500/30"
              >
                {source.replace(/_/g, ' ').toUpperCase()}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No active sources</span>
          )}
        </div>
      </div>

      {/* Last Update Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {status.last_transaction_time && (
          <div className="bg-white/5 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Last Transaction</p>
            <p className="text-sm text-white font-mono">
              {new Date(status.last_transaction_time).toLocaleTimeString()}
            </p>
          </div>
        )}
        {status.last_external_signal_time && (
          <div className="bg-white/5 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Last External Signal</p>
            <p className="text-sm text-white font-mono">
              {new Date(status.last_external_signal_time).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
        <div>
          <p className="text-xs text-gray-400">Window Size</p>
          <p className="text-sm font-bold text-white">{status.current_window_size} minutes</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Uptime</p>
          <p className="text-sm font-bold text-white">{formatUptime(status.uptime_seconds)}</p>
        </div>
      </div>
    </div>
  );
};

export default StreamingStatusPanel;
