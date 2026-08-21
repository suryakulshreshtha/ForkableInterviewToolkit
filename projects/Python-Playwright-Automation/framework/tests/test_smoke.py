"""Smoke: the critical path. If these fail, don't bother reading the rest."""
import pytest
from playwright.sync_api import expect


@pytest.mark.smoke
def test_page_loads(practice_page):
    expect(practice_page.page).to_have_url(lambda url: "AutomationPractice" in url)


@pytest.mark.smoke
@pytest.mark.table
def test_courses_table_has_rows(practice_page):
    """The Instructor/Course/Price table renders with data."""
    rows = practice_page.courses_table.locator("tbody tr")
    expect(rows.first).to_be_visible()
    assert rows.count() > 1, "Expected multiple course rows"
