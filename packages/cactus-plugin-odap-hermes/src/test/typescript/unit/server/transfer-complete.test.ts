import {
  IPluginOdapGatewayConstructorOptions,
  OdapMessageType,
  PluginOdapGateway,
} from "../../../../main/typescript/gateway/plugin-odap-gateway";
import {
  SessionData,
  TransferCompleteV1Request,
} from "../../../../main/typescript/generated/openapi/typescript-axios/api";
import { v4 as uuidV4 } from "uuid";
import { SHA256 } from "crypto-js";
import { randomInt } from "crypto";
import { BesuOdapGateway } from "../../../../main/typescript/gateway/besu-odap-gateway";
import { FabricOdapGateway } from "../../../../main/typescript/gateway/fabric-odap-gateway";
import { ClientGatewayHelper } from "../../../../main/typescript/gateway/client/client-helper";
import { ServerGatewayHelper } from "../../../../main/typescript/gateway/server/server-helper";
import { knexRemoteConnection } from "../../knex.config";

let pluginSourceGateway: PluginOdapGateway;
let pluginRecipientGateway: PluginOdapGateway;
let dummyCommitFinalResponseMessageHash: string;
let dummyTransferCommenceResponseMessageHash: string;
let sessionData: SessionData;
let sessionID: string;
let sequenceNumber: number;

beforeEach(async () => {
  const sourceGatewayConstructor = {
    name: "plugin-odap-gateway#sourceGateway",
    dltIDs: ["DLT2"],
    instanceId: uuidV4(),
    clientHelper: new ClientGatewayHelper(),
    serverHelper: new ServerGatewayHelper(),
    knexRemoteConfig: knexRemoteConnection
  };
  const recipientGatewayConstructor = {
    name: "plugin-odap-gateway#recipientGateway",
    dltIDs: ["DLT1"],
    instanceId: uuidV4(),
    clientHelper: new ClientGatewayHelper(),
    serverHelper: new ServerGatewayHelper(),
    knexRemoteConfig: knexRemoteConnection
  };

  pluginSourceGateway = new FabricOdapGateway(sourceGatewayConstructor);
  pluginRecipientGateway = new BesuOdapGateway(recipientGatewayConstructor);

  if (
    pluginSourceGateway.localRepository?.database == undefined ||
    pluginRecipientGateway.localRepository?.database == undefined
  ) {
    throw new Error("Database is not correctly initialized");
  }

  await pluginSourceGateway.localRepository?.reset();
  await pluginRecipientGateway.localRepository?.reset();

  dummyCommitFinalResponseMessageHash = SHA256(
    "commitFinalResponseMessageData",
  ).toString();

  dummyTransferCommenceResponseMessageHash = SHA256(
    "transferCommenceResponseMessageData",
  ).toString();

  sessionID = uuidV4();
  sequenceNumber = randomInt(100);

  sessionData = {
    id: sessionID,
    sourceGatewayPubkey: pluginSourceGateway.pubKey,
    recipientGatewayPubkey: pluginRecipientGateway.pubKey,
    commitFinalResponseMessageHash: dummyCommitFinalResponseMessageHash,
    transferCommenceMessageRequestHash:
      dummyTransferCommenceResponseMessageHash,
    step: 2,
    lastSequenceNumber: sequenceNumber,
    maxTimeout: 0,
    maxRetries: 0,
    rollbackProofs: [],
    sourceBasePath: "",
    recipientBasePath: "",
    rollbackActionsPerformed: [],
  };

  pluginSourceGateway.sessions.set(sessionID, sessionData);
  pluginRecipientGateway.sessions.set(sessionID, sessionData);
});

test("dummy test for transfer complete flow", async () => {
  const transferCompleteRequestMessage: TransferCompleteV1Request = {
    sessionID: sessionID,
    messageType: OdapMessageType.TransferCompleteRequest,
    clientIdentityPubkey: pluginSourceGateway.pubKey,
    serverIdentityPubkey: pluginRecipientGateway.pubKey,
    signature: "",
    hashTransferCommence: dummyTransferCommenceResponseMessageHash,
    hashCommitFinalAck: dummyCommitFinalResponseMessageHash,
    sequenceNumber: sequenceNumber + 1,
  };

  transferCompleteRequestMessage.signature = PluginOdapGateway.bufArray2HexStr(
    pluginSourceGateway.sign(JSON.stringify(transferCompleteRequestMessage)),
  );

  await pluginRecipientGateway.serverHelper
    .checkValidTransferCompleteRequest(
      transferCompleteRequestMessage,
      pluginRecipientGateway,
    )
});

afterEach(() => {
  pluginSourceGateway.localRepository?.destroy()
  pluginRecipientGateway.localRepository?.destroy()
  pluginSourceGateway.remoteRepository?.destroy()
  pluginRecipientGateway.remoteRepository?.destroy()
});
