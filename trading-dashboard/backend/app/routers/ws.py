import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.market_data import market_data_service

router = APIRouter()


@router.websocket("/ws/price/{symbol}")
async def price_stream(websocket: WebSocket, symbol: str):
    """
    Simple polling-based WebSocket stream (CCXT REST under the hood).
    Swap for a native exchange WebSocket (e.g. ccxt.pro) for production.
    """
    await websocket.accept()
    pair = symbol.replace("-", "/")
    try:
        while True:
            candles = await market_data_service.get_ohlcv(pair, "1m", limit=1)
            if candles:
                await websocket.send_json({"symbol": pair, "candle": candles[-1]})
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        pass
