"""Central config. Everything overridable by environment variable, nothing hardcoded in tests."""
import os

# Public practice site, published for automation practice. See the responsible-use
# policy in the repo README before pointing anything else at it.
DEFAULT_BASE_URL = "https://rahulshettyacademy.com/AutomationPractice/"


def base_url() -> str:
    return os.getenv("BASE_URL", DEFAULT_BASE_URL)


def default_timeout_ms() -> int:
    return int(os.getenv("DEFAULT_TIMEOUT_MS", "15000"))
