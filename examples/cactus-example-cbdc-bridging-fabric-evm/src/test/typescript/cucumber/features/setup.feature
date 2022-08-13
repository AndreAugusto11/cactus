Feature: Add two numbers

Scenario: Add two numbers successfully
  Given a bridging application
  Then a request to set an object with key "lala" and value 300 to the ipfsApiClient should return 200
  Then retrieving the value for the key "lala" returns "true"