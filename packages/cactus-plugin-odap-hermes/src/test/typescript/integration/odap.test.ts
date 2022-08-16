import http, { Server } from "http";
import type { AddressInfo } from "net";
import { v4 as uuidv4 } from "uuid";
import "jest-extended";
import { PluginObjectStoreIpfs } from "@hyperledger/cactus-plugin-object-store-ipfs";
import { create } from "ipfs-http-client";
import bodyParser from "body-parser";
import express from "express";
import { DefaultApi as ObjectStoreIpfsApi } from "@hyperledger/cactus-plugin-object-store-ipfs";
import {
  IListenOptions,
  LogLevelDesc,
  Servers,
} from "@hyperledger/cactus-common";
import { v4 as uuidV4 } from "uuid";
import { Configuration } from "@hyperledger/cactus-core-api";
import { PluginOdapGateway } from "../../../main/typescript/gateway/plugin-odap-gateway";
import { GoIpfsTestContainer } from "@hyperledger/cactus-test-tooling";
import {
  AssetProfile,
  ClientV1Request,
} from "../../../main/typescript/public-api";
import { makeSessionDataChecks } from "../make-checks";

import { BesuOdapGateway } from "../gateways/besu-odap-gateway";
import { FabricOdapGateway } from "../../../main/typescript/gateway/fabric-odap-gateway";
import { ClientGatewayHelper } from "../../../main/typescript/gateway/client/client-helper";
import { ServerGatewayHelper } from "../../../main/typescript/gateway/server/server-helper";

const MAX_RETRIES = 5;
const MAX_TIMEOUT = 5000;

const logLevel: LogLevelDesc = "INFO";

let pluginSourceGateway: PluginOdapGateway;
let pluginRecipientGateway: PluginOdapGateway;

let ipfsContainer: GoIpfsTestContainer;
let ipfsServer: Server;
let ipfsApiHost: string;

beforeAll(async () => {
  ipfsContainer = new GoIpfsTestContainer({ logLevel });
  expect(ipfsContainer).not.toBeUndefined();

  const container = await ipfsContainer.start();
  expect(container).not.toBeUndefined();

  const expressApp = express();
  expressApp.use(bodyParser.json({ limit: "250mb" }));
  ipfsServer = http.createServer(expressApp);
  const listenOptions: IListenOptions = {
    hostname: "localhost",
    port: 0,
    server: ipfsServer,
  };

  const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
  const { address, port } = addressInfo;
  ipfsApiHost = `http://${address}:${port}`;

  const config = new Configuration({ basePath: ipfsApiHost });
  const apiClient = new ObjectStoreIpfsApi(config);

  expect(apiClient).not.toBeUndefined();

  const ipfsApiUrl = await ipfsContainer.getApiUrl();

  const ipfsClientOrOptions = create({
    url: ipfsApiUrl,
  });

  const instanceId = uuidv4();
  const pluginIpfs = new PluginObjectStoreIpfs({
    parentDir: `/${uuidv4()}/${uuidv4()}/`,
    logLevel,
    instanceId,
    ipfsClientOrOptions,
  });

  await pluginIpfs.getOrCreateWebServices();
  await pluginIpfs.registerWebServices(expressApp);
});

