Feature: Practice page widgets
  As an SDET learning BDD
  I want Gherkin scenarios bound to Playwright steps
  So that acceptance criteria are executable and readable

  Scenario: Selecting a dropdown option
    Given the user is on the practice page
    When the user selects dropdown option "option2"
    Then the dropdown should show "option2"

  Scenario: Hiding the text box
    Given the user is on the practice page
    When the user clicks the hide button
    Then the text box should not be visible
