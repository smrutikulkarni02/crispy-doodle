"""PM Copilot — FastAPI application.

Exposes all nine agents as REST endpoints plus a dashboard UI.
"""

from __future__ import annotations
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from src.storage.database import init_db
from src.scheduler.jobs import start_scheduler, stop_scheduler, list_jobs
from src.agents.feedback import FeedbackAgent
from src.agents.status import StatusAgent
from src.agents.launch import LaunchAgent
from src.agents.analytics import AnalyticsAgent
from src.agents.prd import PRDAgent
from src.agents.competitor import CompetitorAgent
from src.agents.meeting import MeetingAgent
from src.agents.onboarding import OnboardingAgent
from src.agents.prioritization import PrioritizationAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="PM Copilot",
    description="AI-powered toolkit resolving 9 product manager pain points",
    version="1.0.0",
    lifespan=lifespan,
)

FRONTEND_DIR = Path(__file__).parent.parent / "frontend"

# --- Agent instances ---
feedback_agent = FeedbackAgent()
status_agent = StatusAgent()
launch_agent = LaunchAgent()
analytics_agent = AnalyticsAgent()
prd_agent = PRDAgent()
competitor_agent = CompetitorAgent()
meeting_agent = MeetingAgent()
onboarding_agent = OnboardingAgent()
prioritization_agent = PrioritizationAgent()


# --- Health ---
@app.get("/api/health")
async def health():
    return {"status": "ok", "agents": 9}


@app.get("/api/agents")
async def list_agents():
    agents = [
        feedback_agent, status_agent, launch_agent, analytics_agent,
        prd_agent, competitor_agent, meeting_agent, onboarding_agent,
        prioritization_agent,
    ]
    return {"agents": [a.info() for a in agents]}


# --- 1. Feedback Intelligence ---
@app.post("/api/feedback/analyze")
async def analyze_feedback(request: Request):
    body = await request.json()
    return await feedback_agent.run(**body)


# --- 2. Status Report ---
@app.post("/api/status/generate")
async def generate_status(request: Request):
    body = await request.json()
    return await status_agent.run(**body)


# --- 3. Launch Readiness ---
@app.post("/api/launch/check")
async def check_launch(request: Request):
    body = await request.json()
    return await launch_agent.run(**body)


# --- 4. Analytics ---
@app.post("/api/analytics/query")
async def analytics_query(request: Request):
    body = await request.json()
    return await analytics_agent.run(**body)


@app.post("/api/analytics/schema")
async def register_schema(request: Request):
    body = await request.json()
    return await analytics_agent.register_schema(
        body.get("name", "custom"),
        body.get("schema", {}),
        body.get("metrics"),
    )


# --- 5. PRD Co-pilot ---
@app.post("/api/prd/interview")
async def prd_interview(request: Request):
    body = await request.json()
    body["mode"] = "interview"
    return await prd_agent.run(**body)


@app.post("/api/prd/draft")
async def prd_draft(request: Request):
    body = await request.json()
    body["mode"] = "draft"
    return await prd_agent.run(**body)


@app.post("/api/prd/critique")
async def prd_critique(request: Request):
    body = await request.json()
    body["mode"] = "critique"
    return await prd_agent.run(**body)


# --- 6. Competitor Watch ---
@app.post("/api/competitor/analyze")
async def analyze_competitor(request: Request):
    body = await request.json()
    return await competitor_agent.run(**body)


# --- 7. Meeting to Action ---
@app.post("/api/meeting/process")
async def process_meeting(request: Request):
    body = await request.json()
    return await meeting_agent.run(**body)


# --- 8. Onboarding ---
@app.post("/api/onboarding/ask")
async def onboarding_ask(request: Request):
    body = await request.json()
    return await onboarding_agent.run(**body)


@app.post("/api/onboarding/upload")
async def onboarding_upload(request: Request):
    body = await request.json()
    return await onboarding_agent.run(**body)


# --- 9. Prioritization ---
@app.post("/api/prioritization/score")
async def prioritize(request: Request):
    body = await request.json()
    return await prioritization_agent.run(**body)


# --- Scheduler ---
@app.get("/api/scheduler/jobs")
async def get_jobs():
    return {"jobs": list_jobs()}


# --- Frontend ---
@app.get("/", response_class=HTMLResponse)
async def dashboard():
    index_path = FRONTEND_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return HTMLResponse("<h1>PM Copilot</h1><p>Frontend not found.</p>")
