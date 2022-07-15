import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import { create } from "ipfs-http-client";
import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  BesuTestLedger,
  FabricTestLedgerV1,
  GoIpfsTestContainer,
} from "@hyperledger/cactus-test-tooling";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import {
  ChainCodeProgrammingLanguage,
  DefaultEventHandlerStrategy,
  DeploymentTargetOrgFabric2x,
  FileBase64,
  PluginLedgerConnectorFabric,
  DefaultApi as FabricApi,
  FabricContractInvocationType,
} from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import {
  PluginLedgerConnectorBesu,
  Web3SigningCredential,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  IOdapGatewayKeyPairs,
  PluginOdapGateway,
} from "../../../../../../packages/cactus-plugin-odap-hermes/src/main/typescript/gateway/plugin-odap-gateway";
import { knexClientConnection, knexServerConnection } from "../knex.config";
import { PluginObjectStoreIpfs } from "@hyperledger/cactus-plugin-object-store-ipfs";
import LockAssetContractJson from "../../solidity/lock-asset-contract/LockAsset.json";

export interface ICbdcBridgingAppDummyInfrastructureOptions {
  logLevel?: LogLevelDesc;
  apiServer1Keychain: PluginKeychainMemory;
  apiServer2Keychain: PluginKeychainMemory;
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

  public readonly besu: BesuTestLedger;
  public readonly fabric: FabricTestLedgerV1;
  public readonly ipfs: GoIpfsTestContainer;
  private readonly apiServer1Keychain: PluginKeychainMemory;
  private readonly apiServer2Keychain: PluginKeychainMemory;
  private readonly fabricAssetId: string;
  private readonly ipfsParentPath: string;
  private besuWeb3SigningCredential?: Web3SigningCredential;

  private readonly log: Logger;

  public get className(): string {
    return CbdcBridgingAppDummyInfrastructure.CLASS_NAME;
  }

  public get orgCfgDir(): string {
    return CbdcBridgingAppDummyInfrastructure.FABRIC_2_AIO_CLI_CFG_DIR;
  }

