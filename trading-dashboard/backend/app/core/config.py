"""
Central configuration. Loads every API key and setting from the
.env file (see .env.example for the template) so no secret is
ever hardcoded in source.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Exchange keys (CCXT) ---
    binance_api_key: str = ""
    binance_api_secret: str = ""
    coinbase_api_key: str = ""
    coinbase_api_secret: str = ""

    # --- Market data providers ---
    alpha_vantage_api_key: str = ""
    polygon_api_key: str = ""

    # --- AI / sentiment ---
    openai_api_key: str = ""

    # --- App ---
    environment: str = "development"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",          # <-- put your real keys in backend/.env
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
