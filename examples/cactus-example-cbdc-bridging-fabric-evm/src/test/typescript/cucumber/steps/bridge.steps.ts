import { Given, Then, When, After } from "cucumber";
import { expect } from "chai";
import axios from "axios";

// Given userA with 123 CBDC available
// When userA escrows 123 CBDC and initiates the bridge out of the CBDC by talking to the bridging entity
// Then userA has no CBDC available in the source ledger
// Then the bridge entity has 123 CBDC escrowed in the source ledger
// Then the bridge entity has no CBDC escrowed in the target ledger
// Then userA has 123 CBDC available in the target ledger

// we give it 3 minutes
Given(
  "{string} with {int} CBDC available",
  { timeout: 180 * 1000 },
  async function (/*s1: string, n1: number*/) {
    // mint 123 tokens to userA address
    await axios.post("http://localhost:4000/api", {});
  },
);

When(
  "a request to set an object with key {string} and value {int} to the ipfsApiClient should return {int}",
  async function (s1: string, n1: number, n2: number) {
    const result = await this.app.ipfsApiClient.setObjectV1({
      key: s1,
      value: n1.toString(),
    });
    expect(result.status).to.be.equal(n2);
  },
);

Then(
  "retrieving the value for the key {string} returns {string}",
  async function (s1: string, n1: string) {
    const result = await this.app.ipfsApiClient.hasObjectV1({
      key: s1,
    });
    expect(result.data.isPresent.toString()).to.be.equal(n1);
  },
);

After(function () {
  // This hook will be executed before all scenarios
});