  constructor(
    public readonly options: ICbdcBridgingAppDummyInfrastructureOptions,
  ) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.apiServer1Keychain, `${fnTag} arg options,keychain1`);
    Checks.truthy(options.apiServer2Keychain, `${fnTag} arg options,keychain2`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;

    this.apiServer1Keychain = options.apiServer1Keychain;
    this.apiServer2Keychain = options.apiServer2Keychain;

    this.ipfsParentPath = `/${uuidv4()}/${uuidv4()}/`;
    this.fabricAssetId = uuidv4();

    this.log = LoggerProvider.getOrCreate({ level, label });

    this.besu = new BesuTestLedger({
      logLevel: level || "INFO",
      emitContainerLogs: true,
    });

    this.fabric = new FabricTestLedgerV1({
      publishAllPorts: true,
      imageName: "ghcr.io/hyperledger/cactus-fabric2-all-in-one",
      envVars: new Map([["FABRIC_VERSION", "2.2.0"]]),
      logLevel: level || "INFO",
    });

    this.ipfs = new GoIpfsTestContainer({
      logLevel: level || "INFO",
    });
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

  public async start(): Promise<void> {
    try {
      this.log.info(`Starting dummy infrastructure...`);
      await Promise.all([
        this.besu.start(),
        this.fabric.start(),
        this.ipfs.start(),
      ]);
      this.log.info(`Started dummy infrastructure OK`);
    } catch (ex) {
      this.log.error(`Starting of dummy infrastructure crashed: `, ex);
      throw ex;
    }
  }

  public async stop(): Promise<void> {
    try {
      this.log.info(`Stopping...`);
      await Promise.all([
        this.besu.stop().then(() => this.besu.destroy()),
        this.fabric.stop().then(() => this.fabric.destroy()),
        this.ipfs.stop().then(() => this.ipfs.destroy()),
      ]);
      this.log.info(`Stopped OK`);
    } catch (ex) {
      this.log.error(`Stopping crashed: `, ex);
      throw ex;
    }
  }

  public async createFabricLedgerConnector(): Promise<
    PluginLedgerConnectorFabric
  > {
    const connectionProfile = await this.fabric.getConnectionProfileOrg1();
    const enrollAdminOut = await this.fabric.enrollAdmin();
    const adminWallet = enrollAdminOut[1];
    const [userIdentity] = await this.fabric.enrollUser(adminWallet);

    const sshConfig = await this.fabric.getSshConfig();

    const keychainEntryKey = "user_fabric2";
    const keychainEntryValue = JSON.stringify(userIdentity);

    const keychainPlugin = new PluginKeychainMemory({
      instanceId: this.apiServer1Keychain.getInstanceId(),
      keychainId: this.apiServer1Keychain.getKeychainId(),
      logLevel: undefined,
      backend: new Map([[keychainEntryKey, keychainEntryValue]]),
    });

    const pluginRegistry = new PluginRegistry({ plugins: [keychainPlugin] });

    this.log.info(`Creating Fabric Connector...`);
    return new PluginLedgerConnectorFabric({
      instanceId: uuidv4(),
      dockerBinary: "/usr/local/bin/docker",
      peerBinary: "/fabric-samples/bin/peer",
      goBinary: "/usr/local/go/bin/go",
      pluginRegistry,
      cliContainerEnv: this.org1Env,
      sshConfig,
      connectionProfile,
      logLevel: this.options.logLevel || "INFO",
      discoveryOptions: {
        enabled: true,
        asLocalhost: true,
      },
      eventHandlerOptions: {
        strategy: DefaultEventHandlerStrategy.NetworkScopeAllfortx,
        commitTimeout: 300,
      },
    });
  }

  public async createBesuLedgerConnector(): Promise<PluginLedgerConnectorBesu> {
    const besuAccount = await this.besu.createEthTestAccount(2000000);

    const rpcApiHttpHost = await this.besu.getRpcApiHttpHost();
    const rpcApiWsHost = await this.besu.getRpcApiWsHost();

    const keychainEntryKey = LockAssetContractJson.contractName;
    const keychainEntryValue = JSON.stringify(LockAssetContractJson);

    const keychainPlugin = new PluginKeychainMemory({
      instanceId: this.apiServer2Keychain.getInstanceId(),
      keychainId: this.apiServer2Keychain.getKeychainId(),
      logLevel: undefined,
      backend: new Map([[keychainEntryKey, keychainEntryValue]]),
    });

    const pluginRegistry = new PluginRegistry({ plugins: [keychainPlugin] });

    this.besuWeb3SigningCredential = {
      ethAccount: besuAccount.address,
      secret: besuAccount.privateKey,
      type: Web3SigningCredentialType.PrivateKeyHex,
    };

    this.log.info(`Creating Besu Connector...`);
    const connectorBesu = new PluginLedgerConnectorBesu({
      instanceId: "PluginLedgerConnectorBesu_Contract_Deployment",
      rpcApiHttpHost,
      rpcApiWsHost,
      logLevel: this.options.logLevel,
      pluginRegistry,
    });

    return connectorBesu;
  }

  public async createIPFSConnector(): Promise<PluginObjectStoreIpfs> {
    this.log.info(`Creating Besu Connector...`);

    const ipfsClientOrOptions = create({
      url: await this.ipfs.getApiUrl(),
    });

    return new PluginObjectStoreIpfs({
      parentDir: this.ipfsParentPath,
      logLevel: this.options.logLevel,
      instanceId: uuidv4(),
      ipfsClientOrOptions,
    });
  }

  public async createClientGateway(
    nodeApiHost: string,
    keyPair: IOdapGatewayKeyPairs,
    ipfsPath: string,
  ): Promise<PluginOdapGateway> {
    this.log.info(`Creating Source Gateway...`);
    const pluginSourceGateway = new PluginOdapGateway({
      name: "cactus-plugin-source#odapGateway",
      dltIDs: ["DLT2"],
      instanceId: uuidv4(),
      keyPair: keyPair,
      ipfsPath: ipfsPath,
      fabricPath: nodeApiHost,
      fabricSigningCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user_fabric2",
      },
      fabricChannelName: "mychannel",
      fabricContractName: "assetTransfer",
      fabricAssetID: this.fabricAssetId,
      knexConfig: knexClientConnection,
    });

    await pluginSourceGateway.database?.migrate.rollback();
    await pluginSourceGateway.database?.migrate.latest();

    return pluginSourceGateway;
  }

  public async createServerGateway(
    nodeApiHost: string,
    keyPair: IOdapGatewayKeyPairs,
    ipfsPath: string,
  ): Promise<PluginOdapGateway> {
    this.log.info(`Creating Recipient Gateway...`);
    const pluginRecipientGateway = new PluginOdapGateway({
      name: "cactus-plugin-recipient#odapGateway",
      dltIDs: ["DLT1"],
      instanceId: uuidv4(),
      keyPair: keyPair,
      ipfsPath: ipfsPath,
      besuAssetID: uuidv4(),
      besuPath: nodeApiHost,
      besuWeb3SigningCredential: this.besuWeb3SigningCredential,
      besuContractName: LockAssetContractJson.contractName,
      besuKeychainId: this.apiServer2Keychain.getKeychainId(),
      knexConfig: knexServerConnection,
    });

    await pluginRecipientGateway.database?.migrate.rollback();
    await pluginRecipientGateway.database?.migrate.latest();

    return pluginRecipientGateway;
  }

  public async deployFabricContracts(
    fabricApiClient: FabricApi,
  ): Promise<void> {
    try {
      this.log.info(`Deploying smart contracts...`);

      const ccVersion = "1.0.0";
      const ccName = "assetTransfer";
      const ccLabel = `${ccName}_${ccVersion}`;
      const channelId = "mychannel";

      const contractRelPath =
        "../../../fabric-contracts/lock-asset/chaincode-typescript";
      this.log.debug("__dirname: %o", __dirname);
      this.log.debug("contractRelPath: %o", contractRelPath);
      const contractDir = path.join(__dirname, contractRelPath);
      this.log.debug("contractDir: %o", contractDir);

      // ├── package.json
      // ├── src
      // │   ├── assetTransfer.ts
      // │   ├── asset.ts
      // │   └── index.ts
      // ├── tsconfig.json
      const sourceFiles: FileBase64[] = [];
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
        const filename = "./asset.ts";
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
        const filename = "./assetTransfer.ts";
        const relativePath = "./src/";
        const filePath = path.join(contractDir, relativePath, filename);
        const buffer = await fs.readFile(filePath);
        sourceFiles.push({
          body: buffer.toString("base64"),
          filepath: relativePath,
          filename,
        });
      }

      const res = await fabricApiClient.deployContractV1({
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

      const { packageIds, success } = res.data;
      this.log.debug(`Success: %o`, success);
      this.log.debug(`Package IDs: %o`, packageIds);

      this.log.info(`Deployed Fabric smart contract(s) OK`);
    } catch (ex) {
      this.log.error(`Deployment of smart contracts crashed: `, ex);
      throw ex;
    }
  }

  public async createFabricAsset(fabricApiClient: FabricApi): Promise<void> {
    await fabricApiClient.runTransactionV1({
      contractName: "assetTransfer",
      channelName: "mychannel",
      params: [this.fabricAssetId, "19"],
      methodName: "CreateAsset",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user_fabric2",
      },
    });
  }

  public async deployBesuSmartContract(
    besuConnector: PluginLedgerConnectorBesu,
  ): Promise<void> {
    if (!this.besuWeb3SigningCredential) {
      throw new Error(`Besu account not defined yet.`);
    }

    await besuConnector.deployContract({
      keychainId: this.apiServer2Keychain.getKeychainId(),
      contractName: LockAssetContractJson.contractName,
      contractAbi: LockAssetContractJson.abi,
      constructorArgs: [],
      web3SigningCredential: this.besuWeb3SigningCredential,
      bytecode: LockAssetContractJson.bytecode,
      gas: 1000000,
    });
  }
}
