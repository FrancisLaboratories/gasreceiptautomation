from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    oidc_issuer: str = os.getenv("OIDC_ISSUER", None)
    oidc_audience: str = os.getenv("OIDC_AUDIENCE", None)
    oidc_algorithms: str = os.getenv("OIDC_ALGORITHMS", "RS256")


@lru_cache()
def get_settings():
    return Settings()