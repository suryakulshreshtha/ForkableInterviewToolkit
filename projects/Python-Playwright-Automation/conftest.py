"""Root pytest configuration.

This file is the framework's answer to "where does setup live?" -- every reusable
dependency is a fixture here, so no test file duplicates setup code.
"""
import pathlib
import sys

import pytest

# Make `framework.*` importable regardless of where pytest is invoked from.
sys.path.insert(0, str(pathlib.Path(__file__).parent.resolve()))

from framework.pages.automation_practice_page import AutomationPracticePage  # noqa: E402
from framework.utilities.config import base_url, default_timeout_ms  # noqa: E402


@pytest.fixture(scope="session")
def app_url() -> str:
    """Base URL under test. Override with the BASE_URL env var."""
    return base_url()


@pytest.fixture(autouse=True)
def _configure_timeouts(page):
    """Apply a consistent default timeout to every test."""
    page.set_default_timeout(default_timeout_ms())


@pytest.fixture
def practice_page(page, app_url) -> AutomationPracticePage:
    """An AutomationPracticePage already navigated and ready to use."""
    po = AutomationPracticePage(page)
    page.goto(app_url, wait_until="domcontentloaded")
    return po


@pytest.fixture(scope="session", autouse=True)
def _reports_dir():
    """Guarantee reports/ exists so screenshot helpers never explode."""
    pathlib.Path("reports").mkdir(exist_ok=True)
