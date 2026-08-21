"""pytest-bdd step definitions.

Note how steps receive the SAME fixtures as any normal pytest test (`practice_page`
comes from the project conftest.py). pytest-bdd is a binding layer over pytest --
not a separate framework to learn.

    pytest examples/bdd_pytest_bdd -v
"""
from playwright.sync_api import expect
from pytest_bdd import given, parsers, scenarios, then, when

scenarios("login.feature")


@given("the user is on the practice page")
def _open_page(practice_page):
    expect(practice_page.dropdown).to_be_visible()
    return practice_page


@when(parsers.parse('the user selects dropdown option "{value}"'))
def _select_option(practice_page, value):
    practice_page.select_dropdown_by_value(value)


@then(parsers.parse('the dropdown should show "{value}"'))
def _assert_option(practice_page, value):
    expect(practice_page.dropdown).to_have_value(value)


@when("the user clicks the hide button")
def _click_hide(practice_page):
    practice_page.hide_textbox()


@then("the text box should not be visible")
def _assert_hidden(practice_page):
    expect(practice_page.displayed_text).to_be_hidden()
