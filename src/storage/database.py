from __future__ import annotations
import sqlite3
import json
from pathlib import Path
from datetime import datetime

DB_PATH = Path("data/pm_copilot.db")


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db() -> None:
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS feedback_items (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL,
            text TEXT NOT NULL,
            rating REAL,
            author TEXT DEFAULT '',
            date TEXT,
            url TEXT DEFAULT '',
            app_version TEXT DEFAULT '',
            product TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS feedback_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product TEXT NOT NULL,
            report_json TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS status_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            owner TEXT DEFAULT '',
            url TEXT DEFAULT '',
            is_blocker INTEGER DEFAULT 0,
            notes TEXT DEFAULT '',
            team TEXT DEFAULT '',
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS launch_checklists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product TEXT NOT NULL,
            checklist_json TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS prd_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            document_json TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS competitor_updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            competitor TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            summary TEXT NOT NULL,
            source_url TEXT DEFAULT '',
            date TEXT,
            impact_analysis TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS meeting_summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary_json TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            source TEXT DEFAULT '',
            team TEXT DEFAULT '',
            chunk_embeddings TEXT DEFAULT '[]',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS feature_requests (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            source TEXT DEFAULT '',
            requestor TEXT DEFAULT '',
            rice_json TEXT DEFAULT '{}',
            tags TEXT DEFAULT '[]',
            dependencies TEXT DEFAULT '[]',
            status TEXT DEFAULT 'proposed',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS analytics_schemas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            schema_json TEXT NOT NULL,
            metric_definitions TEXT DEFAULT '{}',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS analytics_queries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            sql_query TEXT NOT NULL,
            result_json TEXT DEFAULT '{}',
            created_at TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()


def save_feedback_items(items: list[dict], product: str) -> int:
    conn = get_connection()
    count = 0
    for item in items:
        try:
            conn.execute(
                "INSERT OR IGNORE INTO feedback_items (id, source, text, rating, author, date, url, app_version, product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (item.get("id", ""), item["source"], item["text"], item.get("rating"), item.get("author", ""), item.get("date", ""), item.get("url", ""), item.get("app_version", ""), product),
            )
            count += 1
        except Exception:
            continue
    conn.commit()
    conn.close()
    return count


def get_feedback_items(product: str, limit: int = 500) -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM feedback_items WHERE product = ? ORDER BY date DESC LIMIT ?",
        (product, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def save_report(table: str, data: dict, key_col: str = "product") -> int:
    conn = get_connection()
    json_col = [c for c in ("report_json", "checklist_json", "document_json", "summary_json") if c in _table_cols(table)]
    json_col = json_col[0] if json_col else "report_json"
    cur = conn.execute(
        f"INSERT INTO {table} ({key_col}, {json_col}) VALUES (?, ?)",
        (data.get(key_col, ""), json.dumps(data)),
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return row_id


def _table_cols(table: str) -> list[str]:
    conn = get_connection()
    info = conn.execute(f"PRAGMA table_info({table})").fetchall()
    conn.close()
    return [row["name"] for row in info]


def save_feature_request(fr: dict) -> None:
    conn = get_connection()
    conn.execute(
        "INSERT OR REPLACE INTO feature_requests (id, title, description, source, requestor, rice_json, tags, dependencies, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (fr["id"], fr["title"], fr["description"], fr.get("source", ""), fr.get("requestor", ""), json.dumps(fr.get("rice", {})), json.dumps(fr.get("tags", [])), json.dumps(fr.get("dependencies", [])), fr.get("status", "proposed")),
    )
    conn.commit()
    conn.close()


def get_feature_requests() -> list[dict]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM feature_requests ORDER BY created_at DESC").fetchall()
    conn.close()
    results = []
    for r in rows:
        d = dict(r)
        d["rice"] = json.loads(d.pop("rice_json", "{}"))
        d["tags"] = json.loads(d.get("tags", "[]"))
        d["dependencies"] = json.loads(d.get("dependencies", "[]"))
        results.append(d)
    return results


def save_analytics_schema(name: str, schema: dict, metrics: dict | None = None) -> int:
    conn = get_connection()
    cur = conn.execute(
        "INSERT INTO analytics_schemas (name, schema_json, metric_definitions) VALUES (?, ?, ?)",
        (name, json.dumps(schema), json.dumps(metrics or {})),
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return row_id


def get_analytics_schemas() -> list[dict]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM analytics_schemas ORDER BY created_at DESC").fetchall()
    conn.close()
    results = []
    for r in rows:
        d = dict(r)
        d["schema"] = json.loads(d.pop("schema_json"))
        d["metrics"] = json.loads(d.pop("metric_definitions", "{}"))
        results.append(d)
    return results


def save_document(title: str, content: str, source: str = "", team: str = "") -> int:
    conn = get_connection()
    cur = conn.execute(
        "INSERT INTO documents (title, content, source, team) VALUES (?, ?, ?, ?)",
        (title, content, source, team),
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return row_id


def get_documents(team: str = "") -> list[dict]:
    conn = get_connection()
    if team:
        rows = conn.execute("SELECT * FROM documents WHERE team = ? ORDER BY created_at DESC", (team,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM documents ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def search_documents(query: str, team: str = "") -> list[dict]:
    conn = get_connection()
    like = f"%{query}%"
    if team:
        rows = conn.execute("SELECT * FROM documents WHERE team = ? AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC LIMIT 20", (team, like, like)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM documents WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC LIMIT 20", (like, like)).fetchall()
    conn.close()
    return [dict(r) for r in rows]
