"""
Market data service.

- CCXT: live + historical crypto OHLCV from exchanges (Binance, Coinbase, etc.)
- Alpha Vantage: stocks / forex historical data
- Polygon.io: stocks / options / crypto aggregates

All provider calls read their keys from app.core.config.settings,
which in turn reads them from backend/.env (see .env.example).
"""
from __future__ import annotations

import ccxt
import httpx

from app.core.config import settings


class MarketDataService:
    def __init__(self) -> None:
        # Public market data does not require API keys on most exchanges.
        # Keys are only wired in for authenticated/account-level calls.
        self._exchanges: dict[str, ccxt.Exchange] = {}

    def _get_exchange(self, exchange_id: str) -> ccxt.Exchange:
        if exchange_id not in self._exchanges:
            exchange_class = getattr(ccxt, exchange_id)
            config = {"enableRateLimit": True}

            if exchange_id == "binance" and settings.binance_api_key:
                config["apiKey"] = settings.binance_api_key
                config["secret"] = settings.binance_api_secret
            elif exchange_id == "coinbase" and settings.coinbase_api_key:
                config["apiKey"] = settings.coinbase_api_key
                config["secret"] = settings.coinbase_api_secret

            self._exchanges[exchange_id] = exchange_class(config)
        return self._exchanges[exchange_id]

    async def get_ohlcv(
        self,
        symbol: str = "BTC/USDT",
        timeframe: str = "1h",
        limit: int = 200,
        exchange_id: str = "binance",
    ) -> list[dict]:
        """Fetch OHLCV candles for charting (Lightweight Charts format)."""
        exchange = self._get_exchange(exchange_id)
        raw = exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
        return [
            {
                "time": row[0] // 1000,  # seconds, for TradingView Lightweight Charts
                "open": row[1],
                "high": row[2],
                "low": row[3],
                "close": row[4],
                "volume": row[5],
            }
            for row in raw
        ]

    async def get_alpha_vantage_daily(self, symbol: str) -> dict:
        if not settings.alpha_vantage_api_key:
            raise ValueError(
                "ALPHA_VANTAGE_API_KEY is not set — add it to backend/.env"
            )
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "apikey": settings.alpha_vantage_api_key,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=15)
            resp.raise_for_status()
            return resp.json()

    async def get_polygon_aggregates(
        self, ticker: str, from_date: str, to_date: str, timespan: str = "day"
    ) -> dict:
        if not settings.polygon_api_key:
            raise ValueError("POLYGON_API_KEY is not set — add it to backend/.env")
        url = (
            f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/"
            f"{timespan}/{from_date}/{to_date}"
        )
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                url, params={"apiKey": settings.polygon_api_key}, timeout=15
            )
            resp.raise_for_status()
            return resp.json()


market_data_service = MarketDataService()
