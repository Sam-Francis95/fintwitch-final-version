# Budget Allocation System for FinTwitch

## Overview
The Budget Allocation System transforms FinTwitch into a real-time financial intelligence simulator where users manage financial strategy through category-based budget buckets.

## Key Features

### 1. Budget Buckets (Category Pools)
Four protected budget categories:
- **Living Expenses** (🏠): Rent, groceries, utilities, transport
- **Emergency Fund** (🚨): Unexpected costs, medical expenses
- **Investments** (📈): Stocks, assets, growth opportunities
- **Savings / Goals** (🎯): Long-term savings and financial goals

### 2. Income Allocation
- Manual allocation of income across buckets
- Pre-configured allocation strategies:
  - **Balanced (50/20/15/15)**: Traditional approach
  - **Aggressive (40/20/25/15)**: Growth-focused
  - **Conservative (40/35/15/10)**: Safety-first
  - **Growth (35/15/40/10)**: Maximum investment
- Visual sliders for custom allocation
- Real-time validation and remaining balance tracking

### 3. Automatic Expense Handling
- Intelligent category mapping for automatic expenses
- Automatic bucket selection based on expense type
- Deficit tracking when bucket is insufficient
- Real-time bucket balance updates
- Seamless integration with simulation events

### 4. Transaction History
All financial events stored with:
- Transaction type (income/expense)
- Category and bucket information
- Amount and timestamp
- Resulting bucket balance
- Deficit information (if applicable)

### 5. Financial Metrics Engine
Real-time computation of:
- Total balance across all buckets
- Total income (lifetime)
- Total expenses (lifetime)
- Net cash flow
- Bucket distribution percentages
- Individual bucket health status

### 6. Risk & Alert System
Intelligent warnings for:
- Emergency fund low (< ₹5,000)
- Living expenses low (< ₹3,000)
- Negative cash flow
- Bucket depletion
- High financial risk (< ₹2,000 total)
- Severity levels: Low, Medium, High, Critical

## Architecture

### Backend (Flask)
**File**: `backend/budget_system.py`
**Port**: 5001

#### Endpoints:
```
POST   /budget/init              - Initialize user budget
POST   /budget/allocate          - Allocate income to buckets
POST   /budget/expense           - Process expense from bucket
GET    /budget/buckets/<user_id> - Get current bucket balances
GET    /budget/metrics/<user_id> - Get financial metrics
GET    /budget/alerts/<user_id>  - Get risk alerts
GET    /budget/transactions/<user_id> - Get transaction history
GET    /budget/status            - Health check
```

#### Data Structure:
```python
{
    "user_id": "user123",
    "buckets": {
        "living_expenses": 20000,
        "emergency_fund": 10000,
        "investments": 15000,
        "savings": 5000
    },
    "transactions": [...],
    "metrics": {
        "total_income": 50000,
        "total_expenses": 15000,
        "net_cash_flow": 35000
    },
    "alerts": [...]
}
```

### Frontend (React)

#### Store
**File**: `src/store/useBudgetStore.js`
- Zustand-based state management
- Auto-sync with backend every 10 seconds
- Actions: initializeBudget, allocateIncome, processExpense, syncAll

#### Components

1. **BudgetAllocator** (`src/components/BudgetAllocator.jsx`)
   - Income allocation interface
   - Preset strategies
   - Visual sliders
   - Real-time validation

2. **BudgetDashboard** (`src/components/BudgetDashboard.jsx`)
   - Metrics overview cards
   - Bucket balance visualization
   - Distribution chart
   - Health indicators

3. **BudgetAlerts** (`src/components/BudgetAlerts.jsx`)
   - Alert list with severity badges
   - Dismissible notifications
   - Color-coded warnings

4. **BudgetArea** (`src/pages/BudgetArea.jsx`)
   - Main page integrating all components
   - Manual income allocation
   - Transaction history viewer
   - Auto-refresh functionality

### Integration

#### UserContext Integration
The budget system automatically integrates with the existing transaction system:

```javascript
// In transact() function
if (amount >= 0) {
    sendIncomeToBudgetSystem(username, amount, category);
} else {
    sendExpenseToBudgetSystem(username, Math.abs(amount), category);
}
```

This ensures:
- All income is automatically allocated using balanced strategy
- All expenses are deducted from appropriate buckets
- Both systems stay synchronized
- Seamless simulation experience

## Usage

### Starting the System

