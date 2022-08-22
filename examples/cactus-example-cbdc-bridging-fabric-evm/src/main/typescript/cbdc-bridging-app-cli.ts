#!/usr/bin/env node

import {
  AuthorizationProtocol,
  ConfigService,
  IAuthorizationConfig,
} from "@hyperledger/cactus-cmd-api-server";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { ICbdcBridgingApp, CbdcBridgingApp } from "./cbdc-bridging-app";
import CryptoMaterial from "../../crypto-material/crypto-material.json";

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

  const clientGatewayKeyPair = {
    privateKey: Uint8Array.from(
      Buffer.from(CryptoMaterial.gateways["gateway1"].privateKey, "hex"),
    ),
    publicKey: Uint8Array.from(
      Buffer.from(CryptoMaterial.gateways["gateway1"].publicKey, "hex"),
    ),
  };

  const serverGatewayKeyPair = {
    privateKey: Uint8Array.from(
      Buffer.from(CryptoMaterial.gateways["gateway2"].privateKey, "hex"),
    ),
    publicKey: Uint8Array.from(
      Buffer.from(CryptoMaterial.gateways["gateway2"].publicKey, "hex"),
    ),
  };

  const appOptions: ICbdcBridgingApp = {
    apiHost: API_HOST,
    apiServer1Port: API_SERVER_1_PORT,
    apiServer2Port: API_SERVER_2_PORT,
    clientGatewayKeyPair: clientGatewayKeyPair,
    serverGatewayKeyPair: serverGatewayKeyPair,
    logLevel: "INFO",
  };

  const cbdcBridgingApp = new CbdcBridgingApp(appOptions);
  try {
    await cbdcBridgingApp.start();
    console.info("CbdcBridgingApp running...");
  } catch (ex) {
    console.error(`CbdcBridgingApp crashed. Existing...`, ex);
    await cbdcBridgingApp.stop();
    process.exit(-1);
  }
}

if (require.main === module) {
  launchApp();
}
