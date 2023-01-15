@eval
Feature: Evaluate performance of the bridge

  Scenario: Alice successfully creates 500 asset references and bridge out all
    Given "alice" with 5000 CBDC available in the source chain
    When "alice" escrows CBDC 500 times and creates same number of asset references in the source chain
    When "alice" initiates bridge out of 500 asset references
    Then "alice" has 0 CBDC available in the source chain
    Then "alice" has 500 CBDC available in the sidechain