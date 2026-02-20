# 🚀 Quick Start Guide - Pathway Streaming Integration

## What Was Added

✅ **Pathway Real-Time Streaming Engine** - Core analytics engine processing transactions as an unbounded stream
✅ **FastAPI Backend** - Modern API layer for event ingestion and metrics exposure  
✅ **React Dashboard** - Live metrics display updating every 2 seconds
✅ **Auto Event Forwarding** - Every transaction automatically flows to Pathway
✅ **Zero-Config Integration** - Works seamlessly with existing FinTwitch backend

## Installation (One-Time Setup)

```bash
cd backend
pip install -r requirements.txt
```

This installs: `pathway`, `fastapi`, `uvicorn`, `pydantic`, `requests`

## Starting the System

### Option 1: Complete System (Recommended)
```batch
Start_With_Analytics.bat
```

Wait for 4 terminal windows to open:
1. **Pathway Streaming** (Port 8000) - Core engine
2. **Event Generator** (Port 5000) - Creates transactions
3. **Budget System** (Port 5001) - Budget allocation
4. **Frontend** (Port 3000) - React UI

### Option 2: Pathway Only (Testing)
```batch
cd backend
start_pathway_streaming.bat
```

## Viewing Real-Time Metrics

1. Open http://localhost:3000
2. Click **"Pathway Analytics"** in left sidebar
3. Watch metrics update live as transactions occur

## How It Works

```
Event Generated → Forwarded to Pathway → Stream Processing → 
  → Metrics Computed → Frontend Polls → UI Updates
```

Every transaction flows through Pathway's streaming engine where:
- **Balance** = Income - Expenses
- **Risk Level** = HIGH if Expenses > Income, else LOW
- **Cash Flow** = Net balance change
- All computed in real-time, automatically

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| http://localhost:8000/ingest | POST | Ingest transaction event |
| http://localhost:8000/metrics | GET | Get computed metrics |
| http://localhost:8000/status | GET | Check engine status |
| http://localhost:8000/docs | GET | Interactive API docs |

## Testing

### Quick Test
1. Start system: `Start_With_Analytics.bat`
2. Open API docs: http://localhost:8000/docs
3. Try `/ingest` endpoint with sample data
4. Check `/metrics` - values should update instantly

### Live Test
1. Play the game normally
2. Keep Pathway Analytics page open
3. Watch metrics update every 5 seconds as events occur

## Verification Checklist

- [ ] 4 terminal windows running
- [ ] No error messages in terminals
- [ ] http://localhost:8000 shows welcome message
- [ ] http://localhost:8000/docs opens interactive docs
- [ ] http://localhost:3000/pathway shows live metrics
- [ ] Metrics update when transactions occur

## Troubleshooting

**"Pathway unavailable"**
→ Run: `backend\start_pathway_streaming.bat`

**Import errors**
→ Run: `pip install pathway fastapi uvicorn`

**Metrics not updating**
→ Check Event Generator (port 5000) is running

**Port already in use**
→ Run: `Stop_All_Servers.bat` then restart

## What's Demonstrated

✅ **Unbounded Stream Processing** - Continuous event flow
✅ **Real-Time Transformations** - Instant metric computation  
✅ **Streaming Aggregations** - Sum, count, computed fields
✅ **Dynamic Logic** - Risk assessment based on expense ratios
✅ **FastAPI Integration** - Modern Python API framework
✅ **Zero-Latency Updates** - Metrics available immediately

## Files Created

```
backend/
  pathway_streaming.py          # Main Pathway engine
  start_pathway_streaming.bat   # Startup script
  requirements.txt              # Updated with new deps

src/
  components/PathwayMetrics.jsx # Live metrics component
  pages/PathwayDashboard.jsx    # Full analytics page
```

## Architecture Diagram

```
┌──────────────────────────────────────────────────┐
│  Frontend (React) - Port 3000                    │
│  • Polls /metrics every 2 seconds                │
│  • Displays live balance, income, expenses, risk │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│  Event Generator - Port 5000                     │
│  • Generates income/expense every 5 seconds      │
│  • Forwards all events to Pathway                │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│  PATHWAY STREAMING ENGINE - Port 8000            │
│  ═══════════════════════════════════════════════ │
│  • Ingests unbounded event stream                │
│  • Processes transactions in real-time           │
│  • Computes: Balance, Income, Expenses, Risk     │
│  • Exposes metrics via FastAPI                   │
└──────────────────────────────────────────────────┘
```

## Next Steps

1. ✅ Install dependencies: `pip install -r requirements.txt`
2. ✅ Start system: `Start_With_Analytics.bat`
3. ✅ Open Pathway Analytics: http://localhost:3000/pathway
4. ✅ Watch real-time metrics update

For detailed documentation, see full **PATHWAY_INTEGRATION.md**

---

**🌊 Powered by Pathway - Real-Time Data Processing Made Simple**
