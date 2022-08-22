@fabric
Feature: Hyperledger Fabric gateway is working properly

  Scenario: Alice successfully escrows CBDC
    Given "alice" with 500 CBDC available
    When "alice" escrows 500 CBDC and creates an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    Then "alice" has 0 CBDC available
    Then "charlie" has 500 CBDC available

  Scenario: Alice successfully creates an asset reference
    Given "alice" with 500 CBDC available
    When "alice" escrows 500 CBDC and creates an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    Then the asset reference chaincode has an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"

  Scenario: Alice successfully locks an asset reference
    Given "alice" with 500 CBDC available
    When "alice" escrows 500 CBDC and creates an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    When "charlie" locks the asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    Then the asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57" is locked

  Scenario: Alice successfully locks an asset reference and Bob tries to lock the same
    Given "alice" with 500 CBDC available
    When "alice" escrows 500 CBDC and creates an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    When "charlie" locks the asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    Then "bob" fails to lock the asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"

  Scenario: Alice successfully escrows 500 CBDC and tries to transfer to Bob
    Given "alice" with 500 CBDC available
    When "alice" escrows 500 CBDC and creates an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    Then "alice" fails to transfer 500 CBDC to "bob"

  Scenario: Alice successfully deletes an asset reference
    Given "alice" with 500 CBDC available
    When "alice" escrows 500 CBDC and creates an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    When "charlie" locks and deletes an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    Then the asset reference chaincode has no asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"

  Scenario: BridgeEntity successfully refunds CBDC
    Given "alice" with 500 CBDC available
    Given "alice" escrows 500 CBDC and creates an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    When "charlie" locks and deletes an asset reference with id "00ed12e4-044e-46ff-98ef-a4e25f519b57"
    When charlie refunds 500 CBDC to "alice"
    Then "charlie" has 0 CBDC available
    Then "alice" has 500 CBDC available

  Scenario: Chaincode correctly tracks amount of bridged out CBDC (1)
    Given "alice" with 500 CBDC available
    When "alice" escrows 500 CBDC and creates an asset reference with id "c5dfbd04-a71b-4848-92d1-78cd1fafaaf1"
    When "charlie" locks and deletes an asset reference with id "c5dfbd04-a71b-4848-92d1-78cd1fafaaf1"
    Then the bridged out amount is 500 CBDC

  Scenario: Chaincode correctly tracks amount of bridged out CBDC (2)
    Given "alice" with 500 CBDC available
    Given "alice" escrows 500 CBDC and creates an asset reference with id "c5dfbd04-a71b-4848-92d1-78cd1fafaaf1"
    When "charlie" locks and deletes an asset reference with id "c5dfbd04-a71b-4848-92d1-78cd1fafaaf1"
    When charlie refunds 500 CBDC to "alice"
    Then the bridged out amount is 0 CBDC