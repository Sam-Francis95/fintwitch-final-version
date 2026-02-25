import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, TrendingUp, Clock, Target } from 'lucide-react';
import { MOCK_ALERTS } from '../utils/pathwayMockData';

const RealTimeAlertsPanel = () => {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8000/alerts');
      const data = await response.json();
      setAlerts(data);
      setLoading(false);
    } catch (error) {
      setAlerts(MOCK_ALERTS);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur rounded-lg p-6 border border-red-500/30">
        <h3 className="text-lg font-bold text-white mb-3">Real-Time Alerts</h3>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!alerts) return null;

  const hasAlerts = alerts?.critical?.length > 0 || alerts?.warnings?.length > 0 || alerts?.opportunities?.length > 0;

  return (
    <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur rounded-lg p-6 border border-red-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Real-Time Alerts</h3>
        {alerts?.triggered_at && (
          <span className="text-xs text-gray-400">
            {new Date(alerts.triggered_at).toLocaleTimeString()}
          </span>
        )}
      </div>

      {!hasAlerts ? (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-3">
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-gray-400">All clear! No active alerts</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Critical Alerts */}
          {alerts.critical?.map((alert, idx) => (
            <div
              key={`critical-${idx}`}
              className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                      {alert.level}
                    </span>
                    <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                  <div className="bg-red-500/20 rounded px-3 py-2 border border-red-500/30">
                    <p className="text-xs text-red-200">
                      <strong>Action:</strong> {alert.action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Warning Alerts */}
          {alerts.warnings?.map((alert, idx) => (
            <div
              key={`warning-${idx}`}
              className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
                      {alert.level}
                    </span>
                    <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                  <div className="bg-yellow-500/20 rounded px-3 py-2 border border-yellow-500/30">
                    <p className="text-xs text-yellow-200">
                      <strong>Action:</strong> {alert.action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Opportunity Alerts */}
          {alerts.opportunities?.map((alert, idx) => (
            <div
              key={`opportunity-${idx}`}
              className="bg-green-500/10 border border-green-500/50 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-green-500 text-black text-xs font-bold rounded">
                      {alert.level}
                    </span>
                    <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                  <div className="bg-green-500/20 rounded px-3 py-2 border border-green-500/30">
                    <p className="text-xs text-green-200">
                      <strong>Action:</strong> {alert.action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealTimeAlertsPanel;
