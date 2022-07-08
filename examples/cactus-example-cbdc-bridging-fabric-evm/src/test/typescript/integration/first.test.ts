import "jest-extended";
import {
  CbdcBridgingApp,
  ICbdcBridgingApp,
} from "../../../main/typescript/cbdc-bridging-app";

beforeAll(async () => {
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
});

// test("infrastructure is set up correctly", async () => {

// });

// afterAll(async () => {

// });
