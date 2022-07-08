import { AddressInfo } from "net";
import { Server } from "http";
import { Server as SecureServer } from "https";
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
  // Configuration,
  ICactusApiServerOptions,
} from "@hyperledger/cactus-cmd-api-server";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { CbdcBridgingAppDummyInfrastructure } from "./infrastructure/cbdc-bridging-app-dummy-infrastructure";
// import {
//   DefaultApi as FabricApi,
//   FabricSigningCredential,
// } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
// import { DefaultApi as BesuApi } from "@hyperledger/cactus-plugin-ledger-connector-besu";
// import { PluginOdapGateway } from "../../../../../packages/cactus-plugin-odap-hermes/src/main/typescript/gateway/plugin-odap-gateway";
// import { knexClientConnection, knexServerConnection } from "./knex.config";

export interface ICbdcBridgingApp {
  logLevel?: LogLevelDesc;
  keychainId?: string;
  keychain?: PluginKeychainMemory;
  apiServerOptions?: ICactusApiServerOptions;
  httpApi?: Server | SecureServer;
  httpGui?: Server | SecureServer;
  disableSignalHandlers?: true;
}

export type ShutdownHook = () => Promise<void>;
export class CbdcBridgingApp {
  private readonly log: Logger;
  private readonly shutdownHooks: ShutdownHook[];
  private readonly infrastructure: CbdcBridgingAppDummyInfrastructure;
  private readonly keychainId: string;
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

    this.keychainId = options.keychainId || uuidv4();

    this.shutdownHooks = [];
    this.keychain =
      options.keychain ||
      new PluginKeychainMemory({
        keychainId: this.keychainId,
        instanceId: uuidv4(),
        logLevel: logLevel || "INFO",
      });
    this.log.info("KeychainID=%o", this.keychain.getKeychainId());

    this.infrastructure = new CbdcBridgingAppDummyInfrastructure({
      logLevel: logLevel || "INFO",
      keychain: this.keychain,
    });
  }

  public async start(): Promise<void> {
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

    await this.infrastructure.deployFabricContracts(fabricPlugin);

    let httpApi;
    if (this.options.httpApi) {
      httpApi = this.options.httpApi;
    } else {
      httpApi = await Servers.startOnPort(4000, "0.0.0.0");
    }

    let httpGui;
    if (this.options.httpGui) {
      httpGui = this.options.httpGui;
    } else {
      httpGui = await Servers.startOnPort(3000, "0.0.0.0");
    }

    const addressInfo = httpApi.address() as AddressInfo;
    const nodeApiHost = `http://localhost:${addressInfo.port}`;

    // const config = new Configuration({ basePath: nodeApiHost });

    // const besuApiClient = new BesuApi(config);
    // const fabricApiClient = new FabricApi(config);

    const odapClientPlugin = await this.infrastructure.createClientGateway(
      nodeApiHost,
    );

    const odapServerPlugin = await this.infrastructure.createServerGateway(
      nodeApiHost,
    );

    const pluginRegistry = new PluginRegistry({ plugins: [this.keychain] });

    pluginRegistry.add(besuPlugin);
    pluginRegistry.add(fabricPlugin);
    pluginRegistry.add(odapClientPlugin);
    pluginRegistry.add(odapServerPlugin);

    await this.startNode(httpApi, httpGui, pluginRegistry);
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
    this.log.info(`Starting Cactus node...`);

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
