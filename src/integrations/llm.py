from __future__ import annotations
import json
import anthropic
from config.settings import settings


class LLMClient:
    """Thin wrapper over the Anthropic SDK so every agent shares one calling convention."""

    def __init__(self, model: str | None = None):
        self.model = model or settings.llm_model
        self._client: anthropic.Anthropic | None = None

    @property
    def client(self) -> anthropic.Anthropic:
        if self._client is None:
            self._client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        return self._client

    async def complete(
        self,
        prompt: str,
        system: str = "",
        max_tokens: int = 4096,
        temperature: float = 0.3,
    ) -> str:
        messages = [{"role": "user", "content": prompt}]
        kwargs: dict = {
            "model": self.model,
            "max_tokens": max_tokens,
            "messages": messages,
        }
        if system:
            kwargs["system"] = system
        if temperature != 1.0:
            kwargs["temperature"] = temperature
        response = self.client.messages.create(**kwargs)
        return response.content[0].text

    async def complete_json(
        self,
        prompt: str,
        system: str = "",
        max_tokens: int = 4096,
    ) -> dict:
        system_with_json = (
            f"{system}\n\nReturn ONLY valid JSON, no markdown fences or extra text."
            if system
            else "Return ONLY valid JSON, no markdown fences or extra text."
        )
        text = await self.complete(prompt, system=system_with_json, max_tokens=max_tokens)
        text = text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            text = text.rsplit("```", 1)[0]
        return json.loads(text)


llm = LLMClient()
