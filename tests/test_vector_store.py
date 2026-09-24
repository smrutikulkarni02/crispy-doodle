from src.storage.vector_store import SimpleVectorStore, VectorDocument


def test_add_and_search():
    store = SimpleVectorStore()
    store.add(VectorDocument(id="1", content="Python is a programming language used for web development", source="doc1"))
    store.add(VectorDocument(id="2", content="Java is used for enterprise applications and Android", source="doc2"))
    store.add(VectorDocument(id="3", content="The weather today is sunny and warm", source="doc3"))

    results = store.search("programming language", top_k=2)
    assert len(results) >= 1
    assert results[0][0].id == "1"
    assert results[0][1] > 0


def test_empty_store():
    store = SimpleVectorStore()
    results = store.search("anything")
    assert results == []


def test_cosine_similarity():
    score = SimpleVectorStore._cosine({"a": 1, "b": 2}, {"a": 1, "b": 2})
    assert abs(score - 1.0) < 0.001

    score = SimpleVectorStore._cosine({"a": 1}, {"b": 1})
    assert score == 0.0
