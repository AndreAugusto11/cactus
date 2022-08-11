import { AuthorizationProtocol } from "@hyperledger/cactus-cmd-api-server";
import { v4 as uuidv4 } from "uuid";
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
import AssetReferenceContractJson from "../../../solidity/asset-reference-contract/AssetReferenceContract.json";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import {
  EthContractInvocationType,
  InvokeContractV1Request as BesuInvokeContractV1Request,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import CBDCcontractJson from "../../../solidity/cbdc-erc-20/CBDCcontract.json";
import { FabricContractInvocationType } from "@hyperledger/cactus-plugin-ledger-connector-fabric";

const API_HOST = "localhost";
const API_SERVER_1_PORT = 4000;
const API_SERVER_2_PORT = 4100;

const MAX_RETRIES = 5;
const MAX_TIMEOUT = 5000;

const FABRIC_CHANNEL_NAME = "mychannel";
const FABRIC_CONTRACT_CBDC_ERC20_NAME = "cbdc-erc20";
const FABRIC_CONTRACT_AR_ERC20_NAME = "asset-reference-contract";

const EVM_END_USER_ADDRESS = "0x52550D554cf8907b5d09d0dE94e8ffA34763918d";

const FABRIC_ASSET_ID = "ec00efe8-4699-42a2-ab66-bbb69d089d42";
const BESU_ASSET_ID = "3adad48c-ee73-4c7b-a0d0-762679f524f8";

const USER_A_INITIAL_BALANCE = 500;
const AMOUNT_TO_TRANSFER = 123;

const clientGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();
const serverGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();

let startResult: IStartInfo;
let cbdcBridgingApp: CbdcBridgingApp;
let signingCredential: Web3SigningCredential | undefined;
let apiServer1Keychain: PluginKeychainMemory;
let apiServer2Keychain: PluginKeychainMemory;

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

  apiServer1Keychain = new PluginKeychainMemory({
    keychainId: uuidv4(),
    instanceId: uuidv4(),
    logLevel: logLevel || "INFO",
  });
  apiServer2Keychain = new PluginKeychainMemory({
    keychainId: uuidv4(),
    instanceId: uuidv4(),
    logLevel: logLevel || "INFO",
  });

  const appOptions: ICbdcBridgingApp = {
    apiHost: API_HOST,
    apiServer1Port: API_SERVER_1_PORT,
    apiServer2Port: API_SERVER_2_PORT,
    clientGatewayKeyPair: clientGatewayKeyPair,
    serverGatewayKeyPair: serverGatewayKeyPair,
    apiServer1Keychain,
    apiServer2Keychain,
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

  const { besuApiClient, fabricApiClient } = startResult;

  signingCredential =
    cbdcBridgingApp.infrastructure.getBesuWeb3SigningCredential;

  if (signingCredential == undefined) {
    throw new Error("Infrastructure set up not correctly performed.");
  }

  // Initiate state in Fabric ledger
  await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [USER_A_INITIAL_BALANCE.toString()],
    methodName: "Mint",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: apiServer1Keychain.getKeychainId(),
      keychainRef: "userA",
    },
  });

  await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [
      AMOUNT_TO_TRANSFER.toString(),
      FABRIC_ASSET_ID,
      EVM_END_USER_ADDRESS,
    ],
    methodName: "Escrow",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: apiServer1Keychain.getKeychainId(),
      keychainRef: "userA",
    },
  });

  await fabricApiClient.runTransactionV1({
    channelName: FABRIC_CHANNEL_NAME,
    contractName: FABRIC_CONTRACT_AR_ERC20_NAME,
    invocationType: FabricContractInvocationType.Send,
    methodName: "DeleteAssetReference",
    params: [FABRIC_ASSET_ID],
    signingCredential: {
      keychainId: apiServer1Keychain.getKeychainId(),
      keychainRef: "bridgeEntity",
    },
  });

  // Initiate state in Besu ledger
  const besuCreateRes = await besuApiClient.invokeContractV1({
    contractName: AssetReferenceContractJson.contractName,
    invocationType: EthContractInvocationType.Send,
    methodName: "createAssetReference",
    gas: 1000000,
    params: [
      BESU_ASSET_ID,
      AMOUNT_TO_TRANSFER.toString(),
      EVM_END_USER_ADDRESS,
      true,
    ],
    signingCredential: signingCredential,
    keychainId: apiServer2Keychain.getKeychainId(),
  } as BesuInvokeContractV1Request);

  if (besuCreateRes == undefined) {
    throw new Error("Error when creating asset reference in Besu network.");
  }

  const userBalance = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Call,
    methodName: "balanceOf",
    gas: 1000000,
    params: [EVM_END_USER_ADDRESS],
    signingCredential: signingCredential,
    keychainId: apiServer2Keychain.getKeychainId(),
  } as BesuInvokeContractV1Request);

  expect(userBalance.data.callOutput).toBe(AMOUNT_TO_TRANSFER.toString());
});

test("transfer asset correctly from besu to fabric", async () => {
  const {
    besuGatewayApi,
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
    // [amountBeingTransferred]
    keyInformationLink: [AMOUNT_TO_TRANSFER.toString()],
  };

  const odapClientRequest: ClientV1Request = {
    clientGatewayConfiguration: {
      apiHost: `http://${API_HOST}:${API_SERVER_2_PORT}`,
    },
    serverGatewayConfiguration: {
      apiHost: `http://${API_HOST}:${API_SERVER_1_PORT}`,
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
    clientDltSystem: "DLT2",
    originatorPubkey: "dummyPubKey",
    recipientGatewayDltSystem: "DLT1",
    recipientGatewayPubkey: PluginOdapGateway.bufArray2HexStr(
      clientGatewayKeyPair.publicKey,
    ),
    serverDltSystem: "DLT1",
    sourceGatewayDltSystem: "DLT2",
    clientIdentityPubkey: "",
    serverIdentityPubkey: "",
    maxRetries: MAX_RETRIES,
    maxTimeout: MAX_TIMEOUT,
    sourceLedgerAssetID: BESU_ASSET_ID,
    recipientLedgerAssetID: FABRIC_ASSET_ID,
  };

  const res = await besuGatewayApi.clientRequestV1(odapClientRequest);
  expect(res.status).toBe(200);

  const exists1 = await fabricOdapGateway.fabricAssetExists(FABRIC_ASSET_ID);
  expect(exists1);

  const exists2 = await besuOdapGateway.besuAssetExists(BESU_ASSET_ID);
  expect(!exists2);

  const userBalanceBesu = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Call,
    methodName: "balanceOf",
    gas: 1000000,
    params: [EVM_END_USER_ADDRESS],
    signingCredential: signingCredential,
    keychainId: apiServer2Keychain.getKeychainId(),
  } as BesuInvokeContractV1Request);

  expect(userBalanceBesu.data.callOutput).toBe("0");

  const userBalanceFabric = await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [],
    methodName: "ClientAccountBalance",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: apiServer1Keychain.getKeychainId(),
      keychainRef: "userA",
    },
  });

  expect(userBalanceFabric.data.functionOutput).toBe(
    USER_A_INITIAL_BALANCE.toString(),
  );

  const bridgeBalanceFabric = await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [],
    methodName: "ClientAccountBalance",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: apiServer1Keychain.getKeychainId(),
      keychainRef: "bridgeEntity",
    },
  });

  expect(bridgeBalanceFabric.data.functionOutput).toBe("0");
});

afterAll(async () => {
  await cbdcBridgingApp.stop();
  await pruneDockerAllIfGithubAction({ logLevel: "INFO" });
});
