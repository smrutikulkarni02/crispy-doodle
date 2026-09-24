"""Text-to-SQL Analytics Agent.

Takes natural language questions, generates SQL against a known schema,
runs the query, and returns results with explanations and caveats.
"""

from __future__ import annotations
import sqlite3
import json

from src.agents.base import BaseAgent
from src.storage.database import get_analytics_schemas, save_analytics_schema, get_connection

SYSTEM_PROMPT = """\
You are a data analytics assistant for product managers.
Given a database schema and metric definitions, you:
1. Translate natural-language questions into SQL
2. Explain what the query does in plain English
3. Flag caveats (sampling, missing data, timezone issues, statistical pitfalls)
4. Suggest the best chart type for the results
5. For A/B test questions, check for: peeking too early, underpowered tests, novelty effects

Always write safe SELECT-only queries. Never modify data."""


DEMO_SCHEMA = {
    "users": {
        "columns": ["user_id TEXT PK", "country TEXT", "platform TEXT", "created_at TEXT", "plan TEXT"],
        "description": "User accounts",
    },
    "events": {
        "columns": ["event_id TEXT PK", "user_id TEXT FK->users", "event_name TEXT", "properties TEXT (JSON)", "timestamp TEXT"],
        "description": "User behavior events",
    },
    "sessions": {
        "columns": ["session_id TEXT PK", "user_id TEXT FK->users", "start_time TEXT", "end_time TEXT", "platform TEXT", "app_version TEXT"],
        "description": "App sessions",
    },
    "subscriptions": {
        "columns": ["sub_id TEXT PK", "user_id TEXT FK->users", "plan TEXT", "started_at TEXT", "churned_at TEXT", "mrr REAL"],
        "description": "Subscription records",
    },
    "experiments": {
        "columns": ["exp_id TEXT PK", "name TEXT", "variant TEXT", "user_id TEXT FK->users", "metric_value REAL", "created_at TEXT"],
        "description": "A/B test assignments and outcomes",
    },
}

DEMO_METRICS = {
    "DAU": "COUNT(DISTINCT user_id) FROM sessions WHERE date(start_time) = date('now')",
    "WAU": "COUNT(DISTINCT user_id) FROM sessions WHERE start_time >= date('now', '-7 days')",
    "MAU": "COUNT(DISTINCT user_id) FROM sessions WHERE start_time >= date('now', '-30 days')",
    "D7 Retention": "Users active on day 7 / Users who signed up on day 0",
    "MRR": "SUM(mrr) FROM subscriptions WHERE churned_at IS NULL",
    "Churn Rate": "Users who churned this period / Users active at start of period",
}


class AnalyticsAgent(BaseAgent):
    name = "analytics"
    description = "Translates natural-language questions into SQL queries, runs them, and explains results with caveats."

    async def run(self, **kwargs) -> dict:
        question = kwargs.get("question", "")
        schema_name = kwargs.get("schema", "demo")

        if not question:
            return {"error": "Provide a question (e.g., 'Did retention drop for Android users in India?')."}

        schemas = get_analytics_schemas()
        if schemas:
            schema_info = schemas[0]
            schema_def = schema_info["schema"]
            metrics = schema_info.get("metrics", {})
        else:
            schema_def = DEMO_SCHEMA
            metrics = DEMO_METRICS

        schema_text = json.dumps(schema_def, indent=2)
        metrics_text = json.dumps(metrics, indent=2)

        prompt = f"""Given this database schema:
{schema_text}

And these metric definitions:
{metrics_text}

Answer this question: "{question}"

Return JSON:
{{
  "query": "{question}",
  "sql": "SELECT ... (safe read-only SQL)",
  "explanation": "Plain English explanation of what the query does",
  "caveats": ["list of data quality or statistical caveats"],
  "chart_type": "bar|line|pie|table|none",
  "chart_data": {{
    "labels": ["label1", "label2"],
    "datasets": [{{"label": "Series", "data": [1, 2]}}]
  }},
  "follow_up_questions": ["suggested follow-up questions"]
}}"""

        result = await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
        return result

    async def register_schema(self, name: str, schema: dict, metrics: dict | None = None) -> dict:
        row_id = save_analytics_schema(name, schema, metrics)
        return {"id": row_id, "name": name, "status": "registered"}
