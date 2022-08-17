import { Given, When, After } from "cucumber";
import { expect } from "chai";
import axios from "axios";
import CryptoMaterial from "../../../../crypto-material/crypto-material.json";

const FABRIC_CHANNEL_NAME = "mychannel";
const FABRIC_CONTRACT_CBDC_ERC20_NAME = "cbdc-erc20";

const EVM_USER_A_USER_ADDRESS = CryptoMaterial.accounts["userA"].address;
const USER_A_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userA::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const FABRIC_BRIDGE_IDENTITY =
  "x509::/OU=client/OU=org2/OU=department1/CN=bridgeEntity::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com";

const FABRIC_ASSET_ID = "ec00efe8-4699-42a2-ab66-bbb69d089d42";
// const BESU_ASSET_ID = "3adad48c-ee73-4c7b-a0d0-762679f524f8";

// Given userA with 123 CBDC available
// When userA escrows 123 CBDC and initiates the bridge out of the CBDC by talking to the bridging entity
// Then userA has no CBDC available in the source ledger
// Then the bridge entity has 123 CBDC escrowed in the source ledger
// Then the bridge entity has no CBDC escrowed in the target ledger
// Then userA has 123 CBDC available in the target ledger

Given("{string} with {int} CBDC available", async function (
  user: string,
  amount: number,
) {
  const initialBalance = await getUserAFabricBalance(user);

  await axios.post(
    "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
    {
      contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
      channelName: FABRIC_CHANNEL_NAME,
      params: [amount.toString()],
      methodName: "Mint",
      invocationType: "FabricContractInvocationType.SEND",
      signingCredential: {
        keychainId: CryptoMaterial.keychains.keychain1.id,
        keychainRef: user,
      },
    },
  );

  const finalBalance = await getUserAFabricBalance(user);
  expect(finalBalance).to.equal(initialBalance! + amount);
});

When(
  "{string} escrows {int} CBDC and initiates bridge out of the CBDC",
  async function (user: string, amount: number) {
    const initialUserABalance = await getUserAFabricBalance(user);
    const initialBridgeBalance = await getBridgeFabricBalance(user);

    await axios.post(
      "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
      {
        contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
        channelName: FABRIC_CHANNEL_NAME,
        params: [amount.toString(), FABRIC_ASSET_ID, EVM_USER_A_USER_ADDRESS],
        methodName: "Escrow",
        invocationType: "FabricContractInvocationType.SEND",
        signingCredential: {
          keychainId: CryptoMaterial.keychains.keychain1.id,
          keychainRef: user,
        },
      },
    );

    getUserAFabricBalance(user).then((res) => {
      expect(res).to.equal(initialUserABalance - amount);
    });
    getBridgeFabricBalance(user).then((res) => {
      expect(res).to.equal(initialBridgeBalance + amount);
    });
  },
);

// Then(
//   "retrieving the value for the key {string} returns {string}",
//   async function (s1: string, n1: string) {
//     const result = await this.app.ipfsApiClient.hasObjectV1({
//       key: s1,
//     });
//     expect(result.data.isPresent.toString()).to.be.equal(n1);
//   },
// );

After(function () {
  // This hook will be executed after all scenarios
});

async function getUserAFabricBalance(user: string): Promise<number> {
  const response = await axios.post(
    "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
    {
      contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
      channelName: FABRIC_CHANNEL_NAME,
      params: [USER_A_FABRIC_IDENTITY],
      methodName: "BalanceOf",
      invocationType: "FabricContractInvocationType.CALL",
      signingCredential: {
        keychainId: CryptoMaterial.keychains.keychain1.id,
        keychainRef: user,
      },
    },
  );

  return parseInt(response.data.functionOutput);
}

async function getBridgeFabricBalance(user: string): Promise<number> {
  const response = await axios.post(
    "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
    {
      contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
      channelName: FABRIC_CHANNEL_NAME,
      params: [FABRIC_BRIDGE_IDENTITY],
      methodName: "BalanceOf",
      invocationType: "FabricContractInvocationType.CALL",
      signingCredential: {
        keychainId: CryptoMaterial.keychains.keychain1.id,
        keychainRef: user,
      },
    },
  );

  return parseInt(response.data.functionOutput);
}
