Feature: Add two numbers

Scenario: Add two numbers successfully
  Given a calculator
  When adding 1 and 7
  Then result should be 8
