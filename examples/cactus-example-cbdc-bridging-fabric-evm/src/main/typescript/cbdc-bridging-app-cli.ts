#!/usr/bin/env node

import {
  AuthorizationProtocol,
  ConfigService,
  IAuthorizationConfig,
} from "@hyperledger/cactus-cmd-api-server";
import { v4 as uuidv4 } from "uuid";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { Secp256k1Keys } from "@hyperledger/cactus-common";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { PluginOdapGateway } from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript/gateway/plugin-odap-gateway";
import { ICbdcBridgingApp, CbdcBridgingApp } from "./cbdc-bridging-app";

export async function launchApp(
  env?: NodeJS.ProcessEnv,
  args?: string[],
): Promise<void> {
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
    await cbdcBridgingApp.start();
  } catch (ex) {
    console.error(`CbdcBridgingApp crashed. Existing...`, ex);
    await cbdcBridgingApp?.stop();
    process.exit(-1);
  }
}

if (require.main === module) {
  launchApp();
}
