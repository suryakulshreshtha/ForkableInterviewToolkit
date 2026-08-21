"""Page Object for the public AutomationPractice page.

Locator policy for this file
----------------------------
The page is a third-party practice site, so its markup can change without notice.
Where a stable, semantic hook exists we use a user-facing locator (`get_by_role`,
`get_by_label`, header-text filtering). Where the site only offers an id, we use the
id -- but we keep every one of them in THIS file, so a markup change is a one-file fix
and never touches a test.

Run `python scripts/verify_selectors.py` to check every locator below in one pass.
"""
from playwright.sync_api import FrameLocator, Locator, Page

from framework.pages.base_page import BasePage


class AutomationPracticePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)

        # --- Radio buttons ---
        self.radio_buttons = page.locator("input[name='radioButton']")

        # --- Suggestion / autocomplete ---
        self.autocomplete_input = page.locator("#autocomplete")

        # --- Static dropdown ---
        self.dropdown = page.locator("#dropdown-class-example")

        # --- Checkboxes ---
        self.checkbox_1 = page.locator("#checkBoxOption1")
        self.checkbox_2 = page.locator("#checkBoxOption2")
        self.checkbox_3 = page.locator("#checkBoxOption3")

        # --- Alerts ---
        self.alert_name_input = page.locator("#name")
        self.alert_button = page.locator("#alertbtn")
        self.confirm_button = page.locator("#confirmbtn")

        # --- New tab / new window ---
        self.open_tab_link = page.locator("#opentab")
        self.open_window_button = page.locator("#openwindow")

        # --- Show / hide ---
        self.displayed_text = page.locator("#displayed-text")
        self.hide_button = page.locator("#hide-textbox")
        self.show_button = page.locator("#show-textbox")

        # --- Mouse hover ---
        self.mouse_hover_button = page.locator("#mousehover")

        # --- iFrame ---
        self.iframe_selector = "#courses-iframe"

    # ------------------------------------------------------------------ #
    # Resilient table locators: find the table by its HEADER TEXT rather  #
    # than by a brittle class/id, so a restyle doesn't break them.        #
    # ------------------------------------------------------------------ #
    @property
    def courses_table(self) -> Locator:
        """The Instructor / Course / Price table."""
        return self.page.locator("table").filter(has_text="Instructor").first

    @property
    def amount_table(self) -> Locator:
        """The fixed-header table containing an Amount column."""
        return self.page.locator("table").filter(has_text="Amount").first

    # ---------------------------- actions ----------------------------- #
    def select_radio(self, index: int) -> None:
        """Select the nth radio button (0-based)."""
        self.radio_buttons.nth(index).check()

    def select_dropdown_by_value(self, value: str) -> None:
        self.dropdown.select_option(value)

    def check_all_checkboxes(self) -> None:
        for box in (self.checkbox_1, self.checkbox_2, self.checkbox_3):
            box.check()

    def trigger_alert(self, name: str) -> None:
        self.alert_name_input.fill(name)
        self.alert_button.click()

    def trigger_confirm(self, name: str) -> None:
        self.alert_name_input.fill(name)
        self.confirm_button.click()

    def hide_textbox(self) -> None:
        self.hide_button.click()

    def show_textbox(self) -> None:
        self.show_button.click()

    def hover_menu(self) -> None:
        self.mouse_hover_button.hover()

    def courses_frame(self) -> FrameLocator:
        return self.page.frame_locator(self.iframe_selector)

    # ------------------------------ state ----------------------------- #
    def course_prices(self) -> list[int]:
        """Every value in the Price column, as ints."""
        rows = self.courses_table.locator("tbody tr")
        prices: list[int] = []
        for i in range(rows.count()):
            cells = rows.nth(i).locator("td")
            if cells.count() >= 3:
                raw = (cells.nth(2).inner_text() or "").strip()
                if raw.isdigit():
                    prices.append(int(raw))
        return prices

    def course_names(self) -> list[str]:
        rows = self.courses_table.locator("tbody tr")
        names: list[str] = []
        for i in range(rows.count()):
            cells = rows.nth(i).locator("td")
            if cells.count() >= 2:
                names.append((cells.nth(1).inner_text() or "").strip())
        return names
