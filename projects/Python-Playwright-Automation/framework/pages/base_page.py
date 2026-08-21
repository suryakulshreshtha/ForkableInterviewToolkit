"""Shared behaviour for every Page Object.

Design rule for this framework: Page Objects expose ACTIONS and STATE.
They never assert -- the test decides what is correct.
"""
from playwright.sync_api import Page

from framework.utilities.config import base_url


class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def open(self, path: str = "") -> "BasePage":
        self.page.goto(f"{base_url()}{path}", wait_until="domcontentloaded")
        return self

    @property
    def title(self) -> str:
        return self.page.title()

    def screenshot(self, name: str) -> None:
        self.page.screenshot(path=f"reports/{name}.png", full_page=True)
