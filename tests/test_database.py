import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.storage.database import init_db, save_feedback_items, get_feedback_items, save_document, search_documents, save_feature_request, get_feature_requests, DB_PATH


def setup_function():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DB_PATH.exists():
        DB_PATH.unlink()
    init_db()


def test_init_db():
    init_db()
    assert DB_PATH.exists()


def test_feedback_items():
    items = [
        {"id": "test1", "source": "app_store", "text": "App crashes on start", "rating": 1.0},
        {"id": "test2", "source": "play_store", "text": "Love the new design", "rating": 5.0},
    ]
    count = save_feedback_items(items, "TestApp")
    assert count == 2

    results = get_feedback_items("TestApp")
    assert len(results) == 2
    assert results[0]["text"] in ("App crashes on start", "Love the new design")


def test_document_storage():
    doc_id = save_document("Test Doc", "This is test content about search architecture", team="search")
    assert doc_id > 0

    results = search_documents("architecture", "search")
    assert len(results) >= 1
    assert results[0]["title"] == "Test Doc"


def test_feature_requests():
    save_feature_request({
        "id": "feat1",
        "title": "Dark Mode",
        "description": "Add dark mode support",
        "source": "user_feedback",
        "rice": {"reach": 1000, "impact": 2, "confidence": 0.8, "effort": 3, "score": 533.3},
    })
    results = get_feature_requests()
    assert len(results) >= 1
    assert results[0]["title"] == "Dark Mode"
    assert results[0]["rice"]["reach"] == 1000
