#!/usr/bin/env python3
"""Verify every locator the framework depends on, in one pass.

The practice site is third-party and can change without notice. Run this before
pushing (or whenever a test starts failing oddly) to find out instantly whether
the problem is your code or the site's markup.

    python scripts/verify_selectors.py

Exit code 0 = all locators resolved. 1 = at least one is missing.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parents[1].resolve()))

from playwright.sync_api import sync_playwright  # noqa: E402

from framework.utilities.config import base_url  # noqa: E402

# (label, selector, expected_minimum_count)
CHECKS = [
    ("radio buttons",        "input[name='radioButton']", 3),
    ("autocomplete input",   "#autocomplete",             1),
    ("static dropdown",      "#dropdown-class-example",   1),
    ("checkbox 1",           "#checkBoxOption1",          1),
    ("checkbox 2",           "#checkBoxOption2",          1),
    ("checkbox 3",           "#checkBoxOption3",          1),
    ("alert name input",     "#name",                     1),
    ("alert button",         "#alertbtn",                 1),
    ("confirm button",       "#confirmbtn",               1),
    ("open-tab link",        "#opentab",                  1),
    ("open-window button",   "#openwindow",               1),
    ("displayed text",       "#displayed-text",           1),
    ("hide button",          "#hide-textbox",             1),
    ("show button",          "#show-textbox",             1),
    ("mouse hover trigger",  "#mousehover",               1),
    ("courses iframe",       "#courses-iframe",           1),
]

GREEN, RED, YELLOW, RESET = "\033[92m", "\033[91m", "\033[93m", "\033[0m"


def main() -> int:
    url = base_url()
    print(f"\nVerifying locators against: {url}\n" + "-" * 62)

    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=60_000)

        for label, selector, minimum in CHECKS:
            count = page.locator(selector).count()
            ok = count >= minimum
            mark = f"{GREEN}PASS{RESET}" if ok else f"{RED}FAIL{RESET}"
            print(f"  [{mark}] {label:<22} {selector:<28} found={count}")
            if not ok:
                failures.append((label, selector))

        # Header-text-filtered tables (resilient locators, no id dependency)
        for label, needle in [("courses table", "Instructor"), ("amount table", "Amount")]:
            count = page.locator("table").filter(has_text=needle).count()
            ok = count >= 1
            mark = f"{GREEN}PASS{RESET}" if ok else f"{YELLOW}WARN{RESET}"
            print(f"  [{mark}] {label:<22} {'table has_text=' + needle:<28} found={count}")

        browser.close()

    print("-" * 62)
    if failures:
        print(f"{RED}{len(failures)} locator(s) failed.{RESET} "
              f"Update framework/pages/automation_practice_page.py -- "
              f"selectors live in that one file by design.\n")
        return 1

    print(f"{GREEN}All locators resolved.{RESET}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
