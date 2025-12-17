# HealthGuard AI

**HealthGuard AI** is an autonomous, agent‑driven system that validates healthcare provider credentials in real‑time. It combines:

- **Registry verification** against the Indian National Medical Commission (NMC) / MCI (simulated in the prototype).
- **Geolocation validation** using OpenStreetMap to ensure the provider’s address matches a real medical facility.
- **Trust scoring** (70 % registry, 30 % location) with critical‑failure logic that instantly rejects providers with invalid licenses.

## Features

- **FastAPI backend** with LangGraph agents for stateful, multi‑step validation.
- **React + Vite frontend** with a responsive dashboard, interactive map, and recommendation cards.
- **Real‑time UI feedback** (verified/flagged status, trust score, evidence logs).
- **Scalable architecture** – stateless services can be containerised and horizontally scaled.
- **Demo ready** – includes a script (`populate_ppt.py`) to generate the presentation PPT from markdown content.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Ayaan577/HealthGuard-AI.git
cd HealthGuard-AI

# Backend
cd prototype/backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd ../frontend
npm install
npm run dev   # runs on http://localhost:5173
```

Open the app, upload a provider’s registration number and department, and see the validation flow with map evidence and recommendations.

## License

MIT – feel free to adapt, extend, and integrate into healthcare compliance pipelines.
