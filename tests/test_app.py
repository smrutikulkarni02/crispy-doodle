import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)


def test_health():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["agents"] == 9


def test_list_agents():
    resp = client.get("/api/agents")
    assert resp.status_code == 200
    agents = resp.json()["agents"]
    assert len(agents) == 9
    names = {a["name"] for a in agents}
    assert "feedback" in names
    assert "status" in names
    assert "prd" in names
    assert "analytics" in names
    assert "meeting" in names
    assert "onboarding" in names
    assert "prioritization" in names
    assert "competitor" in names
    assert "launch" in names


def test_dashboard():
    resp = client.get("/")
    assert resp.status_code == 200
    assert b"PM" in resp.content
