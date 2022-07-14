#!/usr/bin/env node

// import { ConfigService } from "@hyperledger/cactus-cmd-api-server";
// import { LoggerProvider } from "@hyperledger/cactus-common";
import { Secp256k1Keys } from "@hyperledger/cactus-common";
import { ICbdcBridgingApp, CbdcBridgingApp } from "./cbdc-bridging-app";

export async function launchApp(): Promise<void> {
  // const configService = new ConfigService();
  // const config = await configService.getOrCreate();
  // const serverOptions = config.getProperties();
  // LoggerProvider.setLogLevel(serverOptions.logLevel);
  const API_HOST = "localhost";
  const CLIENT_GATEWAY_API_PORT = 4000;
  const SERVER_GATEWAY_API_PORT = 4100;
  const IPFS_API_PORT = 4200;

  const clientGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();
  const serverGatewayKeyPair = Secp256k1Keys.generateKeyPairsBuffer();

  const appOptions: ICbdcBridgingApp = {
    apiHost: API_HOST,
    clientGatewayApiPort: CLIENT_GATEWAY_API_PORT,
    serverGatewayApiPort: SERVER_GATEWAY_API_PORT,
    ipfsApiPort: IPFS_API_PORT,
    clientGatewayKeyPair: clientGatewayKeyPair,
    serverGatewayKeyPair: serverGatewayKeyPair,
    logLevel: "INFO",
  };
  // const serverkey = new TextDecoder().decode(clientGatewayKeyPair.publicKey);
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
