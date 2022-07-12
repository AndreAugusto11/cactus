import { AuthorizationProtocol } from "@hyperledger/cactus-cmd-api-server";
import { Checks } from "@hyperledger/cactus-common";
import { pruneDockerAllIfGithubAction } from "@hyperledger/cactus-test-tooling";
import "jest-extended";
import {
  CbdcBridgingApp,
  ICbdcBridgingApp,
  IStartInfo,
} from "../../../main/typescript/cbdc-bridging-app";
import { ConfigService } from "@hyperledger/cactus-cmd-api-server";
import { IAuthorizationConfig } from "@hyperledger/cactus-cmd-api-server";

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
  const { apiServer, besuApiClient, fabricApiClient } = startResult;
  Checks.truthy(apiServer, "ApiServer truthy OK");
  Checks.truthy(besuApiClient, "BesuApiClient truthy OK");
  Checks.truthy(fabricApiClient, "FabricApiClient truthy OK");

  const httpServerApiA = apiServer.getHttpServerApi();
  Checks.truthy(httpServerApiA, "httpServerApiA truthy OK");

  Checks.truthy(httpServerApiA.listening, "httpServerApiA.listening true OK");

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
  await pruneDockerAllIfGithubAction({ logLevel: "INFO" });
  await cbdcBridgingApp.stop();
});
