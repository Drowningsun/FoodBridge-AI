<div align="center">

# 🌿 FoodBridge AI

### AI-Powered Food Waste Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Connecting surplus food from restaurants, hotels, and events with NGOs and volunteers using AI. Predict leftovers, detect freshness, optimize delivery routes — saving meals and the planet.**

[Live Demo](#) · [API Docs](#) · [Report Bug](https://github.com/Drowningsun/FoodBridge-AI/issues)

</div>

---

## 🚀 Features

| Feature | Description |
|---------|------------|
| 🧠 **AI Leftover Prediction** | ML model predicts surplus food from events (guest count, weather, cuisine) |
| 📸 **Freshness Detection** | Computer vision analyzes food images for spoilage and safety scoring |
| 🤝 **Smart NGO Matching** | Weighted algorithm (distance, capacity, preferences) to find best NGO |
| 🗺️ **Route Optimization** | TSP + 2-opt algorithm minimizes delivery distance and fuel costs |
| 📊 **Impact Analytics** | Real-time dashboards tracking meals saved, CO₂ reduced, community impact |
| 🤖 **AI Chatbot** | Instant assistance for donation guidance and platform navigation |
| 👥 **Volunteer System** | Points, leaderboard, and assignment tracking for delivery volunteers |
| 🔔 **Smart Notifications** | Real-time alerts for matches, deliveries, and AI predictions |
| 🛡️ **Admin Dashboard** | Fraud detection, health monitoring, and system analytics |
| 🐳 **Docker Ready** | Full Docker Compose deployment with PostgreSQL, API, ML, and Web |

## 🏗️ Architecture

```
FoodBridge AI/
├── apps/
│   ├── api/              # FastAPI Backend (Python)
│   │   ├── core/         # Config, database, security, dependencies
│   │   ├── models/       # SQLAlchemy ORM models (13 tables)
│   │   ├── routers/      # API endpoints (auth, donations, matching, etc.)
│   │   └── schemas/      # Pydantic request/response models
│   ├── web/              # Next.js 15 Frontend (TypeScript)
│   │   ├── src/app/      # App Router pages (landing, auth, dashboard)
│   │   ├── src/components/ # Reusable UI components
│   │   ├── src/lib/      # API client, utilities
│   │   └── src/store/    # Zustand state management
│   └── ml-services/      # ML Microservice (Python)
│       └── app.py        # Prediction & spoilage detection APIs
├── docker/               # Dockerfiles (api, ml, web)
├── .github/workflows/    # CI/CD pipeline
└── docker-compose.yml    # Full-stack orchestration
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** — Async Python web framework
- **SQLAlchemy** — Async ORM with PostgreSQL
- **JWT** — Token-based authentication with refresh rotation
- **Pydantic** — Type-safe request/response validation
- **bcrypt** — Password hashing

### Frontend
- **Next.js 15** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **Recharts** — Data visualization
- **Zustand** — State management
- **TanStack Query** — Server state management

### ML Services
- **scikit-learn** — Machine learning models
- **NumPy** — Numerical computing
- **Pillow** — Image processing

### Infrastructure
- **PostgreSQL 16** — Primary database
- **Docker Compose** — Container orchestration
- **GitHub Actions** — CI/CD pipeline

## ⚡ Quick Start

### Prerequisites
- Node.js 22+
- Python 3.13+
- PostgreSQL 16+ (or Docker)

### 1. Clone & Install

```bash
git clone https://github.com/Drowningsun/FoodBridge-AI.git
cd FoodBridge-AI

# Frontend
cd apps/web && npm install

# Backend
cd ../api && pip install -r requirements.txt

# ML Services
cd ../ml-services && pip install -r requirements.txt
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database URL, JWT secret, etc.
```

### 3. Run Services

```bash
# Backend API (port 8000)
cd apps/api && uvicorn main:app --reload

# ML Services (port 8001)
cd apps/ml-services && uvicorn app:app --port 8001 --reload

# Frontend (port 3000)
cd apps/web && npm run dev
```

### Docker (Recommended)

```bash
docker compose up --build
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/donations` | List donations |
| POST | `/api/donations` | Create donation |
| POST | `/api/matching/find` | Find NGO matches |
| POST | `/api/routes/optimize` | Optimize delivery route |
| GET | `/api/analytics/dashboard` | Impact dashboard |
| POST | `/predict-leftover` | ML: Predict surplus |
| POST | `/detect-spoilage` | ML: Analyze food image |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ to fight food waste**

Made with [Next.js](https://nextjs.org) · [FastAPI](https://fastapi.tiangolo.com) · [PostgreSQL](https://postgresql.org)

</div>
