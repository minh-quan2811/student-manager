from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # API
    API_V1_PREFIX: str
    PROJECT_NAME: str
    
    # CORS
    BACKEND_CORS_ORIGINS: list
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()