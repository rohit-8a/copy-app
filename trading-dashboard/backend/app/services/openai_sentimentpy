"""
OpenAI-powered sentiment analysis service.

This is a STANDALONE file so it's easy to find, replace, or swap
providers later. It reads the API key from settings, which in turn
reads it from backend/.env (OPENAI_API_KEY).

Nothing in this file needs editing to use it — just make sure
OPENAI_API_KEY is set as a Railway variable on the BACKEND service.
"""
from __future__ import annotations

import json

from openai import OpenAI

from app.core.config import settings


class SentimentResult:
    def __init__(self, sentiment: str, confidence: float, summary: str):
        self.sentiment = sentiment
        self.confidence = confidence
        self.summary = summary

    def to_dict(self) -> dict:
        return {
            "sentiment": self.sentiment,
            "confidence": self.confidence,
            "summary": self.summary,
        }


async def get_sentiment(headlines: list[str]) -> dict:
    """
    Given a list of news headlines, ask OpenAI to classify overall
    market sentiment. Returns a clean dict — never a raw string —
    so the frontend can render it directly.
    """
    if not settings.openai_api_key:
        raise ValueError(
            "OPENAI_API_KEY is not set. Add it as a Variable on the "
            "backend service in Railway (Variables tab)."
        )

    if not headlines:
        raise ValueError("Provide at least one headline to analyze.")

    client = OpenAI(api_key=settings.openai_api_key)
    joined = "\n".join(f"- {h}" for h in headlines)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a market sentiment classifier. Respond ONLY "
                    "with valid JSON in this exact shape, no other text: "
                    '{"sentiment": "bullish|bearish|neutral", '
                    '"confidence": 0.0-1.0, "summary": "one short sentence"}'
                ),
            },
            {"role": "user", "content": f"Headlines:\n{joined}"},
        ],
        max_tokens=200,
        temperature=0.2,
    )

    raw_text = response.choices[0].message.content.strip()

    # Be defensive: strip markdown code fences if the model adds them
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.lower().startswith("json"):
            raw_text = raw_text[4:].strip()

    try:
        parsed = json.loads(raw_text)
        result = SentimentResult(
            sentiment=parsed.get("sentiment", "neutral"),
            confidence=float(parsed.get("confidence", 0.5)),
            summary=parsed.get("summary", ""),
        )
        return result.to_dict()
    except (json.JSONDecodeError, ValueError, TypeError):
        # Fallback: return the raw text so nothing is silently lost
        return {"sentiment": "unknown", "confidence": 0.0, "summary": raw_text}
