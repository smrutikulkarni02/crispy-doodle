from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    llm_model: str = "claude-sonnet-5"

    slack_bot_token: str = ""
    slack_signing_secret: str = ""
    jira_url: str = ""
    jira_email: str = ""
    jira_api_token: str = ""
    github_token: str = ""
    reddit_client_id: str = ""
    reddit_client_secret: str = ""

    database_url: str = "sqlite:///pm_copilot.db"
    host: str = "0.0.0.0"
    port: int = 8000

    data_dir: Path = Path("data")

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
