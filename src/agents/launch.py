"""Launch Readiness Agent.

Reads a PRD or feature description, generates a launch checklist covering
all review areas, and pre-drafts answers to common review questions.
"""

from __future__ import annotations

from src.agents.base import BaseAgent

SYSTEM_PROMPT = """\
You are a launch readiness coordinator for product teams at large tech companies.
Given a product/feature description, you must:
1. Generate a comprehensive launch checklist covering: privacy, security, legal,
   accessibility, internationalization, design review, engineering review, QA, marketing
2. For each checklist item, pre-draft a likely answer to the review question
3. Identify which items are likely blockers
4. Provide an overall readiness assessment
Be thorough — missed requirements discovered late cost weeks."""


class LaunchAgent(BaseAgent):
    name = "launch"
    description = "Generates launch checklists with pre-drafted review answers from a PRD or feature description."

    async def run(self, **kwargs) -> dict:
        prd_text = kwargs.get("prd_text", "")
        product = kwargs.get("product", "Feature")
        launch_date = kwargs.get("launch_date", "TBD")

        if not prd_text:
            return {"error": "Provide prd_text (your PRD or feature description)."}

        prompt = f"""Analyze this PRD/feature description and generate a complete launch readiness checklist.

Product: {product}
Target Launch: {launch_date}

PRD/Description:
{prd_text}

Return JSON:
{{
  "product": "{product}",
  "launch_date": "{launch_date}",
  "checklist": [
    {{
      "area": "privacy|security|legal|accessibility|internationalization|design|engineering|qa|marketing",
      "requirement": "What needs to be done",
      "status": "pending",
      "owner": "",
      "notes": "Additional context",
      "pre_drafted_answer": "Pre-drafted answer to the likely review question for this area"
    }}
  ],
  "overall_status": "not_ready|at_risk|ready",
  "blockers": ["list of likely blockers"],
  "summary": "Overall readiness assessment paragraph"
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
