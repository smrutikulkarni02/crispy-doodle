"""Reddit integration for pulling discussion threads and feedback."""

from __future__ import annotations
import hashlib
from datetime import datetime

import httpx

REDDIT_SEARCH_URL = "https://www.reddit.com/search.json"


async def search_reddit(
    query: str,
    subreddit: str = "",
    sort: str = "relevance",
    limit: int = 25,
) -> list[dict]:
    if subreddit:
        url = f"https://www.reddit.com/r/{subreddit}/search.json"
        params = {"q": query, "restrict_sr": "on", "sort": sort, "limit": limit}
    else:
        url = REDDIT_SEARCH_URL
        params = {"q": query, "sort": sort, "limit": limit}

    headers = {"User-Agent": "PMCopilot/1.0"}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url, params=params, headers=headers)
        if resp.status_code != 200:
            return []
        data = resp.json()

    posts = data.get("data", {}).get("children", [])
    results = []
    for post in posts:
        d = post.get("data", {})
        text = d.get("selftext", "") or d.get("title", "")
        post_id = hashlib.sha256(f"reddit:{d.get('id', '')}".encode()).hexdigest()[:12]

        results.append({
            "id": post_id,
            "source": "reddit",
            "text": f"{d.get('title', '')} — {text}" if text != d.get("title", "") else text,
            "rating": d.get("score", 0),
            "author": d.get("author", ""),
            "date": datetime.fromtimestamp(d.get("created_utc", 0)).isoformat() if d.get("created_utc") else "",
            "url": f"https://reddit.com{d.get('permalink', '')}",
            "app_version": "",
        })
    return results
