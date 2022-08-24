import { AuthorizationProtocol } from "@hyperledger/cactus-cmd-api-server";
import { Checks, Secp256k1Keys } from "@hyperledger/cactus-common";
import { pruneDockerAllIfGithubAction } from "@hyperledger/cactus-test-tooling";
import "jest-extended";
import {
  CbdcBridgingApp,
  ICbdcBridgingApp,
  IStartInfo,
} from "../../../main/typescript/cbdc-bridging-app";
import { ConfigService } from "@hyperledger/cactus-cmd-api-server";
import { IAuthorizationConfig } from "@hyperledger/cactus-cmd-api-server";
import {
  ClientV1Request,
  AssetProfile,
  PluginOdapGateway,
} from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript";
import { FabricContractInvocationType } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import CBDCcontractJson from "../../../solidity/cbdc-erc-20/CBDCcontract.json";
import {
  EthContractInvocationType,
  InvokeContractV1Request as BesuInvokeContractV1Request,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import CryptoMaterial from "../../../crypto-material/crypto-material.json";

const API_HOST = "localhost";
const API_SERVER_1_PORT = 4000;
const API_SERVER_2_PORT = 4100;

const MAX_RETRIES = 5;
const MAX_TIMEOUT = 5000;

const FABRIC_CHANNEL_NAME = "mychannel";
const FABRIC_CONTRACT_CBDC_ERC20_NAME = "cbdc";

const FABRIC_ASSET_ID = "ec00efe8-4699-42a2-ab66-bbb69d089d42";
const BESU_ASSET_ID = "3adad48c-ee73-4c7b-a0d0-762679f524f8";

const EVM_END_USER_ADDRESS = CryptoMaterial.accounts["userA"].ethAddress;
const USER_A_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userA::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";
const FABRIC_BRIDGE_IDENTITY =
  "x509::/OU=client/OU=org2/OU=department1/CN=bridge::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com";

const AMOUNT_TO_TRANSFER = 123;
const USER_A_INITIAL_BALANCE = 500;

const clientGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();
const serverGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();

let startResult: IStartInfo;
let cbdcBridgingApp: CbdcBridgingApp;

beforeAll(async () => {
  await pruneDockerAllIfGithubAction({ logLevel: "INFO" });

  const configService = new ConfigService();
  Checks.truthy(configService, "Instantiated ConfigService truthy OK");

  const exampleConfig = await configService.newExampleConfig();
  Checks.truthy(exampleConfig, "configService.newExampleConfig() truthy OK");

  // TODO: Investigate the explanation for this when we have more time, for
  // now I just hacked it so that it does not look for a .config file on the FS.
  // @see: https://github.com/hyperledger/cactus/issues/1516
  // FIXME: This was not necessary prior the Jest migration but now it is.
  // Investigate the explanation for this when we have more time, for now I just
  // overrode it so that it does not look for a .config file on the local FS.
  exampleConfig.configFile = "";

  // FIXME - this hack should not be necessary, we need to re-think how we
  // do configuration parsing. The convict library may not be the path forward.
  exampleConfig.authorizationConfigJson = (JSON.stringify(
    exampleConfig.authorizationConfigJson,
  ) as unknown) as IAuthorizationConfig;
  exampleConfig.authorizationProtocol = AuthorizationProtocol.NONE;

  const convictConfig = await configService.newExampleConfigConvict(
    exampleConfig,
  );
  Checks.truthy(
    convictConfig,
    "configService.newExampleConfigConvict() truthy OK",
  );

  const env = await configService.newExampleConfigEnv(
    convictConfig.getProperties(),
  );

  const config = await configService.getOrCreate({ env });
  const apiSrvOpts = config.getProperties();
  const { logLevel } = apiSrvOpts;

  const appOptions: ICbdcBridgingApp = {
    apiHost: API_HOST,
    apiServer1Port: API_SERVER_1_PORT,
    apiServer2Port: API_SERVER_2_PORT,
    clientGatewayKeyPair: clientGatewayKeyPair,
    serverGatewayKeyPair: serverGatewayKeyPair,
    logLevel,
  };

  cbdcBridgingApp = new CbdcBridgingApp(appOptions);
  try {
    startResult = await cbdcBridgingApp.start();
  } catch (ex) {
    console.error(`CbdcBridgingApp crashed. Existing...`, ex);
    await cbdcBridgingApp?.stop();
    process.exit(-1);
  }

  const { fabricApiClient } = startResult;

  // Initiate state in Fabric ledger
  await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [USER_A_INITIAL_BALANCE.toString()],
    methodName: "Mint",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: CryptoMaterial.keychains.keychain1.id,
      keychainRef: "userA",
    },
  });

  await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [AMOUNT_TO_TRANSFER.toString(), FABRIC_ASSET_ID],
    methodName: "Escrow",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: CryptoMaterial.keychains.keychain1.id,
      keychainRef: "userA",
    },
  });
});

