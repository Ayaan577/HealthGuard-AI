from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB or models if needed
    print("HealthGuard AI Backend Started")
    yield
    # Shutdown
    print("Shutting down")

app = FastAPI(title="HealthGuard AI", lifespan=lifespan)

# CORS
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel
from agents import validation_agent

class ProviderRequest(BaseModel):
    name: str
    reg_no: str
    address: str
    department: str | None = None

@app.get("/")
def read_root():
    return {"status": "HealthGuard AI Backend Online", "docs_url": "/docs"}

@app.post("/validate")
async def validate_provider(request: ProviderRequest):
    initial_state = {
        "provider_name": request.name,
        "reg_no": request.reg_no,
        "address": request.address,
        "validation_results": [],
        "final_trust_score": 0.0,
        "status": "PENDING"
    }
    
    # Run the agent
    result = validation_agent.invoke(initial_state)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
