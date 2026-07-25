from fastapi import APIRouter, HTTPException

from app.services.market_data import market_data_service
from app.services.ai_analysis import compute_indicators

router = APIRouter(prefix="/api/market", tags=["market"])


@router.get("/ohlcv")
async def get_ohlcv(
    symbol: str = "BTC/USDT",
    timeframe: str = "1h",
    limit: int = 200,
    exchange: str = "kraken",
):
    try:
        candles = await market_data_service.get_ohlcv(symbol, timeframe, limit, exchange)
        closes = [c["close"] for c in candles]
        indicators = compute_indicators(closes)
        return {"symbol": symbol, "candles": candles, "indicators": indicators}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/alpha-vantage/daily")
async def alpha_vantage_daily(symbol: str):
    try:
        return await market_data_service.get_alpha_vantage_daily(symbol)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/polygon/aggregates")
async def polygon_aggregates(ticker: str, from_date: str, to_date: str, timespan: str = "day"):
    try:
        return await market_data_service.get_polygon_aggregates(
            ticker, from_date, to_date, timespan
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=str(exc)) from exc
