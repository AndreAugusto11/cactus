import { assert } from "chai";
import CryptoMaterial from "../../../../crypto-material/crypto-material.json";

const USER_A_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userA::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const USER_B_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userB::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const FABRIC_BRIDGE_IDENTITY =
  "x509::/OU=client/OU=org2/OU=department1/CN=bridgeEntity::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com";

export function getUserAccount(user: string): any {
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

export function getUserFromPseudonim(user: string): string {
  switch (user) {
    case "alice":
      return "userA";
    case "bob":
      return "userB";
    case "charlie":
      return "bridgeEntity";
    default:
      assert.fail(0, 1, "Invalid user provided");
  }
}

export function getFabricId(user: string): string {
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

export function getEthAddress(user: string): string {
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
