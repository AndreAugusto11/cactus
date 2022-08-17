Feature: Hyperledger Fabric gateway is working properly

  Scenario: UserA successfully escrows CBDC
    Given "userA" with 123 CBDC available
    When "userA" escrows 123 CBDC and creates an asset reference with id "id34"
    Then "userA" has 0 CBDC available
    Then "bridgeEntity" has 123 CBDC available

  Scenario: UserA successfully creates an asset reference
    Given "userA" with 123 CBDC available
    When "userA" escrows 123 CBDC and creates an asset reference with id "id34"
    Then the asset reference chaincode has an asset reference with id "id34"

  Scenario: UserA successfully locks an asset reference
    Given "userA" with 123 CBDC available
    When "userA" escrows 123 CBDC and creates an asset reference with id "id34"
    When "userA" locks the asset reference with id "id34"
    Then the asset reference with id "id34" is locked

  Scenario: UserA successfully locks an asset reference and UserB tries to lock the same
    Given "userA" with 123 CBDC available
    When "userA" escrows 123 CBDC and creates an asset reference with id "id34"
    When "userA" locks the asset reference with id "id34"
    Then "userB" fails to lock the asset reference with id "id34"

  Scenario: UserA successfully escrows 123 CBDC and tries to transfer to UserB
    Given "userA" with 123 CBDC available
    When "userA" escrows 123 CBDC and creates an asset reference with id "id34"
    Then "userA" fails to transfer 123 CBDC to "userB"

  Scenario: UserA successfully deletes an asset reference
    Given "userA" with 123 CBDC available
    When "userA" escrows 123 CBDC and creates an asset reference with id "id34"
    When "bridgeEntity" locks and deletes an asset reference with id "id34"
    Then the asset reference chaincode has no asset reference with id "id34"

  Scenario: BridgeEntity successfully unescrows CBDC
    Given "userA" with 123 CBDC available
    Given "userA" escrows 123 CBDC and creates an asset reference with id "id34"
    When "bridgeEntity" locks and deletes an asset reference with id "id34"
    When "bridgeEntity" unescrows 123 CBDC to "userA"
    Then "bridgeEntity" has 0 CBDC available
    Then "userA" has 123 CBDC available
