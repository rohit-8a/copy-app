from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_analysis import analyze_sentiment

router = APIRouter(prefix="/api/ai", tags=["ai"])


class SentimentRequest(BaseModel):
    headlines: list[str]


@router.post("/sentiment")
async def sentiment(payload: SentimentRequest):
    try:
        return await analyze_sentiment(payload.headlines)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=str(exc)) from exc
