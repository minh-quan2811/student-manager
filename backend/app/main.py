from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import api_router
from app.database import engine, Base
from app.seeds import seed_database

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed database with test data
# seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url="/docs",  # Changed from openapi_url
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {"message": "Research Platform API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}