LIVE LINK - https://skydex-mu.vercel.app/


# Real-time Airfare Price Index for India (APIx)

APIx is an automated, high-frequency price observation and statistical indexing platform designed to monitor, clean, and compute airfare price indices across representative domestic flight routes in India.

## Key Features

- **Route Basket Management**: Tracks representative domestic Indian air routes (DEL-BOM, DEL-BLR, BOM-BLR, DEL-CCU, BLR-HYD, MAA-DEL, etc.) with customizable CPI-compatible route weights.
- **Advance-Purchase Windows**: Tracks fare quotations across multiple lead times: `T+1`, `T+7`, `T+15`, `T+30`, and `T+45` days.
- **Multi-Source Collection**: Architected for direct airline collection (IndiGo, Air India, Air India Express, Akasa Air, SpiceJet) and OTAs (MakeMyTrip, EaseMyTrip, Yatra).
- **Ethical & Compliant Data Engine**: Enforces `robots.txt` rules, rate limits, exponential backoff, and non-circumvention.
- **Data Quality & Cleaning Pipeline**: Includes schema validation, component separation (Base Fare + Taxes + Fees = Total Fare), missing value differentiation, deduplication, IQR/MAD outlier detection, and 0-100 quality scoring.
- **Statistical Index Engine**: Aggregates fares using median prices and calculates Laspeyres-weighted national composite index ($APIx_t = \sum w_i I_{i,t}$) across daily, weekly, and monthly frequencies.
- **FastAPI REST API**: Provides structured endpoints for live and historical indices, route trends, airline price comparisons, raw observation exports (CSV/JSON), and data quality metrics.
- **Interactive Web Dashboard**: React/Vite dashboard featuring interactive price trend charts, route heatmaps, lead-time elasticity curves, airline breakdown matrices, and methodology documentation.

## Architecture Overview

```text
Sources (Airlines & OTAs) ──► Data Acquisition (Playwright / Generator)
                                          │
                                          ▼
                                   Raw Observations
                                          │
                                          ▼
                         Validation, Cleaning & Outlier Engine
                                          │
                                          ▼
                                PostgreSQL / SQLite DB
                                          │
                                          ▼
                             Statistical Index Engine
                                          │
                                          ▼
                             FastAPI REST API Service
                                          │
                                          ▼
                            React Dashboard (Next.js/Vite)
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Populate database with historical airfare data & initialize baseline indices
python seed_data.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Dashboard will be available at: `http://localhost:5173`

### 3. Running with Docker Compose

```bash
docker-compose up --build
```

## Statistical Methodology Summary

1. **Price Relative**:
   $$R_{i,t} = \frac{P_{i,t}}{P_{i,0}}$$
   where $P_{i,t}$ is the median fare for route $i$ at date $t$, and $P_{i,0}$ is the base-period price.

2. **Route Index**:
   $$I_{i,t} = R_{i,t} \times 100$$

3. **Composite National Airfare Index (APIx)**:
   $$APIx_t = \sum_{i=1}^{n} w_i I_{i,t}$$
   where $\sum w_i = 1.0$.

## License
MIT License - Open Source Economic Research Tool
