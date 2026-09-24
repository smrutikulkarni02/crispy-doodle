"""Onboarding Agent.

Uses RAG over team documents so new PMs (especially APMs) can ask questions
and get answers with citations.
"""

from __future__ import annotations
import re

from src.agents.base import BaseAgent
from src.storage.vector_store import SimpleVectorStore, VectorDocument
from src.storage.database import get_documents, save_document, search_documents

SYSTEM_PROMPT = """\
You are an onboarding assistant for new product managers joining a team.
You have access to the team's documentation and must:
1. Answer questions using ONLY information from the provided documents
2. Always cite which document your answer comes from
3. If you don't have enough information, say so clearly
4. Suggest follow-up questions the PM might want to ask
5. Explain acronyms and team-specific terminology when you encounter them

Never make up information. Always ground answers in the documents."""


class OnboardingAgent(BaseAgent):
    name = "onboarding"
    description = "Answers new PM questions using RAG over team documentation, with citations."

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._store = SimpleVectorStore()
        self._loaded = False

    def _load_docs(self, team: str = "") -> None:
        if self._loaded:
            return
        docs = get_documents(team)
        for doc in docs:
            chunks = self._chunk_text(doc["content"], doc["title"])
            for i, chunk in enumerate(chunks):
                self._store.add(VectorDocument(
                    id=f"{doc['id']}_{i}",
                    content=chunk,
                    source=doc["title"],
                    metadata={"team": doc.get("team", ""), "doc_id": doc["id"]},
                ))
        self._loaded = True

    def _chunk_text(self, text: str, source: str, chunk_size: int = 500) -> list[str]:
        paragraphs = re.split(r"\n\s*\n", text)
        chunks = []
        current = ""
        for para in paragraphs:
            if len(current) + len(para) > chunk_size and current:
                chunks.append(current.strip())
                current = para
            else:
                current += "\n\n" + para if current else para
        if current.strip():
            chunks.append(current.strip())
        return chunks or [text]

    async def run(self, **kwargs) -> dict:
        question = kwargs.get("question", "")
        team = kwargs.get("team", "")
        documents = kwargs.get("documents", [])

        if documents:
            for doc in documents:
                title = doc.get("title", "Untitled")
                content = doc.get("content", "")
                if content:
                    save_document(title, content, doc.get("source", ""), team)
                    chunks = self._chunk_text(content, title)
                    for i, chunk in enumerate(chunks):
                        self._store.add(VectorDocument(
                            id=f"new_{title}_{i}",
                            content=chunk,
                            source=title,
                        ))
            self._loaded = True
            if not question:
                return {"status": "documents_loaded", "count": len(documents)}

        if not question:
            return {"error": "Provide a question, or documents to load."}

        self._load_docs(team)

        results = self._store.search(question, top_k=5)

        if not results:
            db_results = search_documents(question, team)
            if db_results:
                context_text = "\n\n---\n\n".join(
                    f"[Source: {d['title']}]\n{d['content'][:1000]}" for d in db_results[:5]
                )
            else:
                return {
                    "question": question,
                    "answer": "I don't have any documents loaded for this team yet. Please upload team documents first.",
                    "citations": [],
                    "follow_up_questions": [],
                }
        else:
            context_text = "\n\n---\n\n".join(
                f"[Source: {doc.source}] (relevance: {score:.2f})\n{doc.content}"
                for doc, score in results
            )

        prompt = f"""Answer this question using ONLY the provided documents.

Question: {question}

Documents:
{context_text}

Return JSON:
{{
  "question": "{question}",
  "answer": "Your answer grounded in the documents",
  "citations": [
    {{
      "source": "Document title",
      "relevant_text": "The specific text that supports this part of the answer"
    }}
  ],
  "confidence": 0.0-1.0,
  "follow_up_questions": ["Questions the PM might want to ask next"],
  "acronyms_explained": {{"ACRONYM": "What it stands for"}}
}}"""

        return await self.llm.complete_json(prompt, system=SYSTEM_PROMPT)
