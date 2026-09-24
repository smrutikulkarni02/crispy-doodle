"""Lightweight in-process vector store using TF-IDF for RAG.

No external vector DB required. For production, swap in pgvector/Pinecone/Chroma.
"""

from __future__ import annotations
import re
import math
from collections import Counter
from dataclasses import dataclass, field


@dataclass
class VectorDocument:
    id: str
    content: str
    source: str = ""
    metadata: dict = field(default_factory=dict)


class SimpleVectorStore:
    def __init__(self):
        self._docs: list[VectorDocument] = []
        self._idf: dict[str, float] = {}
        self._tfidf_vectors: list[dict[str, float]] = []
        self._dirty = True

    def add(self, doc: VectorDocument) -> None:
        self._docs.append(doc)
        self._dirty = True

    def add_many(self, docs: list[VectorDocument]) -> None:
        self._docs.extend(docs)
        self._dirty = True

    def _tokenize(self, text: str) -> list[str]:
        return re.findall(r"\b[a-z0-9]+\b", text.lower())

    def _build_index(self) -> None:
        if not self._dirty:
            return
        n = len(self._docs)
        if n == 0:
            return

        doc_freqs: Counter[str] = Counter()
        token_lists = []
        for doc in self._docs:
            tokens = self._tokenize(doc.content)
            token_lists.append(tokens)
            doc_freqs.update(set(tokens))

        self._idf = {
            term: math.log((n + 1) / (df + 1)) + 1
            for term, df in doc_freqs.items()
        }

        self._tfidf_vectors = []
        for tokens in token_lists:
            tf = Counter(tokens)
            total = len(tokens) or 1
            vec = {t: (c / total) * self._idf.get(t, 1) for t, c in tf.items()}
            self._tfidf_vectors.append(vec)

        self._dirty = False

    def search(self, query: str, top_k: int = 5) -> list[tuple[VectorDocument, float]]:
        self._build_index()
        if not self._docs:
            return []

        query_tokens = self._tokenize(query)
        query_tf = Counter(query_tokens)
        total = len(query_tokens) or 1
        query_vec = {t: (c / total) * self._idf.get(t, 1) for t, c in query_tf.items()}

        scores = []
        for i, doc_vec in enumerate(self._tfidf_vectors):
            score = self._cosine(query_vec, doc_vec)
            scores.append((i, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in scores[:top_k]:
            if score > 0:
                results.append((self._docs[idx], score))
        return results

    @staticmethod
    def _cosine(a: dict[str, float], b: dict[str, float]) -> float:
        dot = sum(a.get(k, 0) * b.get(k, 0) for k in set(a) | set(b))
        mag_a = math.sqrt(sum(v * v for v in a.values())) or 1
        mag_b = math.sqrt(sum(v * v for v in b.values())) or 1
        return dot / (mag_a * mag_b)
