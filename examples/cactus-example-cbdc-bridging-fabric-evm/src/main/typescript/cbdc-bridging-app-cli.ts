#!/usr/bin/env node

// import { ConfigService } from "@hyperledger/cactus-cmd-api-server";
// import { LoggerProvider } from "@hyperledger/cactus-common";
import { ICbdcBridgingApp, CbdcBridgingApp } from "./cbdc-bridging-app";

export async function launchApp(): Promise<void> {
  // const configService = new ConfigService();
  // const config = await configService.getOrCreate();
  // const serverOptions = config.getProperties();
  // LoggerProvider.setLogLevel(serverOptions.logLevel);

  const appOptions: ICbdcBridgingApp = {
    logLevel: "INFO",
  };
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
