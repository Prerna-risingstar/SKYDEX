from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1.endpoints import index_api, routes_api, airlines_api, observations_api, quality_api, export_api

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="1.0.0",
    description="Real-time Airfare Price Index for India (APIx) REST API"
)

# CORS middleware for Next.js / Vite React frontend compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router registration
app.include_router(index_api.router, prefix=f"{settings.API_V1_STR}/index", tags=["Index Calculation"])
app.include_router(routes_api.router, prefix=f"{settings.API_V1_STR}/routes", tags=["Routes Basket"])
app.include_router(airlines_api.router, prefix=f"{settings.API_V1_STR}/airlines", tags=["Airlines"])
app.include_router(observations_api.router, prefix=f"{settings.API_V1_STR}/observations", tags=["Observations"])
app.include_router(quality_api.router, prefix=f"{settings.API_V1_STR}/quality", tags=["Data Quality"])
app.include_router(export_api.router, prefix=f"{settings.API_V1_STR}/export", tags=["Data Export"])

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
