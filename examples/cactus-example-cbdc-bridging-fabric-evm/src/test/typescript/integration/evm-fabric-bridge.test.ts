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
import AssetReferenceContractJson from "../../../solidity/asset-reference-contract/AssetReferenceContract.json";
import {
  EthContractInvocationType,
  InvokeContractV1Request as BesuInvokeContractV1Request,
  Web3SigningCredentialPrivateKeyHex,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import CBDCcontractJson from "../../../solidity/cbdc-erc-20/CBDCcontract.json";
import { FabricContractInvocationType } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import CryptoMaterial from "../../../crypto-material/crypto-material.json";

const API_HOST = "localhost";
const API_SERVER_1_PORT = 4000;
const API_SERVER_2_PORT = 4100;

const MAX_RETRIES = 5;
const MAX_TIMEOUT = 5000;

const FABRIC_CHANNEL_NAME = "mychannel";
const FABRIC_CONTRACT_CBDC_ERC20_NAME = "cbdc-erc20";
const FABRIC_CONTRACT_AR_ERC20_NAME = "asset-reference-contract";

const EVM_END_USER_ADDRESS = CryptoMaterial.accounts["userA"].address;
const EVM_BRIDGE_ADDRESS = CryptoMaterial.accounts["bridge"].address;

const FABRIC_ASSET_ID = "ec00efe8-4699-42a2-ab66-bbb69d089d42";
const BESU_ASSET_ID = "3adad48c-ee73-4c7b-a0d0-762679f524f8";

const USER_A_FABRIC_IDENTITY =
  "x509::/OU=client/OU=org1/OU=department1/CN=userA::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com";

const USER_A_INITIAL_BALANCE = 500;
const AMOUNT_TO_TRANSFER = 123;

const clientGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();
const serverGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();

let startResult: IStartInfo;
let cbdcBridgingApp: CbdcBridgingApp;

const signingCredentialBridge = {
  ethAccount: CryptoMaterial.accounts["bridge"].address,
  secret: CryptoMaterial.accounts["bridge"].privateKey,
  type: Web3SigningCredentialType.PrivateKeyHex,
} as Web3SigningCredentialPrivateKeyHex;

const signingCredentialUserA = {
  ethAccount: CryptoMaterial.accounts["userA"].address,
  secret: CryptoMaterial.accounts["userA"].privateKey,
  type: Web3SigningCredentialType.PrivateKeyHex,
} as Web3SigningCredentialPrivateKeyHex;

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

  const { besuApiClient, fabricApiClient } = startResult;

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
    params: [
      AMOUNT_TO_TRANSFER.toString(),
      FABRIC_ASSET_ID,
      signingCredentialUserA?.ethAccount,
    ],
    methodName: "Escrow",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: CryptoMaterial.keychains.keychain1.id,
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
      keychainId: CryptoMaterial.keychains.keychain1.id,
      keychainRef: "bridgeEntity",
    },
  });

  // Initiate state in Besu ledger
  const besuMintRes = await besuApiClient.invokeContractV1({
    contractName: AssetReferenceContractJson.contractName,
    invocationType: EthContractInvocationType.Send,
    methodName: "mint",
    gas: 1000000,
    params: [signingCredentialUserA.ethAccount, AMOUNT_TO_TRANSFER],
    signingCredential: signingCredentialBridge,
    keychainId: CryptoMaterial.keychains.keychain2.id,
  } as BesuInvokeContractV1Request);

  if (besuMintRes == undefined) {
    throw new Error("Error when minting tokens in Besu network.");
  }

  const besuCreateRes = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Send,
    methodName: "escrow",
    gas: 1000000,
    params: [AMOUNT_TO_TRANSFER, BESU_ASSET_ID],
    signingCredential: signingCredentialUserA,
    keychainId: CryptoMaterial.keychains.keychain2.id,
  } as BesuInvokeContractV1Request);

  if (besuCreateRes == undefined) {
    throw new Error("Error when escrowing tokens in Besu network.");
  }

  const userBalance = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Call,
    methodName: "balanceOf",
    gas: 1000000,
    params: [EVM_END_USER_ADDRESS],
    signingCredential: signingCredentialBridge,
    keychainId: CryptoMaterial.keychains.keychain2.id,
  } as BesuInvokeContractV1Request);

  expect(userBalance.data.callOutput).toBe("0");

  const bridgeBalance = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Call,
    methodName: "balanceOf",
    gas: 1000000,
    params: [EVM_BRIDGE_ADDRESS],
    signingCredential: signingCredentialBridge,
    keychainId: CryptoMaterial.keychains.keychain2.id,
  } as BesuInvokeContractV1Request);

  expect(bridgeBalance.data.callOutput).toBe(AMOUNT_TO_TRANSFER.toString());
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
    keyInformationLink: [
      AMOUNT_TO_TRANSFER.toString(),
      USER_A_FABRIC_IDENTITY,
      signingCredentialUserA?.ethAccount,
    ],
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
  expect(!exists1);

  const exists2 = await besuOdapGateway.besuAssetExists(BESU_ASSET_ID);
  expect(!exists2);

  const userBalanceBesu = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Call,
    methodName: "balanceOf",
    gas: 1000000,
    params: [EVM_END_USER_ADDRESS],
    signingCredential: signingCredentialUserA,
    keychainId: CryptoMaterial.keychains.keychain2.id,
  } as BesuInvokeContractV1Request);

  expect(userBalanceBesu.data.callOutput).toBe("0");

  const bridgeBalanceBesu = await besuApiClient.invokeContractV1({
    contractName: CBDCcontractJson.contractName,
    invocationType: EthContractInvocationType.Call,
    methodName: "balanceOf",
    gas: 1000000,
    params: [EVM_BRIDGE_ADDRESS],
    signingCredential: signingCredentialUserA,
    keychainId: CryptoMaterial.keychains.keychain2.id,
  } as BesuInvokeContractV1Request);

  expect(bridgeBalanceBesu.data.callOutput).toBe("0");

  const userBalanceFabric = await fabricApiClient.runTransactionV1({
    contractName: FABRIC_CONTRACT_CBDC_ERC20_NAME,
    channelName: FABRIC_CHANNEL_NAME,
    params: [],
    methodName: "ClientAccountBalance",
    invocationType: FabricContractInvocationType.Send,
    signingCredential: {
      keychainId: CryptoMaterial.keychains.keychain1.id,
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
      keychainId: CryptoMaterial.keychains.keychain1.id,
      keychainRef: "bridgeEntity",
    },
  });

  expect(bridgeBalanceFabric.data.functionOutput).toBe("0");
});

afterAll(async () => {
  await cbdcBridgingApp.stop();
  await pruneDockerAllIfGithubAction({ logLevel: "INFO" });
});
