import { AuthorizationProtocol } from "@hyperledger/cactus-cmd-api-server";
import { v4 as uuidv4 } from "uuid";
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
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";

const API_HOST = "localhost";
const API_SERVER_1_PORT = 4000;
const API_SERVER_2_PORT = 4100;

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

  const apiServer1Keychain = new PluginKeychainMemory({
    keychainId: uuidv4(),
    instanceId: uuidv4(),
    logLevel: logLevel || "INFO",
  });
  const apiServer2Keychain = new PluginKeychainMemory({
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
});

test("infrastructure is set up correctly", async () => {
  const {
    apiServer1,
    apiServer2,
    fabricGatewayApi,
    besuGatewayApi,
    ipfsApiClient,
    besuApiClient,
    fabricApiClient,
  } = startResult;

  Checks.truthy(apiServer1, "ApiServer1 truthy OK");
  Checks.truthy(apiServer2, "ApiServer2 truthy OK");

  Checks.truthy(fabricGatewayApi, "FabricGatewayApi truthy OK");
  Checks.truthy(besuGatewayApi, "BesuGatewayApi truthy OK");

  Checks.truthy(ipfsApiClient, "IpfsApiClient truthy OK");

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

afterAll(async () => {
  await cbdcBridgingApp.stop();
  await pruneDockerAllIfGithubAction({ logLevel: "INFO" });
});
