"""Prioritization Assistant.

Gathers feature requests, estimates reach and impact, scores them with RICE,
and shows trade-offs.
"""

from __future__ import annotations
import json
import hashlib

from src.agents.base import BaseAgent
from src.models.schemas import FeatureRequest, RICEScore
from src.storage.database import save_feature_request, get_feature_requests

SYSTEM_PROMPT = """\
You are a prioritization assistant for product managers.
You help score and rank feature requests using the RICE framework:
- Reach: How many users will this impact per quarter?
- Impact: How much will it impact each user? (0.25=minimal, 0.5=low, 1=medium, 2=high, 3=massive)
- Confidence: How confident are you in these estimates? (0.0-1.0)
- Effort: How many person-weeks will this take?
- Score = (Reach × Impact × Confidence) / Effort

You must also:
1. Identify dependencies between features
2. Flag trade-offs (e.g., "doing A delays B")
3. Consider strategic alignment, not just score
4. Challenge inflated estimates
5. Support the PM's judgment — scores inform, they don't decide"""


class PrioritizationAgent(BaseAgent):
    name = "prioritization"
    description = "Scores feature requests with RICE, identifies dependencies and trade-offs."

    async def run(self, **kwargs) -> dict:
        features = kwargs.get("features", [])
        context = kwargs.get("context", "")
        team_capacity = kwargs.get("team_capacity", "")

        if isinstance(features, str):
            return await self._from_text(features, context, team_capacity)

        if not features:
            stored = get_feature_requests()
            if stored:
                features = stored
            else:
                return {"error": "Provide features (list of feature requests) or text."}

        features_text = json.dumps(features, indent=2, default=str)

        prompt = f"""Score and prioritize these feature requests using RICE.

Features:
{features_text}

{"Team Context: " + context if context else ""}
{"Team Capacity: " + team_capacity if team_capacity else ""}

Return JSON:
{{
  "features": [
    {{
      "id": "feature id or generated",
      "title": "Feature title",
      "description": "Brief description",
      "source": "Where the request came from",
      "rice": {{
        "reach": 0,
        "impact": 0.0,
        "confidence": 0.0,
        "effort": 0.0,
        "score": 0.0
      }},
      "tags": ["tag1"],
      "dependencies": ["ids of features this depends on"],
      "rationale": "Why this score"
    }}
  ],
  "trade_offs": ["Trade-off analysis"],
  "recommendation": "Overall prioritization recommendation paragraph",
  "suggested_roadmap": [
    {{
      "phase": "Now / Next / Later",
      "features": ["feature ids"],
      "rationale": "Why this sequencing"
    }}
  ]
}}"""

        result = await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)

        for f in result.get("features", []):
            fid = f.get("id") or hashlib.sha256(f["title"].encode()).hexdigest()[:10]
            f["id"] = fid
            save_feature_request(f)

        return result

    async def _from_text(self, text: str, context: str, team_capacity: str) -> dict:
        prompt = f"""Parse these feature requests and score them with RICE.

Feature requests (raw text):
{text}

{"Team Context: " + context if context else ""}
{"Team Capacity: " + team_capacity if team_capacity else ""}

First extract each distinct feature request, then score each with RICE.

Return JSON:
{{
  "features": [
    {{
      "id": "generated-id",
      "title": "Feature title",
      "description": "Extracted description",
      "source": "text_input",
      "rice": {{
        "reach": 0,
        "impact": 0.0,
        "confidence": 0.0,
        "effort": 0.0,
        "score": 0.0
      }},
      "tags": [],
      "dependencies": [],
      "rationale": "Why this score"
    }}
  ],
  "trade_offs": [],
  "recommendation": "Overall prioritization recommendation"
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
