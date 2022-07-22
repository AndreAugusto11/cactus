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
  DefaultApi as BesuApi,
  DeployContractSolidityBytecodeV1Request,
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
import AssetReferenceContractJson from "../../../solidity/asset-reference-contract/AssetReferenceContract.json";
import CBDCcontractJson from "../../../solidity/cbdc-erc-20/CBDCcontract.json";

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

    const keychainEntryKey = "user2";
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

    const keychainEntryKey = AssetReferenceContractJson.contractName;
    const keychainEntryValue = JSON.stringify(AssetReferenceContractJson);

    const keychainEntryKey2 = CBDCcontractJson.contractName;
    const keychainEntryValue2 = JSON.stringify(CBDCcontractJson);

    const keychainPlugin = new PluginKeychainMemory({
      instanceId: this.apiServer2Keychain.getInstanceId(),
      keychainId: this.apiServer2Keychain.getKeychainId(),
      logLevel: undefined,
      backend: new Map([
        [keychainEntryKey, keychainEntryValue],
        [keychainEntryKey2, keychainEntryValue2],
      ]),
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
        keychainRef: "user2",
      },
      fabricChannelName: "mychannel",
      fabricContractName: "asset-reference-contract",
      fabricAssetID: this.fabricAssetId,
      fabricLockMethodName: "LockAssetReference",
      fabricCreateMethodName: "CreateAssetReference",
      fabricDeleteMethodName: "DeleteAssetReference",
      fabricUnlockMethodName: "UnlockAssetReference",
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
      besuContractName: AssetReferenceContractJson.contractName,
      besuKeychainId: this.apiServer2Keychain.getKeychainId(),
      besuLockMethodName: "lockAssetReference",
      besuCreateMethodName: "createAssetReference",
      besuDeleteMethodName: "deleteAssetReference",
      besuUnlockMethodName: "unlockAssetReference",
      knexConfig: knexServerConnection,
    });

    await pluginRecipientGateway.database?.migrate.rollback();
    await pluginRecipientGateway.database?.migrate.latest();

    return pluginRecipientGateway;
  }

  public async deployFabricAssetReferenceContract(
    fabricApiClient: FabricApi,
  ): Promise<void> {
    const channelId = "mychannel";
    const channelName = channelId;

    const contractName = "asset-reference-contract";

    const contractRelPath =
      "../../../fabric-contracts/asset-reference/typescript";
    const contractDir = path.join(__dirname, contractRelPath);

    // ├── package.json
    // ├── src
    // │   ├── assetTransfer.ts
    // │   ├── asset.ts
    // │   └── index.ts
    // ├── tsconfig.json
    // └── tslint.json
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
      const filename = "./asset-reference.ts";
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
      const filename = "./assetReferenceContract.ts";
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
      ccVersion: "1.0.0",
      // constructorArgs: { Args: ["john", "99"] },
      sourceFiles,
      ccName: contractName,
      targetOrganizations: [this.org1Env, this.org2Env],
      caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
      ccLabel: "asset-reference-contract",
      ccLang: ChainCodeProgrammingLanguage.Typescript,
      ccSequence: 1,
      orderer: "orderer.example.com:7050",
      ordererTLSHostnameOverride: "orderer.example.com",
      connTimeout: 60,
    });

    const { packageIds, lifecycle } = res.data;

    const {
      approveForMyOrgList,
      installList,
      queryInstalledList,
      commit,
      packaging,
      queryCommitted,
    } = lifecycle;

    Checks.truthy(packageIds, `packageIds truthy OK`);
    Checks.truthy(
      Array.isArray(packageIds),
      `Array.isArray(packageIds) truthy OK`,
    );
    Checks.truthy(approveForMyOrgList, `approveForMyOrgList truthy OK`);
    Checks.truthy(
      Array.isArray(approveForMyOrgList),
      `Array.isArray(approveForMyOrgList) truthy OK`,
    );
    Checks.truthy(installList, `installList truthy OK`);
    Checks.truthy(
      Array.isArray(installList),
      `Array.isArray(installList) truthy OK`,
    );
    Checks.truthy(queryInstalledList, `queryInstalledList truthy OK`);
    Checks.truthy(
      Array.isArray(queryInstalledList),
      `Array.isArray(queryInstalledList) truthy OK`,
    );
    Checks.truthy(commit, `commit truthy OK`);
    Checks.truthy(packaging, `packaging truthy OK`);
    Checks.truthy(queryCommitted, `queryCommitted truthy OK`);

    // FIXME - without this wait it randomly fails with an error claiming that
    // the endorsement was impossible to be obtained. The fabric-samples script
    // does the same thing, it just waits 10 seconds for good measure so there
    // might not be a way for us to avoid doing this, but if there is a way we
    // absolutely should not have timeouts like this, anywhere...
    await new Promise((resolve) => setTimeout(resolve, 10000));

    const assetId = uuidv4();

    // CreateAsset(id string, color string, size int, owner string, appraisedValue int)
    await fabricApiClient.runTransactionV1({
      contractName,
      channelName,
      params: [assetId, "9999"],
      methodName: "CreateAssetReference",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });

    await fabricApiClient.runTransactionV1({
      contractName,
      channelName,
      params: [assetId],
      methodName: "ReadAssetReference",
      invocationType: FabricContractInvocationType.Call,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });
  }

  public async deployFabricCbdcContract(
    fabricApiClient: FabricApi,
  ): Promise<void> {
    const channelId = "mychannel";
    const channelName = channelId;

    const contractName = "cbdc-erc20";

    const contractRelPath = "../../../fabric-contracts/cbdc-erc-20/javascript";
    const contractDir = path.join(__dirname, contractRelPath);

    // ├── package.json
    // ├── src
    // │   ├── assetTransfer.ts
    // │   ├── asset.ts
    // │   └── index.ts
    // ├── tsconfig.json
    // └── tslint.json
    const sourceFiles: FileBase64[] = [];
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
      const filename = "./index.js";
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
      const filename = "./tokenERC20.js";
      const relativePath = "./lib/";
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
      ccVersion: "1.0.0",
      // constructorArgs: { Args: ["john", "99"] },
      sourceFiles,
      ccName: contractName,
      targetOrganizations: [this.org1Env, this.org2Env],
      caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
      ccLabel: "cbdc-erc20",
      ccLang: ChainCodeProgrammingLanguage.Javascript,
      ccSequence: 1,
      orderer: "orderer.example.com:7050",
      ordererTLSHostnameOverride: "orderer.example.com",
      connTimeout: 60,
    });

    const { packageIds, lifecycle } = res.data;

    const {
      approveForMyOrgList,
      installList,
      queryInstalledList,
      commit,
      packaging,
      queryCommitted,
    } = lifecycle;

    Checks.truthy(packageIds, `packageIds truthy OK`);
    Checks.truthy(
      Array.isArray(packageIds),
      `Array.isArray(packageIds) truthy OK`,
    );
    Checks.truthy(approveForMyOrgList, `approveForMyOrgList truthy OK`);
    Checks.truthy(
      Array.isArray(approveForMyOrgList),
      `Array.isArray(approveForMyOrgList) truthy OK`,
    );
    Checks.truthy(installList, `installList truthy OK`);
    Checks.truthy(
      Array.isArray(installList),
      `Array.isArray(installList) truthy OK`,
    );
    Checks.truthy(queryInstalledList, `queryInstalledList truthy OK`);
    Checks.truthy(
      Array.isArray(queryInstalledList),
      `Array.isArray(queryInstalledList) truthy OK`,
    );
    Checks.truthy(commit, `commit truthy OK`);
    Checks.truthy(packaging, `packaging truthy OK`);
    Checks.truthy(queryCommitted, `queryCommitted truthy OK`);

    // FIXME - without this wait it randomly fails with an error claiming that
    // the endorsement was impossible to be obtained. The fabric-samples script
    // does the same thing, it just waits 10 seconds for good measure so there
    // might not be a way for us to avoid doing this, but if there is a way we
    // absolutely should not have timeouts like this, anywhere...
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // CreateAsset(id string, color string, size int, owner string, appraisedValue int)
    await fabricApiClient.runTransactionV1({
      contractName,
      channelName,
      params: ["name1", "symbol1", "8"],
      methodName: "Initialize",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });

    await fabricApiClient.runTransactionV1({
      contractName,
      channelName,
      params: ["500"],
      methodName: "Mint",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));

    await fabricApiClient.runTransactionV1({
      contractName: contractName,
      channelName,
      params: [],
      methodName: "ClientAccountID",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });

    await fabricApiClient.runTransactionV1({
      contractName,
      channelName,
      params: [],
      methodName: "ClientAccountBalance",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });

    const recipient =
      "x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=recipient::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com";

    await fabricApiClient.runTransactionV1({
      contractName,
      channelName,
      params: [recipient, "100", this.fabricAssetId],
      methodName: "Escrow",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });

    await fabricApiClient.runTransactionV1({
      contractName: "asset-reference-contract",
      channelName,
      params: [this.fabricAssetId],
      methodName: "ReadAssetReference",
      invocationType: FabricContractInvocationType.Call,
      signingCredential: {
        keychainId: this.apiServer1Keychain.getKeychainId(),
        keychainRef: "user2",
      },
    });
  }

  public async deployBesuContracts(besuApiClient: BesuApi): Promise<void> {
    const deployCbdcContractResponse = await besuApiClient.deployContractSolBytecodeV1(
      {
        keychainId: this.apiServer2Keychain.getKeychainId(),
        contractName: CBDCcontractJson.contractName,
        contractAbi: CBDCcontractJson.abi,
        constructorArgs: [],
        web3SigningCredential: this.besuWeb3SigningCredential,
        bytecode: CBDCcontractJson.bytecode,
        gas: 1000000,
      } as DeployContractSolidityBytecodeV1Request,
    );

    expect(deployCbdcContractResponse).not.toBeUndefined();
    expect(
      deployCbdcContractResponse.data.transactionReceipt,
    ).not.toBeUndefined();
    expect(
      deployCbdcContractResponse.data.transactionReceipt.contractAddress,
    ).not.toBeUndefined();

    const deployAssetReferenceContractResponse = await besuApiClient.deployContractSolBytecodeV1(
      {
        keychainId: this.apiServer2Keychain.getKeychainId(),
        contractName: AssetReferenceContractJson.contractName,
        contractAbi: AssetReferenceContractJson.abi,
        constructorArgs: [
          deployCbdcContractResponse.data.transactionReceipt.contractAddress,
        ],
        web3SigningCredential: this.besuWeb3SigningCredential,
        bytecode: AssetReferenceContractJson.bytecode,
        gas: 1000000,
      } as DeployContractSolidityBytecodeV1Request,
    );

    expect(deployAssetReferenceContractResponse).not.toBeUndefined();
    expect(
      deployAssetReferenceContractResponse.data.transactionReceipt,
    ).not.toBeUndefined();
    expect(
      deployAssetReferenceContractResponse.data.transactionReceipt
        .contractAddress,
    ).not.toBeUndefined();
  }
}
