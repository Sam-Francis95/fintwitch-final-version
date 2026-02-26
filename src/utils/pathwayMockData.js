/**
 * Mock data for Pathway streaming engine components.
 * Used automatically when the Pathway backend (localhost:8000) is offline,
 * so organizers and evaluators can see realistic demo data without needing
 * WSL / Docker / Linux.
 */

// ─── StreamingStatusPanel ─────────────────────────────────────────────────────
export const MOCK_STATUS = {
  events_processed: 1284,
  total_transactions: 47,
  uptime: 3720, // seconds (~1 hour)
};

// ─── PathwayMetrics ───────────────────────────────────────────────────────────
export const MOCK_METRICS = {
  balance: 28450,
  total_income: 52000,
  total_expenses: 23550,
  net_cash_flow: 28450,
  transaction_count: 47,
  risk: 'LOW',
};

// ─── CategoryBreakdown ────────────────────────────────────────────────────────
export const MOCK_CATEGORIES = {
  categories: [
    { category: 'Food & Dining',     total_income: 0,     total_expenses: 6200,  transaction_count: 12 },
    { category: 'Transport',         total_income: 0,     total_expenses: 3100,  transaction_count: 8  },
    { category: 'Shopping',          total_income: 0,     total_expenses: 4800,  transaction_count: 6  },
    { category: 'Entertainment',     total_income: 0,     total_expenses: 1800,  transaction_count: 5  },
    { category: 'Utilities',         total_income: 0,     total_expenses: 2400,  transaction_count: 4  },
    { category: 'Healthcare',        total_income: 0,     total_expenses: 950,   transaction_count: 2  },
    { category: 'Salary',            total_income: 45000, total_expenses: 0,     transaction_count: 1  },
    { category: 'Freelance',         total_income: 7000,  total_expenses: 0,     transaction_count: 3  },
    { category: 'Investments',       total_income: 0,     total_expenses: 4300,  transaction_count: 2  },
  ],
};

// ─── IntelligencePanel ────────────────────────────────────────────────────────
export const MOCK_INTELLIGENCE = {
  risk_level: 'MEDIUM',
  financial_health_score: 72.4,
  alerts: [],
  warnings: [
    'Shopping spend is 18% above your monthly average.',
    'Entertainment budget will exceed limit in ~4 days at current rate.',
  ],
  insights: [
    'You saved ₹4,450 more this month compared to last month.',
    'Food & Dining is your largest expense category at ₹6,200.',
    'Freelance income added ₹7,000 — a 15.5% boost to total income.',
  ],
  recommendations: [
    'Consider setting a ₹3,500 cap on shopping to stay within budget.',
    'Automate ₹5,000/month into a recurring SIP for long-term growth.',
    'Your savings rate is 54.7% — excellent! Aim to keep it above 50%.',
  ],
  risk_factors: {
    high_shopping_spend: true,
    entertainment_budget_at_risk: true,
  },
};

// ─── LLMInsightsPanel ─────────────────────────────────────────────────────────
export const MOCK_LLM_INSIGHTS = {
  confidence: 0.88,
  summary:
    'Your financial health is good overall. You are earning ₹52,000 this month with controlled spending at ₹23,550. Savings rate stands at 54.7%, which is well above the recommended 20%. However, discretionary spending on shopping has spiked this week.',
  risk_explanation:
    'Your risk level is MEDIUM primarily due to above-average shopping expenditure and entertainment costs trending upward. No critical debt signals detected. Market volatility is moderate, which could slightly increase cost-of-living expenses over the next 30 days.',
  recommendations: [
    'Reduce discretionary shopping by ₹1,300 to bring risk back to LOW.',
    'Consider moving ₹10,000 of idle savings into a liquid mutual fund.',
    'Review your subscriptions — you may have unused recurring charges.',
    'Build a 3-month emergency fund of ₹70,000 if not already in place.',
  ],
  generated_at: new Date(Date.now() - 180000).toISOString(),
  model: 'gemini-1.5-flash (demo)',
};

