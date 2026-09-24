from src.models.schemas import RICEScore, FeedbackTheme, ActionItem


def test_rice_score_computation():
    rice = RICEScore(reach=1000, impact=2.0, confidence=0.8, effort=4.0)
    score = rice.compute()
    assert score == (1000 * 2.0 * 0.8) / 4.0
    assert rice.score == score


def test_rice_zero_effort():
    rice = RICEScore(reach=100, impact=1.0, confidence=0.5, effort=0)
    score = rice.compute()
    assert score == 0


def test_feedback_theme_defaults():
    theme = FeedbackTheme(name="Crashes", description="App crashes", sentiment="negative", count=10)
    assert theme.trend == "stable"
    assert theme.severity == "medium"
    assert theme.sample_quotes == []


def test_action_item_defaults():
    item = ActionItem(description="Fix the bug", owner="Alice")
    assert item.status == "open"
    assert item.due_date == ""
