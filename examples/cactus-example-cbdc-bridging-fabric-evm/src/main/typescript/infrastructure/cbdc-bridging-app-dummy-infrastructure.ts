import path from "path";
import fs from "fs-extra";
// import { Optional } from "typescript-optional";
// import { Account } from "web3-core";
import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";

import {
  FabricTestLedgerV1,
  // OpenEthereumTestLedger,
} from "@hyperledger/cactus-test-tooling";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import {
  ChainCodeProgrammingLanguage,
  DeploymentTargetOrgFabric2x,
  FileBase64,
  PluginLedgerConnectorFabric,
} from "@hyperledger/cactus-plugin-ledger-connector-fabric";

export interface ICbdcBridgingAppDummyInfrastructureOptions {
  logLevel?: LogLevelDesc;
  keychain: PluginKeychainMemory;
}

/**
 * Contains code that is meant to simulate parts of a production grade deployment
 * that would otherwise not be part of the application itself.
 *
 * The reason for this being in existence is so that we can have tutorials that
 * are self-contained instead of starting with a multi-hour setup process where
 * the user is expected to set up ledgers from scratch with all the bells and
 * whistles.
 * The sole purpose of this is to have people ramp up with Cactus as fast as
 * possible.
 */
export class CbdcBridgingAppDummyInfrastructure {
  public static readonly CLASS_NAME = "CbdcBridgingAppDummyInfrastructure";
  // TODO: Move this to the FabricTestLedger class where it belongs.
  public static readonly FABRIC_2_AIO_CLI_CFG_DIR =
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/";
  //public readonly xdai: OpenEthereumTestLedger;
  public readonly fabric: FabricTestLedgerV1;
  private readonly log: Logger;
  private readonly keychain: PluginKeychainMemory;
  // private _xdaiAccount: Account | undefined;

  // public get xdaiAccount(): Optional<Account> {
  //   return Optional.ofNullable(this._xdaiAccount);
  // }

  public get className(): string {
    return CbdcBridgingAppDummyInfrastructure.CLASS_NAME;
  }

  public get orgCfgDir(): string {
    return CbdcBridgingAppDummyInfrastructure.FABRIC_2_AIO_CLI_CFG_DIR;
  }

  public get org1Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x {
    return {
      CORE_LOGGING_LEVEL: "debug",
      FABRIC_LOGGING_SPEC: "debug",
      CORE_PEER_LOCALMSPID: "Org1MSP",

      ORDERER_CA: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,

      FABRIC_CFG_PATH: "/etc/hyperledger/fabric",
      CORE_PEER_TLS_ENABLED: "true",
      CORE_PEER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`,
      CORE_PEER_MSPCONFIGPATH: `${this.orgCfgDir}peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`,
      CORE_PEER_ADDRESS: "peer0.org1.example.com:7051",
      ORDERER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
    };
  }

  public get org2Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x {
    return {
      CORE_LOGGING_LEVEL: "debug",
      FABRIC_LOGGING_SPEC: "debug",
      CORE_PEER_LOCALMSPID: "Org2MSP",

      FABRIC_CFG_PATH: "/etc/hyperledger/fabric",
      CORE_PEER_TLS_ENABLED: "true",
      ORDERER_CA: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,

      CORE_PEER_ADDRESS: "peer0.org2.example.com:9051",
      CORE_PEER_MSPCONFIGPATH: `${this.orgCfgDir}peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`,
      CORE_PEER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`,
      ORDERER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
    };
  }

