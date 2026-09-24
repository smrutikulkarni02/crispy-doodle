"""Meeting-to-Action Agent.

Processes meeting transcripts, extracts decisions and action items with owners,
and generates follow-up tracking.
"""

from __future__ import annotations

from src.agents.base import BaseAgent

SYSTEM_PROMPT = """\
You are a meeting analyst for product managers.
Given a meeting transcript or notes, you must:
1. Extract every decision that was made (explicit and implicit)
2. Identify all action items with owners and due dates
3. Note key discussion points and unresolved questions
4. Write a concise summary suitable for sharing with absent stakeholders
5. Flag action items that have no clear owner — they will be dropped

Be precise about WHO owns WHAT. Vague action items are worthless."""


class MeetingAgent(BaseAgent):
    name = "meeting"
    description = "Extracts decisions, action items, and owners from meeting transcripts and notes."

    async def run(self, **kwargs) -> dict:
        transcript = kwargs.get("transcript", "")
        title = kwargs.get("title", "Meeting")
        attendees = kwargs.get("attendees", [])

        if not transcript:
            return {"error": "Provide transcript (meeting transcript or notes text)."}

        attendee_info = f"\nAttendees: {', '.join(attendees)}" if attendees else ""

        prompt = f"""Analyze this meeting transcript and extract all actionable information.

Meeting: {title}{attendee_info}

Transcript/Notes:
{transcript}

Return JSON:
{{
  "title": "{title}",
  "attendees": {attendees or '[]'},
  "decisions": [
    {{
      "description": "What was decided",
      "made_by": "Who drove the decision",
      "context": "Brief context for why"
    }}
  ],
  "action_items": [
    {{
      "description": "What needs to be done",
      "owner": "Who is responsible (use exact names from transcript)",
      "due_date": "When it's due (or 'unspecified')",
      "status": "open",
      "priority": "high|medium|low"
    }}
  ],
  "key_discussion_points": ["Key topic discussed"],
  "unresolved_questions": ["Question that was raised but not answered"],
  "summary": "Concise meeting summary paragraph suitable for sharing",
  "follow_up_needed": ["Items that need follow-up next meeting"]
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
