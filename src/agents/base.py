from __future__ import annotations
from abc import ABC, abstractmethod
from src.integrations.llm import LLMClient, llm


class BaseAgent(ABC):
    """Every agent inherits from this so the API layer can treat them uniformly."""

    name: str = "base"
    description: str = ""

    def __init__(self, llm_client: LLMClient | None = None):
        self.llm = llm_client or llm

    @abstractmethod
    async def run(self, **kwargs) -> dict:
        ...

    def info(self) -> dict:
        return {"name": self.name, "description": self.description}
