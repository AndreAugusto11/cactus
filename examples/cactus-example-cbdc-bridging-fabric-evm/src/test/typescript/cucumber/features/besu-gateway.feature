@besu
Feature: Hyperledger Besu gateway is working properly

  Scenario: Alice successfully escrows CBDC
    Given "alice" with 123 CBDC available in the sidechain smart contract
    When "alice" escrows 123 CBDC and creates an asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    Then "alice" has 0 CBDC available in the sidechain
    Then "charlie" has 123 CBDC available in the sidechain

  Scenario: Alice successfully creates an asset reference in the Besu network
    Given "alice" with 123 CBDC available in the sidechain smart contract
    When "alice" escrows 123 CBDC and creates an asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    Then the asset reference smart contract has an asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6"

  Scenario: Alice successfully locks an asset reference in the Besu network
    Given "alice" with 123 CBDC available in the sidechain smart contract
    When "alice" escrows 123 CBDC and creates an asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    When charlie locks the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    Then the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" is locked in the sidechain

  Scenario: Alice successfully locks an asset reference in the Besu network
    Given "alice" with 123 CBDC available in the sidechain smart contract
    When "alice" escrows 123 CBDC and creates an asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    When charlie locks the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    Then "bob" fails to lock the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain

  Scenario: Alice successfully deletes an asset reference in the Besu network
    Given "alice" with 123 CBDC available in the sidechain smart contract
    When "alice" escrows 123 CBDC and creates an asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    When charlie locks the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    When charlie deletes the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    Then the asset reference smart contract has no asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6"

  Scenario: BridgeEntity deletes an asset reference and burns tokens in the Besu network
    Given "alice" with 123 CBDC available in the sidechain smart contract
    When "alice" escrows 123 CBDC and creates an asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    When charlie locks the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    When charlie deletes the asset reference with id "889242f8-58ae-449e-b938-fa28fdca65b6" in the sidechain
    Then "alice" has 0 CBDC available in the sidechain
    Then "charlie" has 0 CBDC available in the sidechain
