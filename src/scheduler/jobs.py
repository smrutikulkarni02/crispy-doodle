"""Scheduled jobs for recurring agent tasks.

Uses APScheduler for cron-like scheduling of feedback pulls,
competitor scans, and stale action-item follow-ups.
"""

from __future__ import annotations
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def start_scheduler() -> None:
    if not scheduler.running:
        scheduler.start()
        logger.info("Scheduler started")


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped")


def add_feedback_job(product: str, interval_hours: int = 24) -> str:
    job_id = f"feedback_{product}"
    scheduler.add_job(
        _run_feedback_scan,
        "interval",
        hours=interval_hours,
        id=job_id,
        replace_existing=True,
        args=[product],
    )
    logger.info(f"Scheduled feedback scan for {product} every {interval_hours}h")
    return job_id


def add_competitor_job(our_product: str, competitors: list[str], interval_hours: int = 168) -> str:
    job_id = f"competitor_{our_product}"
    scheduler.add_job(
        _run_competitor_scan,
        "interval",
        hours=interval_hours,
        id=job_id,
        replace_existing=True,
        args=[our_product, competitors],
    )
    logger.info(f"Scheduled competitor scan for {our_product} every {interval_hours}h")
    return job_id


async def _run_feedback_scan(product: str) -> None:
    from src.agents.feedback import FeedbackAgent
    agent = FeedbackAgent()
    logger.info(f"Running scheduled feedback scan for {product}")
    try:
        await agent.run(product=product)
    except Exception as e:
        logger.error(f"Feedback scan failed for {product}: {e}")


async def _run_competitor_scan(our_product: str, competitors: list[str]) -> None:
    from src.agents.competitor import CompetitorAgent
    agent = CompetitorAgent()
    logger.info(f"Running scheduled competitor scan for {our_product}")
    try:
        await agent.run(our_product=our_product, competitors=competitors)
    except Exception as e:
        logger.error(f"Competitor scan failed for {our_product}: {e}")


def list_jobs() -> list[dict]:
    return [
        {"id": job.id, "next_run": str(job.next_run_time), "trigger": str(job.trigger)}
        for job in scheduler.get_jobs()
    ]
