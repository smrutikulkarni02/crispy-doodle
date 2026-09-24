"""PRD Co-pilot Agent.

Interviews the PM with structured questions, drafts the PRD, then
critiques it from a skeptical reviewer's perspective.
"""

from __future__ import annotations

from src.agents.base import BaseAgent

SYSTEM_PROMPT = """\
You are a PRD (Product Requirements Document) co-pilot for product managers.
You help write thorough, well-structured PRDs and then critique them.
Your critique should be from the perspective of a skeptical senior PM or engineering lead
who has seen launches fail due to missing requirements.

A good PRD covers:
- Problem statement and user pain
- Goals and success metrics (including counter-metrics)
- User stories and use cases
- Functional requirements
- Non-functional requirements (performance, scale, reliability)
- Edge cases and error states
- Offline/degraded behavior
- Privacy and security considerations
- Dependencies and risks
- Launch plan and rollout strategy
- Open questions"""


class PRDAgent(BaseAgent):
    name = "prd"
    description = "Drafts PRDs from structured input and critiques them for gaps, missing metrics, and edge cases."

    async def run(self, **kwargs) -> dict:
        mode = kwargs.get("mode", "draft")
        if mode == "interview":
            return await self._interview(kwargs)
        elif mode == "critique":
            return await self._critique(kwargs)
        else:
            return await self._draft(kwargs)

    async def _interview(self, kwargs: dict) -> dict:
        context = kwargs.get("context", "")
        prompt = f"""Based on this initial context, generate a structured interview to help a PM write a complete PRD.

Context: {context}

Return JSON:
{{
  "questions": [
    {{
      "category": "problem|goals|users|requirements|edge_cases|risks|launch",
      "question": "The question to ask the PM",
      "why": "Why this question matters",
      "example_answer": "Example of a good answer"
    }}
  ]
}}"""
        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)

    async def _draft(self, kwargs: dict) -> dict:
        title = kwargs.get("title", "Untitled Feature")
        description = kwargs.get("description", "")
        answers = kwargs.get("answers", {})

        answers_text = ""
        if answers:
            answers_text = "\n".join(f"Q: {k}\nA: {v}" for k, v in answers.items())

        prompt = f"""Draft a complete PRD for this feature.

Title: {title}
Description: {description}

{"Interview Answers:" + chr(10) + answers_text if answers_text else ""}

Return JSON:
{{
  "title": "{title}",
  "sections": [
    {{
      "title": "Section title",
      "content": "Section content in markdown"
    }}
  ],
  "overall_critique": "",
  "missing_elements": []
}}"""

        result = await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)

        critique = await self._critique({"prd_text": self._sections_to_text(result.get("sections", []))})
        result["overall_critique"] = critique.get("overall_critique", "")
        result["missing_elements"] = critique.get("missing_elements", [])
        result["critique_details"] = critique.get("section_critiques", [])
        return result

    async def _critique(self, kwargs: dict) -> dict:
        prd_text = kwargs.get("prd_text", "")
        if not prd_text:
            return {"error": "Provide prd_text to critique."}

        prompt = f"""Critique this PRD as a skeptical senior PM/engineering lead who has seen launches fail.

PRD:
{prd_text}

Ask hard questions. Look for:
- Missing success/counter-metrics
- Unaddressed edge cases
- Offline/degraded behavior not covered
- Security/privacy gaps
- Unclear requirements that engineering will interpret differently
- Missing rollout/rollback plan

Return JSON:
{{
  "overall_critique": "Overall assessment paragraph",
  "missing_elements": ["list of missing things"],
  "section_critiques": [
    {{
      "section": "Which section",
      "issues": ["specific issue"],
      "questions": ["hard questions to ask"]
    }}
  ],
  "score": 0-100,
  "verdict": "ready|needs_work|major_gaps"
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)

    @staticmethod
    def _sections_to_text(sections: list[dict]) -> str:
        return "\n\n".join(f"## {s['title']}\n{s['content']}" for s in sections)
