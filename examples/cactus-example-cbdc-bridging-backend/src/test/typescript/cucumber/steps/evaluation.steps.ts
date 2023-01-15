import { Given, When } from "cucumber";
import { expect } from "chai";
import axios from "axios";
import CryptoMaterial from "../../../../crypto-material/crypto-material.json";
import { getUserFromPseudonim } from "./common";
import { bridgeOutAssetReference } from "./bridge-out.steps";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import fs from "fs";

const FABRIC_CHANNEL_NAME = "mychannel";
const FABRIC_CONTRACT_CBDC_ERC20_NAME = "cbdc";
const assetRefIDs: Array<string> = [];

Given(
  "{string} escrows CBDC {int} times and creates same number of asset references in the source chain",
  { timeout: -1 },
  async function (user: string, numberCctxs: number) {
    for (let i = 0; i < numberCctxs; i++) {
      const assetRefID = uuidv4();
      fs.writeFileSync(
        join(__dirname, "bridge-eval.txt"),
        "escrowing " + i.toString() + "\n",
        {
          flag: "a",
        },
      );
      await axios.post(
        "http://localhost:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/run-transaction",
        {
          contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
          channelName: FABRIC_CHANNEL_NAME,
          params: ["100", assetRefID],
          methodName: "Escrow",
          invocationType: "FabricContractInvocationType.SEND",
          signingCredential: {
            keychainId: CryptoMaterial.keychains.keychain1.id,
            keychainRef: getUserFromPseudonim(user),
          },
        },
      );

      assetRefIDs.push(assetRefID);
      fs.writeFileSync(
        join(__dirname, "bridge-eval.txt"),
        "end escrowing " + i.toString() + "\n",
        {
          flag: "a",
        },
      );
    }
  },
);

When(
  "{string} initiates bridge out of {int} asset references",
  { timeout: -1 },
  async function (user: string, numberCctxs: number) {
    for (let i = 0; i < numberCctxs; i++) {
      fs.writeFileSync(
        join(__dirname, "bridge-eval.txt"),
        "start cctx " + i.toString() + "\n",
        {
          flag: "a",
        },
      );

      const response = await bridgeOutAssetReference(
        user,
        user,
        1,
        assetRefIDs[i],
      );
      fs.writeFileSync(
        join(__dirname, "bridge-eval.txt"),
        "end cctx " + i.toString() + "\n",
        {
          flag: "a",
        },
      );

      expect(response.status).to.equal(200);
    }
  },
);
