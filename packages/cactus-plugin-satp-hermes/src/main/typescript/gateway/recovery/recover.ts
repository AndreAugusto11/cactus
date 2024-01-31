import { RecoverV1Message } from "../../generated/openapi/typescript-axios";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { PluginSatpGateway } from "../plugin-satp-gateway";

const log = LoggerProvider.getOrCreate({
  level: "INFO",
  label: "recover-helper",
});

export async function sendRecoverMessage(
  sessionID: string,
  satp: PluginSatpGateway,
  backup: boolean,
  remote: boolean,
): Promise<void | RecoverV1Message> {
  const fnTag = `${satp.className}#sendRecoverMessage()`;

  const sessionData = satp.sessions.get(sessionID);

  if (
    sessionData == undefined ||
    sessionData.maxTimeout == undefined ||
    sessionData.maxRetries == undefined ||
    sessionData.sourceBasePath == undefined ||
    sessionData.recipientBasePath == undefined ||
    sessionData.lastSequenceNumber == undefined ||
    sessionData.lastLogEntryTimestamp == undefined
  ) {
    throw new Error(`${fnTag}, session data is not correctly initialized`);
  }

  const recoverMessage: RecoverV1Message = {
    sessionID: sessionID,
    satpPhase: "sessionData.satpPhase",
    sequenceNumber: sessionData.lastSequenceNumber,
    lastLogEntryTimestamp: sessionData.lastLogEntryTimestamp,
    isBackup: backup,
    newBasePath: "",
    newGatewayPubKey: sessionData.sourceGatewayPubkey,
    signature: "",
  };

  const signature = PluginSatpGateway.bufArray2HexStr(
    satp.sign(JSON.stringify(recoverMessage)),
  );

  recoverMessage.signature = signature;

  log.info(`${fnTag}, sending Recover message...`);

  if (!remote) {
    return recoverMessage;
  }

  await satp.makeRequest(
    sessionID,
    PluginSatpGateway.getSatpAPI(
      satp.isClientGateway(sessionID)
        ? sessionData.recipientBasePath
        : sessionData.sourceBasePath,
    ).recoverV1Message(recoverMessage),
    "Recover",
  );
}

export async function checkValidRecoverMessage(
  response: RecoverV1Message,
  satp: PluginSatpGateway,
): Promise<void> {
  const fnTag = `${satp.className}#checkValidRecoverMessage`;

  const sessionID = response.sessionID;
  const sessionData = satp.sessions.get(sessionID);
  if (sessionData == undefined) {
    throw new Error(`${fnTag}, session data is undefined`);
  }

  let pubKey = undefined;

  if (satp.isClientGateway(response.sessionID)) {
    if (
      response.isBackup &&
      sessionData.recipientGatewayPubkey != response.newGatewayPubKey
    ) {
      // this is a backup gateway
      sessionData.recipientGatewayPubkey = response.newGatewayPubKey;

      if (
        !sessionData.recipientGatewayPubkey ||
        !sessionData.allowedSourceBackupGateways?.includes(
          sessionData.recipientGatewayPubkey,
        )
      ) {
        throw new Error(`${fnTag}, backup gateway not allowed`);
      }
    }
    pubKey = sessionData.recipientGatewayPubkey;
  } else {
    if (
      response.isBackup &&
      sessionData.sourceGatewayPubkey != response.newGatewayPubKey
    ) {
      // this is a backup gateway
      sessionData.sourceGatewayPubkey = response.newGatewayPubKey;

      if (
        !sessionData.sourceGatewayPubkey ||
        !sessionData.allowedSourceBackupGateways?.includes(
          sessionData.sourceGatewayPubkey,
        )
      ) {
        throw new Error(`${fnTag}, backup gateway not allowed`);
      }
    }
    pubKey = sessionData.sourceGatewayPubkey;
  }

  if (pubKey == undefined) {
    throw new Error(`${fnTag}, session data is undefined`);
  }

  // if (response.messageType != SatpMessageType.CommitFinalResponse) {
  //   throw new Error(`${fnTag}, wrong message type for CommitFinalResponse`);
  // }

  if (response.lastLogEntryTimestamp == undefined) {
    throw new Error(`${fnTag}, last log entry timestamp is not valid`);
  }

  if (!satp.verifySignature(response, pubKey)) {
    throw new Error(
      `${fnTag}, RecoverMessage message signature verification failed`,
    );
  }

  sessionData.lastLogEntryTimestamp = response.lastLogEntryTimestamp;

  satp.sessions.set(sessionID, sessionData);

  log.info(`RecoverMessage passed all checks.`);
}
