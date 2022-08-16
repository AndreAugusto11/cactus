import { AddressInfo } from "net";
import { Server } from "http";
import exitHook, { IAsyncExitHookDoneCallback } from "async-exit-hook";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  Servers,
} from "@hyperledger/cactus-common";
import {
  ApiServer,
  AuthorizationProtocol,
  ConfigService,
  ICactusApiServerOptions,
} from "@hyperledger/cactus-cmd-api-server";
import {
  Configuration,
  DefaultApi as OdapApi,
} from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript/index";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { CbdcBridgingAppDummyInfrastructure } from "./infrastructure/cbdc-bridging-app-dummy-infrastructure";
import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { DefaultApi as BesuApi } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { IOdapPluginKeyPair } from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript/gateway/plugin-odap-gateway";
import { DefaultApi as IpfsApi } from "@hyperledger/cactus-plugin-object-store-ipfs";
import { FabricOdapGateway } from "./odap-extension/fabric-odap-gateway";
import { BesuOdapGateway } from "./odap-extension/besu-odap-gateway";

export interface ICbdcBridgingApp {
  apiHost: string;
  apiServer1Port: number;
  apiServer2Port: number;
  clientGatewayKeyPair: IOdapPluginKeyPair;
  serverGatewayKeyPair: IOdapPluginKeyPair;
  apiServer1Keychain: PluginKeychainMemory;
  apiServer2Keychain: PluginKeychainMemory;
  logLevel?: LogLevelDesc;
  apiServerOptions?: ICactusApiServerOptions;
  disableSignalHandlers?: true;
}

export type ShutdownHook = () => Promise<void>;
export class CbdcBridgingApp {
  private readonly log: Logger;
  private readonly shutdownHooks: ShutdownHook[];
  readonly infrastructure: CbdcBridgingAppDummyInfrastructure;
  private readonly apiServer1Keychain: PluginKeychainMemory;
  private readonly apiServer2Keychain: PluginKeychainMemory;

  public constructor(public readonly options: ICbdcBridgingApp) {
    const fnTag = "CbdcBridgingApp#constructor()";

    if (!options) {
      throw new Error(`${fnTag} options parameter is falsy`);
    }
    const { logLevel } = options;

    const level = logLevel || "INFO";
    const label = "cbdc-bridging-app";
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.shutdownHooks = [];

    this.apiServer1Keychain = options.apiServer1Keychain;
    this.apiServer2Keychain = options.apiServer2Keychain;
    this.log.info("Keychain1ID=%o", this.apiServer1Keychain.getKeychainId());
    this.log.info("Keychain2ID=%o", this.apiServer2Keychain.getKeychainId());

    this.infrastructure = new CbdcBridgingAppDummyInfrastructure({
      logLevel: logLevel || "INFO",
      apiServer1Keychain: this.apiServer1Keychain,
      apiServer2Keychain: this.apiServer2Keychain,
    });
  }

