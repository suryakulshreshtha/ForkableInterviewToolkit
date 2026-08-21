"""Radio buttons, dropdowns, checkboxes, show/hide, hover -- the everyday widgets.

Demonstrates: Page Object usage, web-first assertions, and data-driven tests
via @pytest.mark.parametrize.
"""
import pytest
from playwright.sync_api import expect


@pytest.mark.ui
@pytest.mark.parametrize("index", [0, 1, 2])
def test_radio_button_selection(practice_page, index):
    """Data-driven: the same body runs once per radio button."""
    practice_page.select_radio(index)
    expect(practice_page.radio_buttons.nth(index)).to_be_checked()


@pytest.mark.ui
@pytest.mark.parametrize("value", ["option1", "option2", "option3"])
def test_static_dropdown(practice_page, value):
    practice_page.select_dropdown_by_value(value)
    expect(practice_page.dropdown).to_have_value(value)


@pytest.mark.ui
def test_checkboxes_can_all_be_checked(practice_page):
    practice_page.check_all_checkboxes()
    for box in (practice_page.checkbox_1, practice_page.checkbox_2, practice_page.checkbox_3):
        expect(box).to_be_checked()


@pytest.mark.ui
def test_checkbox_can_be_unchecked(practice_page):
    practice_page.checkbox_1.check()
    expect(practice_page.checkbox_1).to_be_checked()
    practice_page.checkbox_1.uncheck()
    expect(practice_page.checkbox_1).not_to_be_checked()


@pytest.mark.ui
def test_hide_and_show_textbox(practice_page):
    """Playwright auto-waits for visibility changes -- no sleeps needed."""
    expect(practice_page.displayed_text).to_be_visible()

    practice_page.hide_textbox()
    expect(practice_page.displayed_text).to_be_hidden()

    practice_page.show_textbox()
    expect(practice_page.displayed_text).to_be_visible()


@pytest.mark.ui
def test_mouse_hover_reveals_menu(practice_page):
    practice_page.hover_menu()
    expect(practice_page.page.get_by_role("link", name="Top")).to_be_visible()
