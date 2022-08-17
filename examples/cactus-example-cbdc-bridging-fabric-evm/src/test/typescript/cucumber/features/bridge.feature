Feature: Bridge CBDC from Hyperledger Fabric ledger to Hyperledger Besu ledger

Scenario: UserA successfully transfers 123 CBDC to own address in sidechain
  Given "userA" with 123 CBDC available
  When "userA" escrows 123 CBDC and initiates bridge out of the CBDC
  Then userA has no CBDC available in the source ledger
  # Then the bridge entity has 123 CBDC escrowed in the source ledger
  # Then the bridge entity has no CBDC escrowed in the target ledger
  # Then userA has 123 CBDC available in the target ledger