  public async start(): Promise<IStartInfo> {
    this.log.debug(`Starting CBDC Bridging App...`);

    if (!this.options.disableSignalHandlers) {
      exitHook((callback: IAsyncExitHookDoneCallback) => {
        this.stop().then(callback);
      });
      this.log.debug(`Registered signal handlers for graceful auto-shutdown`);
    }

    await this.infrastructure.start();
    this.onShutdown(() => this.infrastructure.stop());

    const fabricPlugin = await this.infrastructure.createFabricLedgerConnector();
    const besuPlugin = await this.infrastructure.createBesuLedgerConnector();
    const clientIpfsPlugin = await this.infrastructure.createIPFSConnector();
    const serverIpfsPlugin = await this.infrastructure.createIPFSConnector();

    // Reserve the ports where the API Servers will run
    const httpApiA = await Servers.startOnPort(
      this.options.apiServer1Port,
      this.options.apiHost,
    );
    const httpApiB = await Servers.startOnPort(
      this.options.apiServer2Port,
      this.options.apiHost,
    );
    const httpGuiA = await Servers.startOnPort(3000, this.options.apiHost);
    const httpGuiB = await Servers.startOnPort(3100, this.options.apiHost);

    const addressInfoA = httpApiA.address() as AddressInfo;
    const nodeApiHostA = `http://${this.options.apiHost}:${addressInfoA.port}`;

    const addressInfoB = httpApiB.address() as AddressInfo;
    const nodeApiHostB = `http://${this.options.apiHost}:${addressInfoB.port}`;

    const fabricOdapGateway = await this.infrastructure.createClientGateway(
      nodeApiHostA,
      this.options.clientGatewayKeyPair,
      `http://${this.options.apiHost}:${addressInfoA.port}`,
    );

    const besuOdapGateway = await this.infrastructure.createServerGateway(
      nodeApiHostB,
      this.options.serverGatewayKeyPair,
      `http://${this.options.apiHost}:${addressInfoB.port}`,
    );

    const clientPluginRegistry = new PluginRegistry({
      plugins: [this.apiServer1Keychain],
    });
    const serverPluginRegistry = new PluginRegistry({
      plugins: [this.apiServer2Keychain],
    });

    clientPluginRegistry.add(fabricPlugin);
    clientPluginRegistry.add(fabricOdapGateway);
    clientPluginRegistry.add(clientIpfsPlugin);

    serverPluginRegistry.add(besuPlugin);
    serverPluginRegistry.add(serverIpfsPlugin);
    serverPluginRegistry.add(besuOdapGateway);

    const apiServer1 = await this.startNode(
      httpApiA,
      httpGuiA,
      clientPluginRegistry,
    );
    const apiServer2 = await this.startNode(
      httpApiB,
      httpGuiB,
      serverPluginRegistry,
    );

    const fabricApiClient = new FabricApi(
      new Configuration({ basePath: nodeApiHostA }),
    );

    const besuApiClient = new BesuApi(
      new Configuration({ basePath: nodeApiHostB }),
    );

    this.log.info("Deploying chaincode and smart contracts...");

    // await initializeAddresses(nodeApiHostB);

    // FIXME - without this wait it randomly fails with an error claiming that
    // the endorsement was impossible to be obtained. The fabric-samples script
    // does the same thing, it just waits 10 seconds for good measure so there
    // might not be a way for us to avoid doing this, but if there is a way we
    // absolutely should not have timeouts like this, anywhere...
    await new Promise((resolve) => setTimeout(resolve, 10000));

    await this.infrastructure.deployFabricCbdcContract(fabricApiClient);

    await this.infrastructure.deployFabricAssetReferenceContract(
      fabricApiClient,
    );

    await this.infrastructure.deployBesuContracts(besuApiClient);

    return {
      apiServer1,
      apiServer2,
      fabricGatewayApi: new OdapApi(
        new Configuration({ basePath: nodeApiHostA }),
      ),
      besuGatewayApi: new OdapApi(
        new Configuration({ basePath: nodeApiHostB }),
      ),
      ipfsApiClient: new IpfsApi(new Configuration({ basePath: nodeApiHostA })),
      fabricApiClient,
      besuApiClient,
      fabricOdapGateway,
      besuOdapGateway,
    };
  }

  public async stop(): Promise<void> {
    for (const hook of this.shutdownHooks) {
      await hook(); // FIXME add timeout here so that shutdown does not hang
    }
  }

  public onShutdown(hook: ShutdownHook): void {
    this.shutdownHooks.push(hook);
  }

  public async startNode(
    httpServerApi: Server,
    httpServerCockpit: Server,
    pluginRegistry: PluginRegistry,
  ): Promise<ApiServer> {
    this.log.info(`Starting API Server node...`);

    const addressInfoApi = httpServerApi.address() as AddressInfo;
    const addressInfoCockpit = httpServerCockpit.address() as AddressInfo;

    let config;
    if (this.options.apiServerOptions) {
      config = this.options.apiServerOptions;
    } else {
      const configService = new ConfigService();
      const convictConfig = await configService.getOrCreate();
      config = convictConfig.getProperties();
      config.plugins = [];
      config.configFile = "";
      config.apiPort = addressInfoApi.port;
      config.apiHost = addressInfoApi.address;
      config.cockpitHost = addressInfoCockpit.address;
      config.cockpitPort = addressInfoCockpit.port;
      config.grpcPort = 0; // TODO - make this configurable as well
      config.logLevel = this.options.logLevel || "INFO";
      config.authorizationProtocol = AuthorizationProtocol.NONE;
    }

    const apiServer = new ApiServer({
      config,
      httpServerApi,
      httpServerCockpit,
      pluginRegistry,
    });

    this.onShutdown(() => apiServer.shutdown());

    await apiServer.start();

    return apiServer;
  }
}

export interface IStartInfo {
  readonly apiServer1: ApiServer;
  readonly apiServer2: ApiServer;
  readonly fabricGatewayApi: OdapApi;
  readonly besuGatewayApi: OdapApi;
  readonly ipfsApiClient: IpfsApi;
  readonly besuApiClient: BesuApi;
  readonly fabricApiClient: FabricApi;
  readonly fabricOdapGateway: FabricOdapGateway;
  readonly besuOdapGateway: BesuOdapGateway;
}
