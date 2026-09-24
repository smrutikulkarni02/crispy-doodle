from __future__ import annotations
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


# --- Feedback Agent ---

class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"


class FeedbackItem(BaseModel):
    id: str = ""
    source: str
    text: str
    rating: float | None = None
    author: str = ""
    date: datetime = Field(default_factory=datetime.utcnow)
    url: str = ""
    app_version: str = ""


class FeedbackTheme(BaseModel):
    name: str
    description: str
    sentiment: SentimentLabel
    count: int
    trend: str = "stable"  # rising, falling, stable, spike
    sample_quotes: list[str] = []
    severity: str = "medium"  # low, medium, high, critical


class FeedbackReport(BaseModel):
    product: str
    period: str
    total_reviews: int
    themes: list[FeedbackTheme]
    spikes: list[FeedbackTheme] = []
    summary: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# --- Status Agent ---

class StatusSource(str, Enum):
    GITHUB = "github"
    JIRA = "jira"
    LINEAR = "linear"
    SLACK = "slack"
    MANUAL = "manual"


class StatusItem(BaseModel):
    source: StatusSource
    title: str
    status: str
    owner: str = ""
    url: str = ""
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_blocker: bool = False
    notes: str = ""


class StatusReport(BaseModel):
    team: str
    period: str
    items: list[StatusItem]
    blockers: list[StatusItem] = []
    highlights: list[str] = []
    report_detailed: str = ""
    report_executive: str = ""
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# --- Launch Readiness ---

class ReviewArea(str, Enum):
    PRIVACY = "privacy"
    SECURITY = "security"
    LEGAL = "legal"
    ACCESSIBILITY = "accessibility"
    I18N = "internationalization"
    DESIGN = "design"
    ENGINEERING = "engineering"
    QA = "qa"
    MARKETING = "marketing"


class ChecklistItem(BaseModel):
    area: ReviewArea
    requirement: str
    status: str = "pending"  # pending, in_progress, approved, blocked
    owner: str = ""
    notes: str = ""
    pre_drafted_answer: str = ""


class LaunchReadiness(BaseModel):
    product: str
    launch_date: str = ""
    checklist: list[ChecklistItem]
    overall_status: str = "not_ready"  # not_ready, at_risk, ready
    blockers: list[str] = []
    summary: str = ""


# --- Analytics Agent ---

class QueryResult(BaseModel):
    query: str
    sql: str
    columns: list[str] = []
    rows: list[list] = []
    explanation: str = ""
    caveats: list[str] = []
    chart_type: str = ""  # bar, line, pie, table
    chart_data: dict = {}


# --- PRD Agent ---

class PRDSection(BaseModel):
    title: str
    content: str
    critique: str = ""


class PRDDocument(BaseModel):
    title: str
    author: str = ""
    sections: list[PRDSection]
    overall_critique: str = ""
    missing_elements: list[str] = []
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# --- Competitor Agent ---

class CompetitorUpdate(BaseModel):
    competitor: str
    title: str
    category: str  # launch, pricing, feature, partnership, hiring
    summary: str
    source_url: str = ""
    date: datetime = Field(default_factory=datetime.utcnow)
    impact_analysis: str = ""


class CompetitorDigest(BaseModel):
    period: str
    updates: list[CompetitorUpdate]
    key_takeaways: list[str] = []
    recommended_actions: list[str] = []
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# --- Meeting Agent ---

class ActionItem(BaseModel):
    description: str
    owner: str
    due_date: str = ""
    status: str = "open"  # open, done, overdue
    ticket_url: str = ""


class Decision(BaseModel):
    description: str
    made_by: str = ""
    context: str = ""


class MeetingSummary(BaseModel):
    title: str
    date: datetime = Field(default_factory=datetime.utcnow)
    attendees: list[str] = []
    decisions: list[Decision] = []
    action_items: list[ActionItem] = []
    key_discussion_points: list[str] = []
    summary: str = ""


# --- Onboarding Agent ---

class DocumentChunk(BaseModel):
    content: str
    source: str
    relevance_score: float = 0.0


class OnboardingAnswer(BaseModel):
    question: str
    answer: str
    citations: list[DocumentChunk] = []
    confidence: float = 0.0
    follow_up_questions: list[str] = []


# --- Prioritization Agent ---

class RICEScore(BaseModel):
    reach: float
    impact: float  # 0.25, 0.5, 1, 2, 3
    confidence: float  # 0-100%
    effort: float  # person-weeks
    score: float = 0.0

    def compute(self) -> float:
        if self.effort == 0:
            self.score = 0
            return 0
        self.score = (self.reach * self.impact * self.confidence) / self.effort
        return self.score


class FeatureRequest(BaseModel):
    id: str = ""
    title: str
    description: str
    source: str = ""
    requestor: str = ""
    rice: RICEScore | None = None
    tags: list[str] = []
    dependencies: list[str] = []
    status: str = "proposed"


class PrioritizationResult(BaseModel):
    features: list[FeatureRequest]
    trade_offs: list[str] = []
    recommendation: str = ""
