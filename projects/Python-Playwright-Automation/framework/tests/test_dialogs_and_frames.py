"""Alerts, confirms, iframes, and new tabs.

Demonstrates Playwright's event-driven model, which is fundamentally different
from Selenium's switchTo(): you register a handler BEFORE the triggering action.
"""
import pytest
from playwright.sync_api import expect


@pytest.mark.dialogs
def test_alert_shows_entered_name(practice_page):
    """Register the dialog handler first, then trigger it."""
    captured = {}

    def on_dialog(dialog):
        captured["message"] = dialog.message
        captured["type"] = dialog.type
        dialog.accept()

    practice_page.page.on("dialog", on_dialog)
    practice_page.trigger_alert("ForkableTester")

    assert "ForkableTester" in captured.get("message", "")
    assert captured.get("type") == "alert"


@pytest.mark.dialogs
def test_confirm_dialog_can_be_dismissed(practice_page):
    captured = {}

    def on_dialog(dialog):
        captured["type"] = dialog.type
        dialog.dismiss()          # click Cancel

    practice_page.page.on("dialog", on_dialog)
    practice_page.trigger_confirm("SdetSurya")

    assert captured.get("type") == "confirm"


@pytest.mark.dialogs
def test_iframe_content_is_reachable(practice_page):
    """frame_locator() scopes queries into the iframe's document."""
    frame = practice_page.courses_frame()
    expect(frame.locator("body")).to_be_visible()


@pytest.mark.dialogs
def test_open_new_tab(practice_page):
    """expect_page() captures a popup opened by a click."""
    context = practice_page.page.context
    with context.expect_page() as new_page_info:
        practice_page.open_tab_link.click()

    new_page = new_page_info.value
    new_page.wait_for_load_state("domcontentloaded")
    assert new_page.url != practice_page.page.url
    new_page.close()
