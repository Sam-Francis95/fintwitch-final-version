import React from 'react';
import PathwayMetrics from '../components/PathwayMetrics';
import IntelligencePanel from '../components/IntelligencePanel';
import LLMInsightsPanel from '../components/LLMInsightsPanel';
import WindowedMetrics from '../components/WindowedMetrics';
import CategoryBreakdown from '../components/CategoryBreakdown';
import StreamingStatusPanel from '../components/StreamingStatusPanel';
import RealTimeAlertsPanel from '../components/RealTimeAlertsPanel';
import PredictiveInsightsPanel from '../components/PredictiveInsightsPanel';
import ExternalSignalsPanel from '../components/ExternalSignalsPanel';
import MultiSourceFusionPanel from '../components/MultiSourceFusionPanel';
import { Activity, Brain, TrendingUp, Zap, Layers, Globe } from 'lucide-react';

export default function PathwayDashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-heading uppercase tracking-tighter drop-shadow-sm mb-4">
                    Pathway Intelligence
                </h1>
                <p className="text-lg text-slate-400 mb-2">
                    Multi-Source Real-Time Financial Intelligence • Predictive Analytics • AI-Powered Insights
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-purple-400" />
                        Live Streaming
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Layers className="w-4 h-4 text-pink-400" />
                        Multi-Source Fusion
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        LLM-Powered
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4 text-green-400" />
                        External Signals
                    </span>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Streaming Status - Prominent */}
            <StreamingStatusPanel />

            {/* Real-Time Alerts - High Priority */}
            <RealTimeAlertsPanel />

            {/* Core Metrics */}
            <PathwayMetrics />

            {/* Enhanced Analytics Row: Predictive + External Signals + Fusion */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PredictiveInsightsPanel />
                <ExternalSignalsPanel />
                <MultiSourceFusionPanel />
            </div>

            {/* Two-Column Layout: Intelligence + LLM Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IntelligencePanel />
                <LLMInsightsPanel />
            </div>

            {/* Two-Column Layout: Windowed Metrics + Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WindowedMetrics />
                <CategoryBreakdown />
            </div>

            {/* Architecture & Features Info */}
            <div className="bg-slate-900/30 rounded-2xl p-8 border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="text-purple-400" />
                    Pathway-Centric Architecture
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h4 className="text-lg font-semibold text-purple-400 mb-3">Streaming Features</h4>
                        <div className="space-y-2 text-slate-300">
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Multi-Source Ingestion:</strong> User transactions + external signals</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Advanced Transformations:</strong> Velocity, trends, anomaly detection</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Predictive Analytics:</strong> Balance depletion, spending projections</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Multi-Source Fusion:</strong> Combined risk analysis</span>
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold text-pink-400 mb-3">Intelligence Layer</h4>
                        <div className="space-y-2 text-slate-300">
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Real-Time Alerts:</strong> Critical warnings & opportunities</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>External Signals:</strong> Market sentiment & economic indicators</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Data Fusion:</strong> Multi-stream risk assessment</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>LLM from Analytics:</strong> AI insights from processed data</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
                    <div className="text-sm text-slate-300">
                        <strong className="text-purple-400">Enhanced Data Flow:</strong> 
                        <div className="mt-2 font-mono text-xs bg-black/30 p-3 rounded">
                            [User Transactions] + [External Signals (Market/Economic)] → 
                            <span className="text-purple-400 font-bold"> Pathway Multi-Source Pipeline </span> 
                            → Advanced Transformations → Predictive Analytics → Data Fusion → LLM Analysis → Real-Time Dashboard
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                        All computations happen in <strong className="text-purple-400">Pathway streaming layer</strong> with 
                        multi-source data fusion. Demonstrates continuous ingestion, transformations, predictions, and real-time decision assistance.
                    </div>
                </div>
            </div>

            {/* API Endpoints Reference */}
            <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Enhanced API Endpoints</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm font-mono">
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-green-400">POST</span> /ingest
                        <p className="text-xs text-slate-400 mt-1">Ingest transactions</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /metrics
                        <p className="text-xs text-slate-400 mt-1">Core financial metrics</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /metrics/advanced
                        <p className="text-xs text-slate-400 mt-1">Advanced analytics</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /metrics/predictions
                        <p className="text-xs text-slate-400 mt-1">Predictive insights</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /metrics/fusion
                        <p className="text-xs text-slate-400 mt-1">Multi-source fusion</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /external-signals
                        <p className="text-xs text-slate-400 mt-1">External data signals</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /alerts
                        <p className="text-xs text-slate-400 mt-1">Real-time alerts</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /intelligence
                        <p className="text-xs text-slate-400 mt-1">Financial intelligence</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /insights/llm
                        <p className="text-xs text-slate-400 mt-1">LLM-powered insights</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /status
                        <p className="text-xs text-slate-400 mt-1">Streaming status</p>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <a 
                        href="http://localhost:8000/docs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline text-sm"
                    >
                        → View Interactive API Documentation
                    </a>
                </div>
            </div>
        </div>
    );
}
