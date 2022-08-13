import {
  CbdcBridgingApp,
  ICbdcBridgingApp,
  IStartInfo,
} from "../../../../main/typescript/cbdc-bridging-app";
import {
  ConfigService,
  IAuthorizationConfig,
  AuthorizationProtocol,
} from "@hyperledger/cactus-cmd-api-server";
import { LoggerProvider, Secp256k1Keys } from "@hyperledger/cactus-common";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { PluginOdapGateway } from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript";
import { Given, Then } from "cucumber";
import { v4 as uuidv4 } from "uuid";
import { expect } from "chai";

// we give it 3 minutes
Given("a bridging application", { timeout: 180 * 1000 }, async function () {
  this.app = await launchApp();
  expect(this.app).to.not.be.undefined;
});

Then(
  "a request to set an object with key {string} and value {int} to the ipfsApiClient should return {int}",
  async function (s1: string, n1: number, n2: number) {
    const result = await this.app.ipfsApiClient.setObjectV1({
      key: s1,
      value: n1.toString(),
    });
    expect(result.status).to.be.equal(n2);
  },
);

Then(
  "retrieving the value for the key {string} returns {string}",
  async function (s1: string, n1: string) {
    const result = await this.app.ipfsApiClient.hasObjectV1({
      key: s1,
    });
    expect(result.data.isPresent.toString()).to.be.equal(n1);
  },
);

export async function launchApp(
  env?: NodeJS.ProcessEnv,
  args?: string[],
): Promise<IStartInfo | undefined> {
  const configService = new ConfigService();
  const exampleConfig = await configService.newExampleConfig();
  exampleConfig.configFile = "";
  exampleConfig.authorizationConfigJson = (JSON.stringify(
    exampleConfig.authorizationConfigJson,
  ) as unknown) as IAuthorizationConfig;
  exampleConfig.authorizationProtocol = AuthorizationProtocol.NONE;

  const convictConfig = await configService.newExampleConfigConvict(
    exampleConfig,
  );

  env = await configService.newExampleConfigEnv(convictConfig.getProperties());

  const config = await configService.getOrCreate({ args, env });
  const serverOptions = config.getProperties();

  LoggerProvider.setLogLevel(serverOptions.logLevel);

  const API_HOST = "localhost";
  const API_SERVER_1_PORT = 4000;
  const API_SERVER_2_PORT = 4100;

  const clientGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();
  const serverGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();

  const apiServer1Keychain = new PluginKeychainMemory({
    keychainId: uuidv4(),
    instanceId: uuidv4(),
    logLevel: "INFO",
  });
  const apiServer2Keychain = new PluginKeychainMemory({
    keychainId: uuidv4(),
    instanceId: uuidv4(),
    logLevel: "INFO",
  });

  const appOptions: ICbdcBridgingApp = {
    apiHost: API_HOST,
    apiServer1Port: API_SERVER_1_PORT,
    apiServer2Port: API_SERVER_2_PORT,
    clientGatewayKeyPair: clientGatewayKeyPair,
    serverGatewayKeyPair: serverGatewayKeyPair,
    apiServer1Keychain,
    apiServer2Keychain,
    logLevel: "INFO",
  };

  const serverkey = PluginOdapGateway.bufArray2HexStr(
    serverGatewayKeyPair.publicKey,
  );
  console.log(serverkey);
  const cbdcBridgingApp = new CbdcBridgingApp(appOptions);
  try {
    const appInfo = await cbdcBridgingApp.start();
    console.info("CbdcBridgingApp running...");
    return appInfo;
  } catch (ex) {
    console.error(`CbdcBridgingApp crashed. Existing...`, ex);
    await cbdcBridgingApp?.stop();
    return undefined;
  }
}
