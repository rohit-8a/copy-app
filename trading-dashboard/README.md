# Trading Dashboard

Full-stack crypto/stock trading dashboard: React + Tailwind frontend,
FastAPI backend, TradingView Lightweight Charts, CCXT / Alpha Vantage /
Polygon.io market data, and an AI layer for indicators + sentiment.

```
trading-dashboard/
├── backend/                  FastAPI app
│   ├── app/
│   │   ├── main.py           App entry point, CORS, router mounting
│   │   ├── core/config.py    Settings — loads all API keys from .env
│   │   ├── routers/          market.py (REST), ai.py (REST), ws.py (WebSocket)
│   │   └── services/         market_data.py (CCXT/AlphaVantage/Polygon),
│   │                         ai_analysis.py (indicators + OpenAI sentiment)
│   ├── requirements.txt
│   └── .env.example          <-- COPY TO .env AND PUT YOUR KEYS HERE
│
└── frontend/                  React + Vite + Tailwind
    ├── src/
    │   ├── App.jsx             Page layout
    │   ├── components/         CandlestickChart, ControlBar, StatsPanel
    │   ├── hooks/useOhlcv.js    Data fetching hook
    │   └── lib/api.js          Backend API client
    ├── package.json
    └── .env.example            <-- COPY TO .env (only backend URL, no secrets)
```

## Where your API keys go

**All secret keys live in ONE place: `backend/.env`.**

```bash
cd backend
cp .env.example .env
# now open backend/.env and paste your real keys in:
```

```
BINANCE_API_KEY=...
BINANCE_API_SECRET=...
COINBASE_API_KEY=...
COINBASE_API_SECRET=...
ALPHA_VANTAGE_API_KEY=...
POLYGON_API_KEY=...
OPENAI_API_KEY=...
```

- `backend/.env` is already in `.gitignore` — it will never be committed.
- Public market data (candles/OHLCV) works via CCXT **without any keys** —
  keys are only required for authenticated account actions, Alpha Vantage,
  Polygon, and OpenAI sentiment.
- The frontend never touches secret keys directly. It only knows the
  backend's URL, set in `frontend/.env` (`VITE_API_BASE_URL`). Every
  provider call is proxied through FastAPI so keys never reach the browser.

## Running it locally

**Backend:**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in your keys
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`. The backend runs at `http://localhost:8000`
(docs at `http://localhost:8000/docs`).

## What's implemented vs. stubbed

- ✅ Live OHLCV candles via CCXT (Binance by default), rendered with
  TradingView Lightweight Charts
- ✅ Simple technical indicators (SMA-20, RSI-14, trend) computed server-side
- ✅ WebSocket endpoint (`/ws/price/{symbol}`) for streaming price updates
- ✅ REST endpoints for Alpha Vantage and Polygon.io (need their keys)
- ✅ OpenAI-based sentiment endpoint (`/api/ai/sentiment`, needs key)
- 🔲 PyTorch model — not included by default (heavy dependency); the
  `ai_analysis.py` service is structured so you can drop in a trained
  model/checkpoint in place of `compute_indicators`
- 🔲 Strategy backtesting engine — not implemented; `services/` is the
  place to add it
- 🔲 Order placement / authenticated trading — CCXT is wired for it but
  no order-execution endpoints are exposed yet (add deliberately, with care)
