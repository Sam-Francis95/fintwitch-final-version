import React from 'react';
import PathwayMetrics from '../components/PathwayMetrics';
import IntelligencePanel from '../components/IntelligencePanel';
import LLMInsightsPanel from '../components/LLMInsightsPanel';
import WindowedMetrics from '../components/WindowedMetrics';
import CategoryBreakdown from '../components/CategoryBreakdown';
import { Activity, Brain, TrendingUp, Zap } from 'lucide-react';

export default function PathwayDashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-heading uppercase tracking-tighter drop-shadow-sm mb-4">
                    Pathway Intelligence
                </h1>
                <p className="text-lg text-slate-400 mb-2">
                    Real-Time Financial Intelligence • AI-Powered Insights • Streaming Analytics
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-purple-400" />
                        Live Streaming
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Brain className="w-4 h-4 text-pink-400" />
                        LLM-Powered
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-blue-400" />
                        Time-Windowed
                    </span>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Core Metrics */}
            <PathwayMetrics />

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
                                <span><strong>Unbounded Event Stream:</strong> Continuous data ingestion</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Real-Time Transformations:</strong> Running totals, aggregations</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Time Windows:</strong> Last 1-60 minute rolling analytics</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Category Aggregations:</strong> Grouped by transaction type</span>
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold text-pink-400 mb-3">Intelligence Layer</h4>
                        <div className="space-y-2 text-slate-300">
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Overspending Detection:</strong> Real-time expense monitoring</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Balance Alerts:</strong> Low balance & negative warnings</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>Risk Scoring:</strong> Dynamic financial health assessment</span>
                            </p>
                            <p className="flex items-start gap-2 text-sm">
                                <span className="text-green-400">✓</span>
                                <span><strong>LLM Insights:</strong> Natural language recommendations</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
                    <div className="text-sm text-slate-300">
                        <strong className="text-purple-400">Data Flow:</strong> 
                        <div className="mt-2 font-mono text-xs bg-black/30 p-3 rounded">
                            Game Action → Event Generator (Flask:5000) → 
                            <span className="text-purple-400 font-bold"> Pathway Streaming (FastAPI:8000) </span> 
                            → Real-Time Computation → Intelligence Layer → LLM Analysis → Frontend Updates
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                        All computations happen in <strong className="text-purple-400">Pathway streaming layer</strong> - 
                        FastAPI acts only as ingestion and serving interface. This demonstrates true streaming analytics.
                    </div>
                </div>
            </div>

            {/* API Endpoints Reference */}
            <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Available API Endpoints</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-mono">
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-green-400">POST</span> /ingest
                        <p className="text-xs text-slate-400 mt-1">Ingest transactions</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /metrics
                        <p className="text-xs text-slate-400 mt-1">Core financial metrics</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /metrics/categories
                        <p className="text-xs text-slate-400 mt-1">Category breakdown</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /metrics/windowed
                        <p className="text-xs text-slate-400 mt-1">Time-windowed analytics</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /intelligence
                        <p className="text-xs text-slate-400 mt-1">Financial intelligence & alerts</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-slate-700">
                        <span className="text-blue-400">GET</span> /insights/llm
                        <p className="text-xs text-slate-400 mt-1">LLM-powered insights</p>
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
