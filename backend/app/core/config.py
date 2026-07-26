from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SecureReview AI"
    jwt_secret: str = Field(default="change-me-in-production", min_length=16)
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60
    max_upload_bytes: int = 25 * 1024 * 1024
    max_extracted_bytes: int = 80 * 1024 * 1024
    scanner_timeout_seconds: int = 180
    work_dir: Path = Path("/tmp/secure-review")
    semgrep_config: str = "p/security-audit,p/secrets,p/python,p/javascript,p/typescript,p/react"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.work_dir.mkdir(parents=True, exist_ok=True)
    return settings
