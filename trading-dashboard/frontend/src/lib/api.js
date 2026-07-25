// Backend base URL comes from frontend/.env (VITE_API_BASE_URL).
// Actual secret API keys (OpenAI, Polygon, Alpha Vantage, exchange
// secrets) are NEVER used here — they live only in backend/.env
// and are used server-side by FastAPI.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`${res.status}: ${detail}`)
  }
  return res.json()
}

export const api = {
  health: () => request('/api/health'),
  ohlcv: ({ symbol = 'BTC/USDT', timeframe = '1h', limit = 200, exchange = 'binance' } = {}) =>
    request(
      `/api/market/ohlcv?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}&limit=${limit}&exchange=${exchange}`
    ),
  sentiment: (headlines) =>
    request('/api/ai/sentiment', {
      method: 'POST',
      body: JSON.stringify({ headlines }),
    }),
}
