"""App Store and Play Store review fetcher.

Uses Apple's public RSS feed for App Store reviews and
web scraping for Play Store reviews.
"""

from __future__ import annotations
import hashlib
from datetime import datetime

import httpx
import feedparser
from bs4 import BeautifulSoup


async def fetch_appstore_reviews(app_id: str, country: str = "us", page: int = 1) -> list[dict]:
    url = f"https://itunes.apple.com/{country}/rss/customerreviews/page={page}/id={app_id}/sortby=mostrecent/json"
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    entries = data.get("feed", {}).get("entry", [])
    if isinstance(entries, dict):
        entries = [entries]

    reviews = []
    for entry in entries:
        if "content" not in entry:
            continue
        text = entry.get("content", {}).get("label", "")
        title = entry.get("title", {}).get("label", "")
        rating = entry.get("im:rating", {}).get("label", "")
        author = entry.get("author", {}).get("name", {}).get("label", "")
        version = entry.get("im:version", {}).get("label", "")
        review_id = hashlib.sha256(f"{author}:{text[:50]}".encode()).hexdigest()[:12]

        reviews.append({
            "id": review_id,
            "source": "app_store",
            "text": f"{title} - {text}" if title and title != text else text,
            "rating": float(rating) if rating else None,
            "author": author,
            "date": datetime.utcnow().isoformat(),
            "url": "",
            "app_version": version,
        })
    return reviews


async def fetch_playstore_reviews(package_name: str) -> list[dict]:
    url = f"https://play.google.com/store/apps/details?id={package_name}&hl=en&gl=us"
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            return []

    soup = BeautifulSoup(resp.text, "html.parser")
    reviews = []
    for div in soup.select("[jscontroller] [class*='review']"):
        text_el = div.select_one("[class*='review-body'], [class*='content']")
        if not text_el:
            continue
        text = text_el.get_text(strip=True)
        author_el = div.select_one("[class*='author']")
        author = author_el.get_text(strip=True) if author_el else ""
        review_id = hashlib.sha256(f"play:{text[:50]}".encode()).hexdigest()[:12]

        reviews.append({
            "id": review_id,
            "source": "play_store",
            "text": text,
            "rating": None,
            "author": author,
            "date": datetime.utcnow().isoformat(),
            "url": url,
            "app_version": "",
        })
    return reviews


async def fetch_rss_reviews(feed_url: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(feed_url)
        resp.raise_for_status()

    feed = feedparser.parse(resp.text)
    reviews = []
    for entry in feed.entries:
        text = entry.get("summary", entry.get("title", ""))
        review_id = hashlib.sha256(text[:100].encode()).hexdigest()[:12]
        reviews.append({
            "id": review_id,
            "source": "rss",
            "text": text,
            "rating": None,
            "author": entry.get("author", ""),
            "date": entry.get("published", datetime.utcnow().isoformat()),
            "url": entry.get("link", ""),
            "app_version": "",
        })
    return reviews
