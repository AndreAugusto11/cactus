import { Given, When, Then, Before } from "cucumber";
import { expect, assert } from "chai";
import axios from "axios";
import CryptoMaterial from "../../../../crypto-material/crypto-material.json";
import { getUserFromPseudonim } from "./common";
import {
  deleteFabricAssetReference,
  fabricAssetReferenceExists,
  getFabricBalance,
  lockFabricAssetReference,
  readFabricAssetReference,
  resetFabric,
  refundFabricTokens,
} from "../fabric-helper";

const EVM_USER_A_USER_ADDRESS = CryptoMaterial.accounts["userA"].address;
const EVM_USER_B_USER_ADDRESS = CryptoMaterial.accounts["userB"].address;

const FABRIC_CHANNEL_NAME = "mychannel";
const FABRIC_CONTRACT_CBDC_ERC20_NAME = "cbdc";
const FABRIC_CONTRACT_ASSET_REF_NAME = "asset-reference-contract";

const USER_A_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userA::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const USER_B_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userB::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const FABRIC_BRIDGE_IDENTITY =
  "x509::/OU=client/OU=org2/OU=department1/CN=bridgeEntity::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com";

Before({ timeout: 20 * 1000, tags: "@fabric" }, async function () {
  await resetFabric();
});

Given("{string} with {int} CBDC available in the source chain", async function (
  user: string,
  amount: number,
) {
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
        keychainRef: getUserFromPseudonim("alice"),
      },
    },
  );

  expect(await getFabricBalance(USER_A_FABRIC_IDENTITY)).to.equal(amount);
});

When(
  "{string} escrows {int} CBDC and creates an asset reference with id {string} in the source chain",
  async function (user: string, amount: number, assetRefID: string) {
    await axios.post(
      "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
      {
        contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
        channelName: FABRIC_CHANNEL_NAME,
        params: [amount.toString(), assetRefID],
        methodName: "Escrow",
        invocationType: "FabricContractInvocationType.SEND",
        signingCredential: {
          keychainId: CryptoMaterial.keychains.keychain1.id,
          keychainRef: getUserFromPseudonim(user),
        },
      },
    );
  },
);

When(
  "{string} locks the asset reference with id {string} in the source chain",
  async function (user: string, assetRefID: string) {
    await lockFabricAssetReference(user, assetRefID);
  },
);

When(
  "{string} locks and deletes an asset reference with id {string} in the source chain",
  { timeout: 10 * 1000 },
  async function (user: string, assetRefID: string) {
    await lockFabricAssetReference(user, assetRefID);
    await deleteFabricAssetReference(user, assetRefID);
  },
);

When("bob refunds {int} CBDC to {string} in the source chain", async function (
  amount: number,
  userTo: string,
) {
  const finalUserFabricID =
    userTo == "alice" ? USER_A_FABRIC_IDENTITY : USER_B_FABRIC_IDENTITY;
  const finalUserEthAddress =
    userTo == "alice" ? EVM_USER_A_USER_ADDRESS : EVM_USER_B_USER_ADDRESS;

  await refundFabricTokens(finalUserFabricID, amount, finalUserEthAddress);
});

Then(
  "{string} fails to lock the asset reference with id {string} in the source chain",
  async function (user: string, assetRefID: string) {
    return axios
      .post(
        "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
        {
          contractName: FABRIC_CONTRACT_ASSET_REF_NAME,
          channelName: FABRIC_CHANNEL_NAME,
          params: [assetRefID],
          methodName: "LockAssetReference",
          invocationType: "FabricContractInvocationType.CALL",
          signingCredential: {
            keychainId: CryptoMaterial.keychains.keychain1.id,
            keychainRef: getUserFromPseudonim(user),
          },
        },
      )
      .catch((err) => {
        expect(err.response.statusText).to.contain(
          `client is not authorized to perform the operation`,
        );
      });
  },
);

Then("{string} fails to transfer {int} CBDC to {string}", async function (
  userFrom: string,
  amount: number,
  userTo: string,
) {
  let recipient;
  switch (getUserFromPseudonim(userTo)) {
    case "userA":
      recipient = USER_A_FABRIC_IDENTITY;
      break;
    case "userB":
      recipient = USER_B_FABRIC_IDENTITY;
      break;
    case "bridgeEntity":
      recipient = FABRIC_BRIDGE_IDENTITY;
      break;
    default:
      assert.fail(0, 1, "Invalid user provided");
  }

  axios
    .post(
      "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
      {
        contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
        channelName: FABRIC_CHANNEL_NAME,
        params: [recipient, amount.toString()],
        methodName: "Transfer",
        invocationType: "FabricContractInvocationType.CALL",
        signingCredential: {
          keychainId: CryptoMaterial.keychains.keychain1.id,
          keychainRef: getUserFromPseudonim(userFrom),
        },
      },
    )
    .catch((err) => {
      expect(err.response.statusText).to.contain("has insufficient funds");
    });
});

Then("{string} has {int} CBDC available in the source chain", async function (
  user: string,
  amount: number,
) {
  switch (getUserFromPseudonim(user)) {
    case "userA":
      expect(await getFabricBalance(USER_A_FABRIC_IDENTITY)).to.equal(amount);
      break;
    case "userB":
      expect(await getFabricBalance(USER_B_FABRIC_IDENTITY)).to.equal(amount);
      break;
    case "bridgeEntity":
      expect(await getFabricBalance(FABRIC_BRIDGE_IDENTITY)).to.equal(amount);
      break;
    default:
      assert.fail(0, 1, "Invalid user provided");
  }
});

Then(
  "the asset reference chaincode has an asset reference with id {string}",
  async function (assetRefID: string) {
    expect(await readFabricAssetReference(assetRefID)).to.not.be.undefined;
  },
);

Then(
  "the asset reference with id {string} is locked in the source chain",
  async function (assetRefID: string) {
    expect((await readFabricAssetReference(assetRefID)).isLocked).to.equal(
      true,
    );
  },
);

Then(
  "the asset reference chaincode has no asset reference with id {string}",
  async function (assetRefID: string) {
    expect(await fabricAssetReferenceExists(assetRefID)).to.equal("false");
  },
);