#### Option 1: Individual Services
```bash
# Terminal 1: Event Generator (Port 5000)
python backend/financial_event_generator.py

# Terminal 2: Budget System (Port 5001)
python backend/budget_system.py

# Terminal 3: Frontend (Port 5173)
npm run dev
```

#### Option 2: Batch Script (Windows)
```bash
start_budget_system.bat
```

### Using the Budget System

1. **Login** to your FinTwitch account
2. **Navigate** to "Budget Vault" from the left menu
3. **Allocate Income**:
   - Click "Allocate Income"
   - Enter income amount
   - Choose preset or customize allocation
   - Submit
4. **Monitor** your buckets and metrics in real-time
5. **Review Alerts** for financial warnings
6. **View History** to track all budget transactions

### Simulation Behavior

The system automatically:
- Receives income from simulation events
- Auto-allocates using balanced strategy (customizable)
- Deducts expenses from appropriate buckets
- Generates alerts when buckets run low
- Tracks all activity in transaction history

## Category Mapping

The system intelligently maps expense categories to buckets:

| Expense Category | Bucket |
|-----------------|--------|
| Rent, Groceries, Utilities, Transport, Subscription, Entertainment | Living Expenses |
| Emergency, Medical, Health | Emergency Fund |
| Investment, Stock, Asset | Investments |
| Savings, Goal | Savings |

## Customization

### Changing Allocation Strategy
Users can customize their allocation strategy by:
1. Using preset buttons (Balanced, Aggressive, Conservative, Growth)
2. Manually adjusting sliders for each bucket
3. Mixing presets with manual adjustments

### Risk Thresholds
Modify in `backend/budget_system.py`:
```python
RISK_THRESHOLDS = {
    "emergency_fund_low": 5000,
    "living_expenses_low": 3000,
    "high_risk_balance": 2000
}
```

## Technical Details

### Dependencies
Backend:
- Flask
- Flask-CORS

Frontend:
- Zustand (state management)
- Framer Motion (animations)
- Lucide React (icons)

### State Management
- Backend: In-memory storage (upgrade to database for production)
- Frontend: Zustand with auto-sync
- Persistence: Firebase for user data

### Error Handling
- Graceful degradation if budget system is unavailable
- Silent failures for optional features
- User-friendly error messages
- Console logging for debugging

## Future Enhancements

1. **Custom Budget Categories**: Allow users to create their own buckets
2. **Budget Goals**: Set target amounts for each bucket
3. **Historical Charts**: Visualize bucket changes over time
4. **Budget Templates**: Save and reuse allocation strategies
5. **Export Reports**: Download budget reports as PDF/CSV
6. **Predictive Alerts**: AI-based predictions of future shortfalls
7. **Automatic Rebalancing**: Auto-adjust allocations based on patterns
8. **Multi-Currency Support**: Handle different currencies
9. **Family Budgets**: Shared budget management
10. **Gamification**: Rewards for good budget management

## Troubleshooting

### Budget System Not Connected
**Symptoms**: No budget updates, alerts not showing
**Solution**: 
1. Ensure budget_system.py is running on port 5001
2. Check console for connection errors
3. Verify CORS is enabled

### Transactions Not Syncing
**Symptoms**: Buckets not updating with transactions
**Solution**:
1. Check if budget system is initialized for user
2. Verify user is logged in
3. Check browser console for errors
4. Manually refresh using "Refresh" button

### Missing Alerts
**Symptoms**: No warnings despite low buckets
**Solution**:
1. Alerts are generated by backend - ensure it's running
2. Check alert thresholds in budget_system.py
3. Manually trigger sync with "Refresh" button

## API Examples

### Initialize Budget
```javascript
POST http://localhost:5001/budget/init
Content-Type: application/json

{
  "user_id": "user123"
}
```

### Allocate Income
```javascript
POST http://localhost:5001/budget/allocate
Content-Type: application/json

{
  "user_id": "user123",
  "income_amount": 50000,
  "allocations": {
    "living_expenses": 20000,
    "emergency_fund": 10000,
    "investments": 15000,
    "savings": 5000
  },
  "description": "Salary March 2026"
}
```

### Process Expense
```javascript
POST http://localhost:5001/budget/expense
Content-Type: application/json

{
  "user_id": "user123",
  "amount": 1500,
  "category": "Rent",
  "description": "Monthly rent payment"
}
```

## License
Part of FinTwitch - Financial Life Simulation Platform

## Support
For issues or questions, check the browser console and backend logs for detailed error messages.