  constructor(
    public readonly options: ICbdcBridgingAppDummyInfrastructureOptions,
  ) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.keychain, `${fnTag} arg options,keychain`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.keychain = options.keychain;
    // this.xdai = new OpenEthereumTestLedger({
    //   logLevel: this.options.logLevel || "INFO",
    // });
    this.fabric = new FabricTestLedgerV1({
      publishAllPorts: true,
      imageName: "ghcr.io/hyperledger/cactus-fabric2-all-in-one",
      envVars: new Map([["FABRIC_VERSION", "2.2.0"]]),
      logLevel: this.options.logLevel || "INFO",
    });
  }

  public async stop(): Promise<void> {
    try {
      this.log.info(`Stopping...`);
      await Promise.all([
        //this.xdai.stop().then(() => this.xdai.destroy()),
        this.fabric.stop().then(() => this.fabric.destroy()),
      ]);
      this.log.info(`Stopped OK`);
    } catch (ex) {
      this.log.error(`Stopping crashed: `, ex);
      throw ex;
    }
  }

  public async start(): Promise<void> {
    try {
      this.log.info(`Starting dummy infrastructure...`);
      await Promise.all([/*this.xdai.start(), */ this.fabric.start()]);
      this.log.info(`Started dummy infrastructure OK`);
    } catch (ex) {
      this.log.error(`Starting of dummy infrastructure crashed: `, ex);
      throw ex;
    }
  }

  public async deployFabricContracts(
    keychainPlugin: PluginKeychainMemory,
    fabricPlugin: PluginLedgerConnectorFabric,
  ): Promise<void> {
    try {
      this.log.info(`Deploying smart contracts...`);

      const ccVersion = "1.0.0";
      const ccName = "utility-emissions-channel";
      const ccLabel = `${ccName}_${ccVersion}`;
      const channelId = "mychannel";

      const contractRelPath = "../../../utility-emissions-channel/typescript/";
      this.log.debug("__dirname: %o", __dirname);
      this.log.debug("contractRelPath: %o", contractRelPath);
      const contractDir = path.join(__dirname, contractRelPath);
      this.log.debug("contractDir: %o", contractDir);

      // const orgCfgDir = "/fabric-samples/test-network/organizations/";
      // This is the directory structure of the Fabirc 2.x CLI container (fabric-tools image)
      // const orgCfgDir =
      //   "/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/";

      // .
      // ├── Dockerfile
      // ├── package.json
      // ├── src
      // │   ├── index.ts
      // │   ├── lib
      // │   │   ├── emissions-calc.ts
      // │   │   ├── emissionsRecordContract.ts
      // │   │   ├── emissions.ts
      // │   │   ├── utilityEmissionsFactor.ts
      // │   │   └── utilityLookupItem.ts
      // │   └── util
      // │       ├── const.ts
      // │       ├── state.ts
      // │       ├── util.ts
      // │       └── worldstate.ts
      // ├── test
      // │   └── lib
      // └── tsconfig.json
      const sourceFiles: FileBase64[] = [];
      {
        const filename = "./index.ts";
        const relativePath = "./src/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./tsconfig.json";
        const relativePath = "./";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./package.json";
        const relativePath = "./";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./worldstate.ts";
        const relativePath = "./src/util/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./util.ts";
        const relativePath = "./src/util/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./state.ts";
        const relativePath = "./src/util/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./const.ts";
        const relativePath = "./src/util/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./utilityLookupItem.ts";
        const relativePath = "./src/lib/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./utilityEmissionsFactor.ts";
        const relativePath = "./src/lib/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./emissions.ts";
        const relativePath = "./src/lib/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./emissionsRecordContract.ts";
        const relativePath = "./src/lib/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }
      {
        const filename = "./emissions-calc.ts";
        const relativePath = "./src/lib/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }

      const res = await fabricPlugin.deployContract({
        channelId,
        ccVersion,
        sourceFiles,
        ccName,
        targetOrganizations: [this.org1Env, this.org2Env],
        caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
        ccLabel,
        ccLang: ChainCodeProgrammingLanguage.Typescript,
        ccSequence: 1,
        orderer: "orderer.example.com:7050",
        ordererTLSHostnameOverride: "orderer.example.com",
        connTimeout: 60,
      });

      const { packageIds, success } = res;
      this.log.debug(`Success: %o`, success);
      this.log.debug(`Package IDs: %o`, packageIds);

      this.log.info(`Deployed Fabric smart contract(s) OK`);
    } catch (ex) {
      this.log.error(`Deployment of smart contracts crashed: `, ex);
      throw ex;
    }
  }
}