test("successful run ODAP instance", async () => {
  const sourceGatewayConstructor = {
    name: "plugin-odap-gateway#sourceGateway",
    dltIDs: ["DLT2"],
    instanceId: uuidV4(),
    ipfsPath: ipfsApiHost,
    clientHelper: new ClientGatewayHelper(),
    serverHelper: new ServerGatewayHelper(),
  };
  const recipientGatewayConstructor = {
    name: "plugin-odap-gateway#recipientGateway",
    dltIDs: ["DLT1"],
    instanceId: uuidV4(),
    ipfsPath: ipfsApiHost,
    clientHelper: new ClientGatewayHelper(),
    serverHelper: new ServerGatewayHelper(),
  };

  pluginSourceGateway = new FabricOdapGateway(sourceGatewayConstructor);
  pluginRecipientGateway = new BesuOdapGateway(recipientGatewayConstructor);

  expect(pluginSourceGateway.database).not.toBeUndefined();
  expect(pluginRecipientGateway.database).not.toBeUndefined();

  await pluginSourceGateway.database?.migrate.rollback();
  await pluginSourceGateway.database?.migrate.latest();
  await pluginRecipientGateway.database?.migrate.rollback();
  await pluginRecipientGateway.database?.migrate.latest();

  const dummyPath = { apiHost: "dummyPath" };

  const expiryDate = new Date(2060, 11, 24).toString();
  const assetProfile: AssetProfile = { expirationDate: expiryDate };

  const odapClientRequest: ClientV1Request = {
    clientGatewayConfiguration: dummyPath,
    serverGatewayConfiguration: dummyPath,
    version: "0.0.0",
    loggingProfile: "dummyLoggingProfile",
    accessControlProfile: "dummyAccessControlProfile",
    applicationProfile: "dummyApplicationProfile",
    payloadProfile: {
      assetProfile: assetProfile,
      capabilities: "",
    },
    assetProfile: assetProfile,
    assetControlProfile: "dummyAssetControlProfile",
    beneficiaryPubkey: "dummyPubKey",
    clientDltSystem: "DLT1",
    originatorPubkey: "dummyPubKey",
    recipientGatewayDltSystem: "DLT2",
    recipientGatewayPubkey: pluginRecipientGateway.pubKey,
    serverDltSystem: "DLT2",
    sourceGatewayDltSystem: "DLT1",
    clientIdentityPubkey: "",
    serverIdentityPubkey: "",
    maxRetries: MAX_RETRIES,
    maxTimeout: MAX_TIMEOUT,
    sourceLedgerAssetID: uuidV4(),
    recipientLedgerAssetID: uuidV4(),
  };

  const sessionID = pluginSourceGateway.configureOdapSession(odapClientRequest);

  const transferInitializationRequest = await ClientGatewayHelper.sendTransferInitializationRequest(
    sessionID,
    pluginSourceGateway,
    false,
  );

  if (transferInitializationRequest == void 0) {
    expect(false);
    return;
  }

  await ServerGatewayHelper.checkValidInitializationRequest(
    transferInitializationRequest,
    pluginRecipientGateway,
  );

  const transferInitializationResponse = await ServerGatewayHelper.sendTransferInitializationResponse(
    transferInitializationRequest.sessionID,
    pluginRecipientGateway,
    false,
  );

  if (transferInitializationResponse == void 0) {
    expect(false);
    return;
  }

  await ClientGatewayHelper.checkValidInitializationResponse(
    transferInitializationResponse,
    pluginSourceGateway,
  );

  const transferCommenceRequest = await ClientGatewayHelper.sendTransferCommenceRequest(
    sessionID,
    pluginSourceGateway,
    false,
  );

  if (transferCommenceRequest == void 0) {
    expect(false);
    return;
  }

  await ServerGatewayHelper.checkValidtransferCommenceRequest(
    transferCommenceRequest,
    pluginRecipientGateway,
  );

  const transferCommenceResponse = await ServerGatewayHelper.sendTransferCommenceResponse(
    transferCommenceRequest.sessionID,
    pluginRecipientGateway,
    false,
  );

  if (transferCommenceResponse == void 0) {
    expect(false);
    return;
  }

  await ClientGatewayHelper.checkValidTransferCommenceResponse(
    transferCommenceResponse,
    pluginSourceGateway,
  );

  await pluginSourceGateway.lockAsset(sessionID);

  const lockEvidenceRequest = await ClientGatewayHelper.sendLockEvidenceRequest(
    sessionID,
    pluginSourceGateway,
    false,
  );

  if (lockEvidenceRequest == void 0) {
    expect(false);
    return;
  }

  await ServerGatewayHelper.checkValidLockEvidenceRequest(
    lockEvidenceRequest,
    pluginRecipientGateway,
  );

  const lockEvidenceResponse = await ServerGatewayHelper.sendLockEvidenceResponse(
    lockEvidenceRequest.sessionID,
    pluginRecipientGateway,
    false,
  );

  if (lockEvidenceResponse == void 0) {
    expect(false);
    return;
  }

  await ClientGatewayHelper.checkValidLockEvidenceResponse(
    lockEvidenceResponse,
    pluginSourceGateway,
  );

  const commitPreparationRequest = await ClientGatewayHelper.sendCommitPreparationRequest(
    sessionID,
    pluginSourceGateway,
    false,
  );

  if (commitPreparationRequest == void 0) {
    expect(false);
    return;
  }

  await ServerGatewayHelper.checkValidCommitPreparationRequest(
    commitPreparationRequest,
    pluginRecipientGateway,
  );

  const commitPreparationResponse = await ServerGatewayHelper.sendCommitPreparationResponse(
    lockEvidenceRequest.sessionID,
    pluginRecipientGateway,
    false,
  );

  if (commitPreparationResponse == void 0) {
    expect(false);
    return;
  }

  await ClientGatewayHelper.checkValidCommitPreparationResponse(
    commitPreparationResponse,
    pluginSourceGateway,
  );

  await pluginSourceGateway.deleteAsset(sessionID);

  const commitFinalRequest = await ClientGatewayHelper.sendCommitFinalRequest(
    sessionID,
    pluginSourceGateway,
    false,
  );

  if (commitFinalRequest == void 0) {
    expect(false);
    return;
  }

  await ServerGatewayHelper.checkValidCommitFinalRequest(
    commitFinalRequest,
    pluginRecipientGateway,
  );

  await pluginRecipientGateway.createAsset(sessionID);

  const commitFinalResponse = await ServerGatewayHelper.sendCommitFinalResponse(
    lockEvidenceRequest.sessionID,
    pluginRecipientGateway,
    false,
  );

  if (commitFinalResponse == void 0) {
    expect(false);
    return;
  }

  await ClientGatewayHelper.checkValidCommitFinalResponse(
    commitFinalResponse,
    pluginSourceGateway,
  );

  const transferCompleteRequest = await ClientGatewayHelper.sendTransferCompleteRequest(
    sessionID,
    pluginSourceGateway,
    false,
  );

  if (transferCompleteRequest == void 0) {
    expect(false);
    return;
  }

  await ServerGatewayHelper.checkValidTransferCompleteRequest(
    transferCompleteRequest,
    pluginRecipientGateway,
  );

  expect(pluginSourceGateway.sessions.size).toBe(1);
  expect(pluginRecipientGateway.sessions.size).toBe(1);

  const [sessionId] = pluginSourceGateway.sessions.keys();

  await makeSessionDataChecks(
    pluginSourceGateway,
    pluginRecipientGateway,
    sessionId,
  );
});

afterAll(async () => {
  await ipfsContainer.stop();
  await ipfsContainer.destroy();
  await Servers.shutdown(ipfsServer);
  pluginSourceGateway.database?.destroy();
  pluginRecipientGateway.database?.destroy();
});