// ─── WindowedMetrics ──────────────────────────────────────────────────────────
export const MOCK_WINDOWED = {
  window_minutes: 5,
  recent_income: 0,
  recent_expenses: 340,
  recent_transactions: 2,
  avg_transaction_amount: 170,
  period_summary: '2 transactions totalling ₹340 in the last window',
};

// ─── RealTimeAlertsPanel ──────────────────────────────────────────────────────
export const MOCK_ALERTS = {
  triggered_at: new Date(Date.now() - 60000).toISOString(),
  critical: [],
  warnings: [
    {
      level: 'WARNING',
      title: 'Shopping Budget 82% Used',
      message: 'You have spent ₹4,800 of your ₹5,850 shopping budget with 9 days remaining.',
      action: 'Pause non-essential purchases until end of month.',
    },
    {
      level: 'WARNING',
      title: 'Evening Spending Spike',
      message: 'Transactions between 8 PM–11 PM account for 38% of total expenses.',
      action: 'Review late-evening impulse purchases — use the 24-hour rule.',
    },
  ],
  opportunities: [
    {
      level: 'OPPORTUNITY',
      title: 'Invest Surplus ₹5,000',
      message: 'You have an idle surplus of ₹5,000 in your savings bucket this month.',
      action: 'Park in a short-term liquid fund for ~6.5% annualised return.',
    },
    {
      level: 'OPPORTUNITY',
      title: 'Zero Entertainment Cost Days',
      message: 'You had 12 zero-entertainment-spend days this month — great discipline!',
      action: 'Keep the streak going to hit your savings milestone early.',
    },
  ],
};

// ─── ExternalSignalsPanel ─────────────────────────────────────────────────────
export const MOCK_EXTERNAL_SIGNALS = {
  market_sentiment: 0.63,
  market_volatility: 0.38,
  interest_rate: 6.5,
  inflation_rate: 4.8,
  impact_on_spending: 0.12,
  recent_events: [
    {
      category: 'monetary policy',
      time: new Date(Date.now() - 7200000).toISOString(),
      description: 'RBI holds repo rate at 6.5% — EMI costs remain stable for borrowers.',
    },
    {
      category: 'markets',
      time: new Date(Date.now() - 14400000).toISOString(),
      description: 'Nifty 50 rises 0.8% on strong Q3 earnings from IT sector.',
    },
    {
      category: 'inflation',
      time: new Date(Date.now() - 21600000).toISOString(),
      description: 'CPI inflation eases to 4.8% in January — food prices cooling.',
    },
    {
      category: 'economy',
      time: new Date(Date.now() - 36000000).toISOString(),
      description: 'India GDP growth forecast revised up to 7.2% for FY2025-26.',
    },
    {
      category: 'fuel',
      time: new Date(Date.now() - 50400000).toISOString(),
      description: 'Petrol prices unchanged for 10th consecutive week — positive for transport budgets.',
    },
  ],
};

// ─── MultiSourceFusionPanel ───────────────────────────────────────────────────
export const MOCK_FUSION = {
  overall_financial_risk: 34,
  market_adjusted_health: 68,
  risk_breakdown: {
    user_spending_risk: 28.5,
    market_risk_multiplier: 1.12,
    economic_factors_risk: 6,
  },
  recommended_action: 'monitor_closely',
};

// ─── PredictiveInsightsPanel ──────────────────────────────────────────────────
export const MOCK_PREDICTIONS = {
  burn_rate_per_day: 782,
  days_until_zero_balance: 36,
  projected_monthly_deficit: 0,
  projected_monthly_surplus: 8850,
  recommended_daily_budget: 650,
  risk_escalation_warning: false,
};

export const MOCK_ADVANCED = {
  trend: 'stable',
  spending_pattern: 'normal',
  spending_velocity: 5.43, // ₹ per minute
  anomaly_detected: false,
  recent_anomalies: [],
};
