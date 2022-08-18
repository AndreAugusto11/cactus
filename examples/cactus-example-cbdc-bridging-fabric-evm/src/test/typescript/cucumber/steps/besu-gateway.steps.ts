import { Given, When, Then, Before } from "cucumber";
import { expect } from "chai";
import axios from "axios";
import CryptoMaterial from "../../../../crypto-material/crypto-material.json";
import {
  getBesuBalance,
  getUserAccount,
  isBesuAssetReference,
  lockBesuAssetReference,
  resetBesu,
} from "../besu-helper";
import AssetReferenceContractJson from "../../../../solidity/asset-reference-contract/AssetReferenceContract.json";
import CBDCcontractJson from "../../../../solidity/cbdc-erc-20/CBDCcontract.json";

const BESU_CONTRACT_CBDC_ERC20_NAME = CBDCcontractJson.contractName;
const BESU_CONTRACT_ASSET_REF_NAME = AssetReferenceContractJson.contractName;

Before({ timeout: 20 * 1000, tags: "@besu" }, async function () {
  await resetBesu();
});

Given(
  "{string} with {int} CBDC available in the sidechain smart contract",
  async function (user: string, amount: number) {
    await axios.post(
      "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
      {
        contractName: BESU_CONTRACT_ASSET_REF_NAME,
        invocationType: "SEND",
        methodName: "mint",
        gas: 1000000,
        params: [getUserAccount(user).address, amount],
        signingCredential: {
          ethAccount: getUserAccount("charlie").address,
          secret: getUserAccount("charlie").privateKey,
          type: "PRIVATE_KEY_HEX",
        },
        keychainId: CryptoMaterial.keychains.keychain2.id,
      },
    );
  },
);

When(
  "{string} escrows {int} CBDC and creates an asset reference with id {string} in the sidechain",
  async function (user: string, amount: number, assetRefID: string) {
    await axios.post(
      "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
      {
        contractName: BESU_CONTRACT_CBDC_ERC20_NAME,
        invocationType: "SEND",
        methodName: "escrow",
        gas: 1000000,
        params: [amount, assetRefID],
        signingCredential: {
          ethAccount: getUserAccount(user).address,
          secret: getUserAccount(user).privateKey,
          type: "PRIVATE_KEY_HEX",
        },
        keychainId: CryptoMaterial.keychains.keychain2.id,
      },
    );
  },
);

When(
  "charlie locks the asset reference with id {string} in the sidechain",
  async function (assetRefID: string) {
    await lockBesuAssetReference(
      getUserAccount("charlie").address,
      getUserAccount("charlie").privateKey,
      assetRefID,
    );
  },
);

When(
  "charlie deletes the asset reference with id {string} in the sidechain",
  async function (assetRefID: string) {
    await axios.post(
      "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
      {
        contractName: BESU_CONTRACT_ASSET_REF_NAME,
        invocationType: "SEND",
        methodName: "deleteAssetReference",
        gas: 1000000,
        params: [assetRefID],
        signingCredential: {
          ethAccount: getUserAccount("charlie").address,
          secret: getUserAccount("charlie").privateKey,
          type: "PRIVATE_KEY_HEX",
        },
        keychainId: CryptoMaterial.keychains.keychain2.id,
      },
    );
  },
);

Then(
  "the asset reference smart contract has an asset reference with id {string}",
  async function (assetRefID: string) {
    expect(await isBesuAssetReference(assetRefID)).to.be.true;
  },
);

Then(
  "the asset reference smart contract has no asset reference with id {string}",
  async function (assetRefID: string) {
    expect(await isBesuAssetReference(assetRefID)).to.be.false;
  },
);

Then("{string} has {int} CBDC available in the sidechain", async function (
  user: string,
  amount: number,
) {
  expect(await getBesuBalance(getUserAccount(user).address)).to.equal(amount);
});

Then(
  "the asset reference with id {string} is locked in the sidechain",
  async function (assetRefID: string) {
    const response = await axios.post(
      "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
      {
        contractName: BESU_CONTRACT_ASSET_REF_NAME,
        invocationType: "CALL",
        methodName: "isAssetLocked",
        gas: 1000000,
        params: [assetRefID],
        signingCredential: {
          ethAccount: getUserAccount("alice").address,
          secret: getUserAccount("alice").privateKey,
          type: "PRIVATE_KEY_HEX",
        },
        keychainId: CryptoMaterial.keychains.keychain2.id,
      },
    );

    expect(response.data.callOutput).to.equal(true);
  },
);

Then(
  "{string} fails to lock the asset reference with id {string} in the sidechain",
  async function (user: string, assetRefID: string) {
    await lockBesuAssetReference(
      getUserAccount(user).address,
      getUserAccount(user).privateKey,
      assetRefID,
    ).catch((err) => {
      expect(err.response.data.error).to.contain(
        `Transaction has been reverted by the EVM`,
      );
    });
  },
);
