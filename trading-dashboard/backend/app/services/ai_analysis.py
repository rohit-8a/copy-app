"""
AI / logic layer.

- Pattern recognition on OHLCV series (simple technical rules here;
  swap in a PyTorch model checkpoint if/when you train one).
- Sentiment analysis via OpenAI API (reads key from settings).
"""
from __future__ import annotations

import numpy as np
from openai import OpenAI

from app.core.config import settings


def compute_indicators(closes: list[float]) -> dict:
    """Simple, dependency-light technical indicators (no torch required)."""
    arr = np.array(closes, dtype=float)
    if len(arr) < 20:
        return {"sma_20": None, "rsi_14": None, "trend": "insufficient_data"}

    sma_20 = float(arr[-20:].mean())

    deltas = np.diff(arr[-15:])
    gains = deltas[deltas > 0].sum()
    losses = -deltas[deltas < 0].sum()
    rs = gains / losses if losses != 0 else float("inf")
    rsi_14 = 100 - (100 / (1 + rs)) if losses != 0 else 100.0

    trend = "bullish" if arr[-1] > sma_20 else "bearish"

    return {"sma_20": round(sma_20, 2), "rsi_14": round(rsi_14, 2), "trend": trend}


async def analyze_sentiment(headlines: list[str]) -> dict:
    """Summarize market sentiment from a list of news headlines via OpenAI."""
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is not set — add it to backend/.env")

    client = OpenAI(api_key=settings.openai_api_key)
    joined = "\n".join(f"- {h}" for h in headlines)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a market sentiment classifier. Respond ONLY with "
                    "JSON: {\"sentiment\": \"bullish|bearish|neutral\", "
                    "\"confidence\": 0-1, \"summary\": \"one sentence\"}"
                ),
            },
            {"role": "user", "content": f"Headlines:\n{joined}"},
        ],
        max_tokens=200,
    )
    return {"raw": response.choices[0].message.content}
