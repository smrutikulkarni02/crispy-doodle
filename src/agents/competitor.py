"""Competitor Watch Agent.

Monitors competitors' public information and generates weekly digests
with "so what for our product" analysis.
"""

from __future__ import annotations

from src.agents.base import BaseAgent

SYSTEM_PROMPT = """\
You are a competitive intelligence analyst for product managers.
Given information about competitors, you must:
1. Categorize each update (launch, pricing, feature, partnership, hiring, strategy)
2. Assess the impact on our product
3. Identify patterns and strategic shifts
4. Provide a "so what for our product" section with concrete recommended actions
5. Be objective and data-driven — don't overreact to minor moves

Focus on actionable intelligence, not just news summaries."""


class CompetitorAgent(BaseAgent):
    name = "competitor"
    description = "Monitors competitor activity and generates weekly digests with strategic impact analysis."

    async def run(self, **kwargs) -> dict:
        competitors = kwargs.get("competitors", [])
        updates = kwargs.get("updates", "")
        our_product = kwargs.get("our_product", "Our Product")

        if not updates and not competitors:
            return {"error": "Provide updates (text of competitor news) or competitors (list of competitor names to analyze)."}

        if not updates and competitors:
            return await self._generate_tracking_template(competitors, our_product)

        prompt = f"""Analyze these competitor updates for the "{our_product}" team.

Competitor Intelligence:
{updates}

Return JSON:
{{
  "period": "analysis period",
  "updates": [
    {{
      "competitor": "Competitor name",
      "title": "Update title",
      "category": "launch|pricing|feature|partnership|hiring|strategy",
      "summary": "What happened",
      "impact_analysis": "What this means for us"
    }}
  ],
  "key_takeaways": ["Strategic insight 1", "Strategic insight 2"],
  "recommended_actions": [
    "Concrete action our team should take"
  ],
  "threat_level": "low|medium|high",
  "opportunities": ["Opportunities this creates for us"]
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)

    async def _generate_tracking_template(self, competitors: list[str], our_product: str) -> dict:
        comp_list = ", ".join(competitors)
        prompt = f"""Create a competitor tracking framework for "{our_product}" monitoring: {comp_list}.

Return JSON:
{{
  "our_product": "{our_product}",
  "competitors": [
    {{
      "name": "Competitor",
      "key_areas_to_watch": ["area1", "area2"],
      "public_sources": ["where to find their updates"],
      "current_positioning": "Brief positioning summary"
    }}
  ],
  "tracking_dimensions": ["What to compare across all competitors"],
  "suggested_monitoring_schedule": "How often to check"
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
