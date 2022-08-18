import axios from "axios";
import { assert } from "chai";
import CryptoMaterial from "../../../crypto-material/crypto-material.json";
import AssetReferenceContractJson from "../../../solidity/asset-reference-contract/AssetReferenceContract.json";
import CBDCcontractJson from "../../../solidity/cbdc-erc-20/CBDCcontract.json";

const BESU_CONTRACT_CBDC_ERC20_NAME = CBDCcontractJson.contractName;
const BESU_CONTRACT_ASSET_REF_NAME = AssetReferenceContractJson.contractName;

export async function lockBesuAssetReference(
  userAddress: string,
  prkAddress: string,
  assetRefID: string,
): Promise<void> {
  await axios.post(
    "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
    {
      contractName: BESU_CONTRACT_ASSET_REF_NAME,
      invocationType: "SEND",
      methodName: "lockAssetReference",
      gas: 1000000,
      params: [assetRefID],
      signingCredential: {
        ethAccount: userAddress,
        secret: prkAddress,
        type: "PRIVATE_KEY_HEX",
      },
      keychainId: CryptoMaterial.keychains.keychain2.id,
    },
  );
}

export async function getBesuBalance(address: string): Promise<number> {
  const response = await axios.post(
    "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
    {
      contractName: BESU_CONTRACT_CBDC_ERC20_NAME,
      invocationType: "CALL",
      methodName: "balanceOf",
      gas: 1000000,
      params: [address],
      signingCredential: {
        ethAccount: CryptoMaterial.accounts["bridge"].address,
        secret: CryptoMaterial.accounts["bridge"].privateKey,
        type: "PRIVATE_KEY_HEX",
      },
      keychainId: CryptoMaterial.keychains.keychain2.id,
    },
  );

  return parseInt(response.data.callOutput);
}

export async function isBesuAssetReference(
  assetRefID: string,
): Promise<boolean> {
  const response = await axios.post(
    "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
    {
      contractName: BESU_CONTRACT_ASSET_REF_NAME,
      invocationType: "CALL",
      methodName: "isPresent",
      gas: 1000000,
      params: [assetRefID],
      signingCredential: {
        ethAccount: CryptoMaterial.accounts["bridge"].address,
        secret: CryptoMaterial.accounts["bridge"].privateKey,
        type: "PRIVATE_KEY_HEX",
      },
      keychainId: CryptoMaterial.keychains.keychain2.id,
    },
  );

  return response.data.callOutput;
}

export async function resetBesu(): Promise<void> {
  await axios.post(
    "http://localhost:4100/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/invoke-contract",
    {
      contractName: BESU_CONTRACT_CBDC_ERC20_NAME,
      invocationType: "SEND",
      methodName: "resetBalanceOf",
      gas: 1000000,
      params: [
        [
          CryptoMaterial.accounts["userA"].address,
          CryptoMaterial.accounts["userB"].address,
          CryptoMaterial.accounts["bridge"].address,
        ],
      ],
      signingCredential: {
        ethAccount: CryptoMaterial.accounts["bridge"].address,
        secret: CryptoMaterial.accounts["bridge"].privateKey,
        type: "PRIVATE_KEY_HEX",
      },
      keychainId: CryptoMaterial.keychains.keychain2.id,
    },
  );
}

export function getUserAccount(user: string) {
  switch (user) {
    case "alice":
      return CryptoMaterial.accounts["userA"];
    case "bob":
      return CryptoMaterial.accounts["userB"];
    case "charlie":
      return CryptoMaterial.accounts["bridge"];
    default:
      assert.fail(0, 1, "Invalid user provided");
  }
}