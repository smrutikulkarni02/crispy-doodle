"""Feedback Intelligence Agent.

Pulls reviews from public sources, clusters them into themes, tracks trends,
and flags sudden spikes.
"""

from __future__ import annotations
import hashlib
import json
from datetime import datetime

from src.agents.base import BaseAgent
from src.models.schemas import FeedbackItem, FeedbackReport, FeedbackTheme
from src.storage.database import save_feedback_items, get_feedback_items, save_report

SYSTEM_PROMPT = """\
You are a feedback intelligence analyst for product managers.
You receive user reviews/feedback and must:
1. Cluster them into themes (e.g., "app crashes after update", "slow loading", "great new feature")
2. Assign sentiment (positive, negative, neutral, mixed)
3. Track severity (low, medium, high, critical)
4. Identify spikes — themes with sudden increases in volume
5. Provide sample quotes for each theme
6. Write a concise executive summary

Be specific and data-driven. Quote real text. Don't invent issues not in the data."""


class FeedbackAgent(BaseAgent):
    name = "feedback"
    description = "Synthesizes user feedback from reviews, support tickets, and forums into actionable themes and trends."

    async def run(self, **kwargs) -> dict:
        product = kwargs.get("product", "")
        reviews = kwargs.get("reviews", [])
        source = kwargs.get("source", "manual")

        if isinstance(reviews, str):
            reviews = [{"text": r.strip(), "source": source} for r in reviews.split("\n") if r.strip()]

        if reviews:
            items = []
            for i, r in enumerate(reviews):
                text = r if isinstance(r, str) else r.get("text", "")
                item_id = hashlib.sha256(text.encode()).hexdigest()[:12]
                items.append({
                    "id": item_id,
                    "source": r.get("source", source) if isinstance(r, dict) else source,
                    "text": text,
                    "rating": r.get("rating") if isinstance(r, dict) else None,
                    "author": r.get("author", "") if isinstance(r, dict) else "",
                    "date": r.get("date", datetime.utcnow().isoformat()) if isinstance(r, dict) else datetime.utcnow().isoformat(),
                    "url": r.get("url", "") if isinstance(r, dict) else "",
                    "app_version": r.get("app_version", "") if isinstance(r, dict) else "",
                })
            save_feedback_items(items, product)

        stored = get_feedback_items(product)
        all_reviews = stored if stored else [{"text": r if isinstance(r, str) else r.get("text", ""), "source": source} for r in reviews]

        if not all_reviews:
            return {"error": "No reviews provided. Pass reviews as a list or load from a product."}

        review_text = "\n---\n".join(
            f"[{r.get('source', 'unknown')}] (rating: {r.get('rating', 'N/A')}) {r.get('text', '')}"
            for r in all_reviews[:200]
        )

        prompt = f"""Analyze these {len(all_reviews)} user reviews for "{product}":

{review_text}

Return JSON with this structure:
{{
  "product": "{product}",
  "period": "analysis period",
  "total_reviews": {len(all_reviews)},
  "themes": [
    {{
      "name": "theme name",
      "description": "what this theme covers",
      "sentiment": "positive|negative|neutral|mixed",
      "count": 0,
      "trend": "rising|falling|stable|spike",
      "sample_quotes": ["quote1", "quote2"],
      "severity": "low|medium|high|critical"
    }}
  ],
  "spikes": [],
  "summary": "executive summary paragraph"
}}"""

        result = await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
        save_report("feedback_reports", result)
        return result

    async def analyze_text(self, text: str, product: str = "Unknown") -> dict:
        reviews = [line.strip() for line in text.split("\n") if line.strip()]
        return await self.run(product=product, reviews=reviews, source="pasted")
