Feature: Bridge CBDC from and to ledger

Scenario: UserA successfully transfers 123 CBDC to personal address in sidechain
  Given userA with 123 CBDC available
  When userA escrows 123 CBDC and initiates the bridge out of the CBDC by talking to the bridging entity
  Then userA has no CBDC available in the source ledger
  Then the bridge entity has 123 CBDC escrowed in the source ledger
  Then the bridge entity has no CBDC escrowed in the target ledger
  Then userA has 123 CBDC available in the target ledger