test("transfer asset correctly from fabric to besu", async () => {
  const {
    fabricGatewayApi,
    fabricOdapGateway,
    besuOdapGateway,
    besuApiClient,
    fabricApiClient,
  } = startResult;

  const expiryDate = new Date(2060, 11, 24).toString();
  const assetProfile: AssetProfile = {
    expirationDate: expiryDate,
    issuer: "CB1",
    assetCode: "CBDC1",
    // since there is no link with the asset information,
    // we are just passing the asset parameters like this
    // [amountBeingTransferred, fabricID, ethAddress]
    keyInformationLink: [AMOUNT_TO_TRANSFER.toString(), EVM_END_USER_ADDRESS],
  };

  const odapClientRequest: ClientV1Request = {
    clientGatewayConfiguration: {
      apiHost: `http://${API_HOST}:${API_SERVER_1_PORT}`,
    },
    serverGatewayConfiguration: {
      apiHost: `http://${API_HOST}:${API_SERVER_2_PORT}`,
    },
    version: "0.0.0",
    loggingProfile: "dummyLoggingProfile",
    accessControlProfile: "dummyAccessControlProfile",
    applicationProfile: "dummyApplicationProfile",
    payloadProfile: {
      assetProfile: assetProfile,
      capabilities: "",
    },
    assetProfile: assetProfile,
    assetControlProfile: "dummyAssetControlProfile",
    beneficiaryPubkey: "dummyPubKey",
    clientDltSystem: "DLT1",
    originatorPubkey: "dummyPubKey",
    recipientGatewayDltSystem: "DLT2",
    recipientGatewayPubkey: PluginOdapGateway.bufArray2HexStr(
      serverGatewayKeyPair.publicKey,
    ),
    serverDltSystem: "DLT2",
    sourceGatewayDltSystem: "DLT1",
    clientIdentityPubkey: "",
    serverIdentityPubkey: "",
    maxRetries: MAX_RETRIES,
    maxTimeout: MAX_TIMEOUT,
    sourceLedgerAssetID: FABRIC_ASSET_ID,
    recipientLedgerAssetID: BESU_ASSET_ID,
  };

  const res = await fabricGatewayApi.clientRequestV1(odapClientRequest);
  expect(res.status).toBe(200);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  const exists1 = await fabricOdapGateway.fabricAssetExists(FABRIC_ASSET_ID);
  expect(!exists1);

  const exists2 = await besuOdapGateway.besuAssetExists(BESU_ASSET_ID);
  expect(!exists2);

  const signingCredential = {
    ethAccount: CryptoMaterial.accounts["bridge"].ethAddress,
    secret: CryptoMaterial.accounts["bridge"].privateKey,
    type: Web3SigningCredentialType.PrivateKeyHex,
  };

  if (signingCredential == undefined) {
    throw new Error("Infrastructure set up not correctly performed.");
  }

  const finalUserBalance = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Call,
    methodName: "balanceOf",
    gas: 1000000,
    params: [EVM_END_USER_ADDRESS],
    signingCredential: signingCredential,
    keychainId: CryptoMaterial.keychains.keychain2.id,
  } as BesuInvokeContractV1Request);

  expect(finalUserBalance.data.callOutput).toBe(AMOUNT_TO_TRANSFER.toString());

  const balanceUserA = await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [USER_A_FABRIC_IDENTITY],
    methodName: "BalanceOf",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: CryptoMaterial.keychains.keychain1.id,
      keychainRef: "userA",
    },
  });

  expect(balanceUserA.data.functionOutput).toBe(
    (USER_A_INITIAL_BALANCE - AMOUNT_TO_TRANSFER).toString(),
  );

  const balanceBridgeEntity = await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [FABRIC_BRIDGE_IDENTITY],
    methodName: "BalanceOf",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: CryptoMaterial.keychains.keychain1.id,
      keychainRef: "userA",
    },
  });

  expect(balanceBridgeEntity.data.functionOutput).toBe(
    AMOUNT_TO_TRANSFER.toString(),
  );
});

afterAll(async () => {
  await cbdcBridgingApp.stop();
  await pruneDockerAllIfGithubAction({ logLevel: "INFO" });
});
