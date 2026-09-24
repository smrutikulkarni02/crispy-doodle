"""Status Report Agent.

Collects updates from engineering, design, and cross-functional sources,
then drafts status updates tailored to different audiences.
"""

from __future__ import annotations
import json

from src.agents.base import BaseAgent
from src.models.schemas import StatusItem, StatusReport, StatusSource

SYSTEM_PROMPT = """\
You are a status report writer for product managers at large tech companies.
Given a set of work items and updates, you must:
1. Identify blockers and risks
2. Highlight key accomplishments
3. Write TWO versions of the status update:
   - Detailed: for the immediate team, with specifics on each item
   - Executive: 3-5 bullet points for a VP/director, focusing on outcomes and risks
4. Flag any items that slipped from their target dates
5. Be concise and action-oriented"""


class StatusAgent(BaseAgent):
    name = "status"
    description = "Generates weekly status reports from project data, tailored for different audiences."

    async def run(self, **kwargs) -> dict:
        team = kwargs.get("team", "Product Team")
        period = kwargs.get("period", "This Week")
        items = kwargs.get("items", [])
        raw_updates = kwargs.get("raw_updates", "")

        if raw_updates and not items:
            return await self._from_raw_text(team, period, raw_updates)

        if not items:
            return {"error": "Provide items (list of status updates) or raw_updates (text)."}

        items_text = "\n".join(
            f"- [{item.get('source', 'manual')}] {item.get('title', '')} — Status: {item.get('status', 'unknown')}"
            + (f" — Owner: {item['owner']}" if item.get("owner") else "")
            + (f" — BLOCKER: {item['notes']}" if item.get("is_blocker") else "")
            for item in items
        )

        prompt = f"""Generate a status report for team "{team}" for "{period}".

Work items:
{items_text}

Return JSON:
{{
  "team": "{team}",
  "period": "{period}",
  "blockers": [
    {{"source": "...", "title": "...", "status": "...", "owner": "...", "notes": "..."}}
  ],
  "highlights": ["highlight1", "highlight2"],
  "report_detailed": "Full detailed report in markdown",
  "report_executive": "3-5 bullet executive summary"
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)

    async def _from_raw_text(self, team: str, period: str, text: str) -> dict:
        prompt = f"""Parse these raw project updates and generate a status report for team "{team}" ({period}).

Raw updates:
{text}

Return JSON:
{{
  "team": "{team}",
  "period": "{period}",
  "items": [
    {{"source": "manual", "title": "...", "status": "...", "owner": "...", "is_blocker": false, "notes": ""}}
  ],
  "blockers": [],
  "highlights": [],
  "report_detailed": "Full detailed report in markdown",
  "report_executive": "3-5 bullet executive summary"
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
