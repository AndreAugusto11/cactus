import { When, Then } from "cucumber";
import { expect, assert } from "chai";
import axios from "axios";
import CryptoMaterial from "../../../../crypto-material/crypto-material.json";
import { getUserFromPseudonim } from "../fabric-helper";

const MAX_RETRIES = 5;
const MAX_TIMEOUT = 5000;

const FABRIC_CHANNEL_NAME = "mychannel";
const FABRIC_CONTRACT_ASSET_REF_NAME = "asset-reference-contract";

const USER_A_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userA::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const USER_B_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userB::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const FABRIC_BRIDGE_IDENTITY =
  "x509::/OU=client/OU=org2/OU=department1/CN=bridgeEntity::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com";

Then("the bridged out amount is {int} CBDC", async function (amount: string) {
  const response = await axios.post(
    "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
    {
      contractName: FABRIC_CONTRACT_ASSET_REF_NAME,
      channelName: FABRIC_CHANNEL_NAME,
      params: [],
      methodName: "GetBridgedOutAmount",
      invocationType: "FabricContractInvocationType.CALL",
      signingCredential: {
        keychainId: CryptoMaterial.keychains.keychain1.id,
        keychainRef: getUserFromPseudonim("charlie"),
      },
    },
  );

  expect(parseInt(response.data.functionOutput)).to.equal(amount);
});

When(
  "{string} initiates bridge out of {int} CBDC referenced by id {string} to {string} address in the sidechain",
  { timeout: 60 * 1000 },
  async function (
    user: string,
    amount: number,
    assetRefID: string,
    finalUser: string,
  ) {
    const fabricID = getFabricId(user);
    const address = getEthAddress(finalUser);

    const assetProfile = {
      expirationDate: new Date(2060, 11, 24).toString(),
      issuer: "CB1",
      assetCode: "CBDC1",
      // since there is no link with the asset information,
      // we are just passing the asset parameters like this
      // [amountBeingTransferred, fabricID, ethAddress]
      keyInformationLink: [amount.toString(), fabricID, address],
    };

    const response = await axios.post(
      "http://localhost:4000/api/v1/@hyperledger/cactus-plugin-odap-hermes/clientrequest",
      {
        clientGatewayConfiguration: {
          apiHost: `http://localhost:4000`,
        },
        serverGatewayConfiguration: {
          apiHost: `http://localhost:4100`,
        },
        version: "0.0.0",
        loggingProfile: "dummyLoggingProfile",
        accessControlProfile: "dummyAccessControlProfile",
        applicationProfile: "dummyApplicationProfile",
        payloadProfile: {
          assetProfile,
          capabilities: "",
        },
        assetProfile: assetProfile,
        assetControlProfile: "dummyAssetControlProfile",
        beneficiaryPubkey: "dummyPubKey",
        clientDltSystem: "DLT1",
        originatorPubkey: "dummyPubKey",
        recipientGatewayDltSystem: "DLT2",
        recipientGatewayPubkey: CryptoMaterial.gateways["gateway2"].publicKey,
        serverDltSystem: "DLT2",
        sourceGatewayDltSystem: "DLT1",
        clientIdentityPubkey: "",
        serverIdentityPubkey: "",
        maxRetries: MAX_RETRIES,
        maxTimeout: MAX_TIMEOUT,
        sourceLedgerAssetID: assetRefID,
        recipientLedgerAssetID: "FABRIC_ASSET_ID",
      },
    );

    expect(response.status).to.equal(200);
  },
);

Then(
  "{string} tries to initiate bridge out of {int} CBDC referenced by id {string} to {string} address in the sidechain and operation fails because {string}",
  { timeout: 60 * 1000 },
  async function (
    user: string,
    amount: number,
    assetRefID: string,
    finalUser: string,
    failureReason: string,
  ) {
    const fabricID = getFabricId(user);
    const address = getEthAddress(finalUser);

    const assetProfile = {
      expirationDate: new Date(2060, 11, 24).toString(),
      issuer: "CB1",
      assetCode: "CBDC1",
      // since there is no link with the asset information,
      // we are just passing the asset parameters like this
      // [amountBeingTransferred, fabricID, ethAddress]
      keyInformationLink: [amount.toString(), fabricID, address],
    };

    await axios
      .post(
        "http://localhost:4000/api/v1/@hyperledger/cactus-plugin-odap-hermes/clientrequest",
        {
          clientGatewayConfiguration: {
            apiHost: `http://localhost:4000`,
          },
          serverGatewayConfiguration: {
            apiHost: `http://localhost:4100`,
          },
          version: "0.0.0",
          loggingProfile: "dummyLoggingProfile",
          accessControlProfile: "dummyAccessControlProfile",
          applicationProfile: "dummyApplicationProfile",
          payloadProfile: {
            assetProfile,
            capabilities: "",
          },
          assetProfile: assetProfile,
          assetControlProfile: "dummyAssetControlProfile",
          beneficiaryPubkey: "dummyPubKey",
          clientDltSystem: "DLT1",
          originatorPubkey: "dummyPubKey",
          recipientGatewayDltSystem: "DLT2",
          recipientGatewayPubkey: CryptoMaterial.gateways["gateway2"].publicKey,
          serverDltSystem: "DLT2",
          sourceGatewayDltSystem: "DLT1",
          clientIdentityPubkey: "",
          serverIdentityPubkey: "",
          maxRetries: MAX_RETRIES,
          maxTimeout: MAX_TIMEOUT,
          sourceLedgerAssetID: assetRefID,
          recipientLedgerAssetID: "BESU_ASSET_ID",
        },
      )
      .catch((err) => {
        expect(err.response.data.error).to.contain(failureReason);
      });
  },
);

function getFabricId(user: string): string {
  switch (getUserFromPseudonim(user)) {
    case "userA":
      return USER_A_FABRIC_IDENTITY;
    case "userB":
      return USER_B_FABRIC_IDENTITY;
    case "bridgeEntity":
      return FABRIC_BRIDGE_IDENTITY;
    default:
      assert.fail(0, 1, "Invalid user provided");
  }
}

function getEthAddress(user: string): string {
  switch (getUserFromPseudonim(user)) {
    case "userA":
      return CryptoMaterial.accounts["userA"].address;
    case "userB":
      return CryptoMaterial.accounts["userB"].address;
    case "bridgeEntity":
      return CryptoMaterial.accounts["bridge"].address;
    default:
      assert.fail(0, 1, "Invalid user provided");
  }
}
