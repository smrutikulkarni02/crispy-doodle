# PM Copilot

AI-powered toolkit that resolves 9 product manager pain points, built for PMs at large tech companies.

## Agents

| # | Agent | What It Does |
|---|-------|-------------|
| 1 | **Feedback Intelligence** | Synthesizes App Store/Play Store reviews, Reddit threads, and support tickets into themes with trends and spike detection |
| 2 | **Status Reports** | Generates weekly updates for different audiences (team vs. VP) from project data |
| 3 | **Launch Readiness** | Generates launch checklists from PRDs with pre-drafted answers to review questions |
| 4 | **Analytics** | Translates plain-English questions into SQL with explanations and caveats |
| 5 | **PRD Co-pilot** | Interviews PMs, drafts PRDs, and critiques them for gaps |
| 6 | **Competitor Watch** | Monitors competitor activity and generates digests with strategic impact analysis |
| 7 | **Meeting Actions** | Extracts decisions, action items with owners, and follow-ups from transcripts |
| 8 | **Onboarding Q&A** | RAG-powered Q&A over team documents for ramping up new PMs |
| 9 | **Prioritization** | RICE scoring, dependency mapping, and trade-off analysis for feature requests |

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your Anthropic API key

# Run the server
python -m uvicorn src.app:app --reload

# Open http://localhost:8000 in your browser
```

## Architecture

```
src/
  agents/         # 9 specialized agents, each with its own system prompt
  integrations/   # App Store, Reddit, LLM client
  storage/        # SQLite database + TF-IDF vector store for RAG
  scheduler/      # APScheduler for recurring jobs
  models/         # Pydantic schemas
  app.py          # FastAPI application
frontend/
  index.html      # Single-page dashboard
```

## API Endpoints

All agents are exposed as REST endpoints:

- `POST /api/feedback/analyze` — Analyze user reviews
- `POST /api/status/generate` — Generate status reports
- `POST /api/launch/check` — Check launch readiness
- `POST /api/analytics/query` — Ask data questions
- `POST /api/prd/draft` — Draft a PRD
- `POST /api/prd/interview` — Get structured interview questions
- `POST /api/prd/critique` — Critique an existing PRD
- `POST /api/competitor/analyze` — Analyze competitor updates
- `POST /api/meeting/process` — Process meeting transcripts
- `POST /api/onboarding/ask` — Ask questions about team docs
- `POST /api/onboarding/upload` — Upload team documents
- `POST /api/prioritization/score` — Score and prioritize features

## Tech Stack

- **Backend**: Python, FastAPI, SQLite
- **LLM**: Anthropic Claude API
- **RAG**: TF-IDF vector store (scikit-learn)
- **Scheduling**: APScheduler
- **Frontend**: Vanilla HTML/CSS/JS (no build step)
- **Integrations**: App Store RSS, Reddit JSON API, extensible to Jira/Slack/GitHub

## Running Tests

```bash
pip install pytest
pytest tests/ -v
```
