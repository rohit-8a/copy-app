"""Sentiment analysis via OpenAI API."""
from app.services.ai_analysis import analyze_sentiment


async def get_sentiment(headlines: list[str]) -> dict:
    """Get sentiment analysis for headlines."""
    return await analyze_sentiment(headlines)

