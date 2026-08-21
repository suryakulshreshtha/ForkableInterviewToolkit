"""Web-table extraction and validation.

Demonstrates reading structured data out of the DOM and asserting on it in Python,
rather than trying to express the whole assertion in a selector.
"""
import json
import pathlib

import pytest

DATA = json.loads(
    (pathlib.Path(__file__).parents[1] / "test_data" / "practice_data.json").read_text()
)


@pytest.mark.table
def test_course_prices_are_positive_integers(practice_page):
    prices = practice_page.course_prices()
    assert prices, "No prices were extracted from the courses table"
    assert all(isinstance(p, int) and p >= 0 for p in prices)


@pytest.mark.table
def test_total_course_price_is_computed(practice_page):
    prices = practice_page.course_prices()
    total = sum(prices)
    assert total > 0, f"Expected a positive total, got {total}"


@pytest.mark.table
@pytest.mark.parametrize("keyword", DATA["expected_course_keywords"])
def test_expected_courses_are_listed(practice_page, keyword):
    """Data-driven from test_data/practice_data.json."""
    names = " | ".join(practice_page.course_names())
    assert keyword.lower() in names.lower(), f"'{keyword}' not found in courses table"
