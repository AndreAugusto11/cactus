@besu
Feature: Hyperledger Besu gateway is working properly

  Scenario: UserA successfully escrows CBDC
    Given "userA" with 123 CBDC available in the sidechain smart contract
    When "userA" escrows 123 CBDC and creates an asset reference with id "id45" in the sidechain
    Then "userA" has 0 CBDC available in the sidechain
    Then "bridgeEntity" has 123 CBDC available in the sidechain

  Scenario: UserA successfully creates an asset reference in the Besu network
    Given "userA" with 123 CBDC available in the sidechain smart contract
    When "userA" escrows 123 CBDC and creates an asset reference with id "id45" in the sidechain
    Then the asset reference smart contract has an asset reference with id "id45"

  Scenario: UserA successfully locks an asset reference in the Besu network
    Given "userA" with 123 CBDC available in the sidechain smart contract
    When "userA" escrows 123 CBDC and creates an asset reference with id "id45" in the sidechain
    When bridgeEntity locks the asset reference with id "id45" in the sidechain
    Then the asset reference with id "id45" is locked in the sidechain

  Scenario: UserA successfully locks an asset reference in the Besu network
    Given "userA" with 123 CBDC available in the sidechain smart contract
    When "userA" escrows 123 CBDC and creates an asset reference with id "id45" in the sidechain
    When bridgeEntity locks the asset reference with id "id45" in the sidechain
    Then "userB" fails to lock the asset reference with id "id45" in the sidechain

  Scenario: UserA successfully deletes an asset reference in the Besu network
    Given "userA" with 123 CBDC available in the sidechain smart contract
    When "userA" escrows 123 CBDC and creates an asset reference with id "id45" in the sidechain
    When bridgeEntity locks the asset reference with id "id45" in the sidechain
    When bridgeEntity deletes the asset reference with id "id45" in the sidechain
    Then the asset reference smart contract has no asset reference with id "id45"

  Scenario: BridgeEntity deletes an asset reference and burns tokens in the Besu network
    Given "userA" with 123 CBDC available in the sidechain smart contract
    When "userA" escrows 123 CBDC and creates an asset reference with id "id45" in the sidechain
    When bridgeEntity locks the asset reference with id "id45" in the sidechain
    When bridgeEntity deletes the asset reference with id "id45" in the sidechain
    Then "userA" has 0 CBDC available in the sidechain
    Then "bridgeEntity" has 0 CBDC available in the sidechain
