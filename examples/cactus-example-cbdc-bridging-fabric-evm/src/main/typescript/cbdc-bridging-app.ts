import { AddressInfo } from "net";
import { Server } from "http";
import { v4 as uuidv4 } from "uuid";
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
} from "../../../../../packages/cactus-plugin-odap-hermes/src/main/typescript/index";
//import { DefaultApi as OdapApi } from "@hyperledger/cactus-plugin-odap-hermes";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { CbdcBridgingAppDummyInfrastructure } from "./infrastructure/cbdc-bridging-app-dummy-infrastructure";
import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { DefaultApi as BesuApi } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { IOdapGatewayKeyPairs } from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript/gateway/plugin-odap-gateway";
// import { DefaultApi as IpfsApi } from "@hyperledger/cactus-plugin-object-store-ipfs";

export interface ICbdcBridgingApp {
  apiHost: string;
  clientGatewayApiPort: number;
  serverGatewayApiPort: number;
  ipfsApiPort: number;
  clientGatewayKeyPair: IOdapGatewayKeyPairs;
  serverGatewayKeyPair: IOdapGatewayKeyPairs;
  logLevel?: LogLevelDesc;
  apiServerOptions?: ICactusApiServerOptions;
  disableSignalHandlers?: true;
}

export type ShutdownHook = () => Promise<void>;
export class CbdcBridgingApp {
  private readonly log: Logger;
  private readonly shutdownHooks: ShutdownHook[];
  readonly infrastructure: CbdcBridgingAppDummyInfrastructure;
  private readonly keychain: PluginKeychainMemory;

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
    this.keychain = new PluginKeychainMemory({
      keychainId: uuidv4(),
      instanceId: uuidv4(),
      logLevel: logLevel || "INFO",
    });
    this.log.info("KeychainID=%o", this.keychain.getKeychainId());

    this.infrastructure = new CbdcBridgingAppDummyInfrastructure({
      logLevel: logLevel || "INFO",
      keychain: this.keychain,
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
      this.options.clientGatewayApiPort,
      this.options.apiHost,
    );
    const httpApiB = await Servers.startOnPort(
      this.options.serverGatewayApiPort,
      this.options.apiHost,
    );
    const httpGuiA = await Servers.startOnPort(3000, this.options.apiHost);
    const httpGuiB = await Servers.startOnPort(3100, this.options.apiHost);

    const addressInfoA = httpApiA.address() as AddressInfo;
    const nodeApiHostA = `http://${this.options.apiHost}:${addressInfoA.port}`;

    const addressInfoB = httpApiB.address() as AddressInfo;
    const nodeApiHostB = `http://${this.options.apiHost}:${addressInfoB.port}`;

    const odapClientPlugin = await this.infrastructure.createClientGateway(
      nodeApiHostA,
      this.options.clientGatewayKeyPair,
    );

    const odapServerPlugin = await this.infrastructure.createServerGateway(
      nodeApiHostB,
      this.options.serverGatewayKeyPair,
    );

    const clientPluginRegistry = new PluginRegistry({
      plugins: [this.keychain],
    });
    const serverPluginRegistry = new PluginRegistry({
      plugins: [this.keychain],
    });

    clientPluginRegistry.add(fabricPlugin);
    clientPluginRegistry.add(odapClientPlugin);
    clientPluginRegistry.add(clientIpfsPlugin);

    serverPluginRegistry.add(besuPlugin);
    serverPluginRegistry.add(serverIpfsPlugin);
    serverPluginRegistry.add(odapServerPlugin);

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

    await this.infrastructure.deployFabricContracts(fabricApiClient);
    await this.infrastructure.createFabricAsset(fabricApiClient);
    await this.infrastructure.deployBesuSmartContract(besuPlugin);

    return {
      apiServer1,
      apiServer2,
      odapClientApi: new OdapApi(new Configuration({ basePath: nodeApiHostA })),
      odapServerApi: new OdapApi(new Configuration({ basePath: nodeApiHostB })),
      // ipfsApiClient: new IpfsApi(new Configuration({ basePath: nodeApiHostA})),
      fabricApiClient,
      besuApiClient,
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
  readonly odapClientApi: OdapApi;
  readonly odapServerApi: OdapApi;
  // readonly ipfsApiClient: IpfsApi,
  readonly besuApiClient: BesuApi;
  readonly fabricApiClient: FabricApi;
}
