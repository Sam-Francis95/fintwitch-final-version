/**
 * Mock data for Pathway streaming engine panels
 * Used automatically when the Pathway backend (localhost:8000) is not running
 * This enables the dashboard to display demo data on any machine
 */

export const MOCK_STATUS = {
  status: "demo",
  engine: "Pathway Streaming Engine (Demo Mode)",
  uptime: 3847,
  events_processed: 1284,
  stream_active: true,
  processing_rate: 42.3,
  total_transactions: 47,
  last_update: new Date().toISOString()
};

export const MOCK_METRICS = {
  balance: 28450.75,
  total_income: 52000.00,
  total_expenses: 23549.25,
  net_cash_flow: 28450.75,
  transaction_count: 47,
  risk: "LOW"
};

export const MOCK_CATEGORIES = {
  categories: [
    {
      category: "Living Expenses",
      total_income: 0,
      total_expenses: 11200.50,
      transaction_count: 18,
    },
    {
      category: "Investments",
      total_income: 0,
      total_expenses: 7800.00,
      transaction_count: 6,
    },
    {
      category: "Savings",
      total_income: 0,
      total_expenses: 4548.75,
      transaction_count: 9,
    },
    {
      category: "Emergency Fund",
      total_income: 0,
      total_expenses: 0,
      transaction_count: 0,
    },
    {
      category: "Salary",
      total_income: 45000.00,
      total_expenses: 0,
      transaction_count: 3,
    },
    {
      category: "Freelance",
      total_income: 7000.00,
      total_expenses: 0,
      transaction_count: 11,
    }
  ]
};

export const MOCK_INTELLIGENCE = {
  patterns: [
    {
      type: "spending_spike",
      message: "Living expenses increased 18% compared to last month",
      severity: "medium",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      type: "savings_milestone",
      message: "Savings rate at 54.7% — above your 50% target",
      severity: "positive",
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      type: "investment_opportunity",
      message: "Consistent surplus detected — consider increasing SIP allocation",
      severity: "info",
      timestamp: new Date(Date.now() - 10800000).toISOString()
    },
    {
      type: "anomaly",
      message: "Unusually high entertainment spend on weekends",
      severity: "low",
      timestamp: new Date(Date.now() - 14400000).toISOString()
    }
  ]
};

export const MOCK_LLM_INSIGHTS = {
  insights: [
    {
      title: "Strong Savings Velocity",
      content: "Your current savings rate of 54.7% is well above the recommended 20%. At this pace, you will accumulate ₹3.4L in additional savings over the next 6 months.",
      category: "savings",
      confidence: 0.92
    },
    {
      title: "Investment Diversification Suggested",
      content: "Your portfolio is currently weighted 67% in a single asset class. Consider distributing ₹2,000/month into index funds to reduce concentration risk.",
      category: "investment",
      confidence: 0.87
    },
    {
      title: "Emergency Fund Status",
      content: "Your emergency fund covers 4.2 months of expenses. Financial advisors recommend 6 months. A monthly top-up of ₹1,800 will get you there in 4 months.",
      category: "risk",
      confidence: 0.95
    }
  ],
  generated_at: new Date().toISOString(),
  model: "Demo Mode"
};

export const MOCK_WINDOWED = {
  window_minutes: 60,
  income: 4500.00,
  expenses: 1820.50,
  transactions: 8,
  net: 2679.50,
  avg_transaction: 777.56
};

export const MOCK_ALERTS = {
  triggered_at: new Date().toISOString(),
  critical: [],
  warnings: [
    {
      level: "WARNING",
      title: "Spending Pace",
      message: "Living expenses at 72% of monthly budget with 12 days remaining",
      action: "Review discretionary spending and defer non-essential purchases"
    }
  ],
  opportunities: [
    {
      level: "OPPORTUNITY",
      title: "Savings Goal Progress",
      message: "Home down payment goal is 68% funded — projected completion in 8 months",
      action: "Consider increasing monthly SIP by ₹500 to reach goal 3 weeks earlier"
    },
    {
      level: "OPPORTUNITY",
      title: "Strong Surplus Detected",
      message: "Net cash flow positive by ₹28,450 this month — above your usual average",
      action: "Allocate surplus to Emergency Fund to reach 6-month coverage target"
    }
  ]
};

export const MOCK_EXTERNAL_SIGNALS = {
  market_sentiment: 0.62,
  market_volatility: 0.28,
  interest_rate: 6.5,
  inflation_rate: 4.9,
  impact_on_spending: 0.15,
  recent_events: [
    {
      category: "rbi_policy",
      time: new Date(Date.now() - 86400000).toISOString(),
      description: "RBI holds repo rate at 6.5% — stable borrowing conditions for consumers"
    },
    {
      category: "inflation",
      time: new Date(Date.now() - 172800000).toISOString(),
      description: "CPI at 4.9% — slightly above RBI's 4% target; monitor grocery/fuel spend"
    },
    {
      category: "market",
      time: new Date(Date.now() - 43200000).toISOString(),
      description: "NIFTY 50 up 1.2% this week — equity-linked investments outperforming benchmark"
    }
  ]
};

export const MOCK_FUSION = {
  overall_financial_risk: 22,
  market_adjusted_health: 76,
  risk_breakdown: {
    user_spending_risk: 18.5,
    market_risk_multiplier: 1.08,
    economic_factors_risk: 4
  },
  recommended_action: "maintain_current_habits"
};

export const MOCK_PREDICTIONS = {
  burn_rate_per_day: 762.5,
  days_until_zero_balance: null,
  projected_monthly_deficit: 0,
  projected_monthly_surplus: 28450,
  recommended_daily_budget: 900,
  risk_escalation_warning: false
};

export const MOCK_ADVANCED = {
  trend: "stable",
  spending_pattern: "stable",
  spending_velocity: 0.53,
  volatility_index: 12.4,
  spending_consistency: 0.84,
  income_stability: 0.91,
  financial_health_score: 78,
  months_of_runway: 4.2,
  anomaly_detected: false,
  recent_anomalies: []
};
