import { AuthorizationProtocol } from "@hyperledger/cactus-cmd-api-server";
import {
  Checks,
  // LoggerProvider,
  // LogLevelDesc,
  Secp256k1Keys,
} from "@hyperledger/cactus-common";
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
} from "../../../../../../packages/cactus-plugin-odap-hermes/src/main/typescript/index";

const API_HOST = "localhost";
const API_SERVER_1_PORT = 4000;
const API_SERVER_2_PORT = 4100;

const MAX_RETRIES = 5;
const MAX_TIMEOUT = 5000;

const FABRIC_ASSET_ID = "ec00efe8-4699-42a2-ab66-bbb69d089d42";
const BESU_ASSET_ID = "ec00efe8-4699-42a2-ab66-bbb69d089d42";

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
});

test("infrastructure is set up correctly", async () => {
  const {
    apiServer1,
    apiServer2,
    odapClientApi,
    odapServerApi,
    ipfsApiClient,
    besuApiClient,
    fabricApiClient,
  } = startResult;

  Checks.truthy(apiServer1, "ApiServer1 truthy OK");
  Checks.truthy(apiServer2, "ApiServer2 truthy OK");

  Checks.truthy(odapClientApi, "OdapClientApi truthy OK");
  Checks.truthy(odapServerApi, "OdapServerApi truthy OK");

  Checks.truthy(ipfsApiClient, "OdapServerApi truthy OK");

  Checks.truthy(besuApiClient, "BesuApiClient truthy OK");
  Checks.truthy(fabricApiClient, "FabricApiClient truthy OK");

  const httpServerApi1 = apiServer1.getHttpServerApi();
  Checks.truthy(httpServerApi1, "httpServerApi1 truthy OK");
  Checks.truthy(httpServerApi1.listening, "httpServerApiA.listening true OK");

  const httpServerApi2 = apiServer1.getHttpServerApi();
  Checks.truthy(httpServerApi2, "httpServerApi2 truthy OK");
  Checks.truthy(httpServerApi2.listening, "httpServerApiA.listening true OK");

  const besuMetrics = await besuApiClient.getPrometheusMetricsV1();
  Checks.truthy(besuMetrics, "besu metrics res truthy OK");
  Checks.truthy(besuMetrics.status > 199, "besuMetrics.status > 199 true OK");
  Checks.truthy(besuMetrics.status < 300, "besuMetrics.status < 300 true OK");

  const fabricMetrics = await fabricApiClient.getPrometheusMetricsV1();
  Checks.truthy(fabricMetrics, "fabric metrics res truthy OK");
  Checks.truthy(
    fabricMetrics.status > 199,
    "fabricMetrics.status > 199 true OK",
  );
  Checks.truthy(
    fabricMetrics.status < 300,
    "fabricMetrics.status < 300 true OK",
  );
});

test("transfer asset correctly from fabric to besu", async () => {
  const { odapClientApi } = startResult;

  const expiryDate = new Date(2060, 11, 24).toString();
  const assetProfile: AssetProfile = { expirationDate: expiryDate };

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
    fabricAssetID: FABRIC_ASSET_ID,
    besuAssetID: BESU_ASSET_ID,
  };

  const res = await odapClientApi.clientRequestV1(odapClientRequest);
  expect(res.status).toBe(200);
});

afterAll(async () => {
  await cbdcBridgingApp.stop();
  await pruneDockerAllIfGithubAction({ logLevel: "INFO" });
});
