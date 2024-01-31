import {
  satpLocalLog,
  RecoverUpdateV1Message,
} from "../../generated/openapi/typescript-axios";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { ISatpLocalLog, PluginSatpGateway } from "../plugin-satp-gateway";
import { SHA256 } from "crypto-js";

const log = LoggerProvider.getOrCreate({
  level: "INFO",
  label: "recover-update-helper",
});

export async function sendRecoverUpdateMessage(
  sessionID: string,
  satp: PluginSatpGateway,
  remote: boolean,
): Promise<void | RecoverUpdateV1Message> {
  const fnTag = `${satp.className}#sendRecoverUpdateMessage()`;

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

  const recoveredLogs: ISatpLocalLog[] =
    await satp.getLogsMoreRecentThanTimestamp(
      sessionData.lastLogEntryTimestamp,
    );

  const recoverUpdateMessage: RecoverUpdateV1Message = {
    sessionID: sessionID,
    recoveredLogs: recoveredLogs,
    signature: "",
  };

  const signature = PluginSatpGateway.bufArray2HexStr(
    satp.sign(JSON.stringify(recoverUpdateMessage)),
  );

  recoverUpdateMessage.signature = signature;

  log.info(`${fnTag}, sending RecoverUpdate message...`);

  if (!remote) {
    return recoverUpdateMessage;
  }

  await satp.makeRequest(
    sessionID,
    PluginSatpGateway.getSatpAPI(
      satp.isClientGateway(sessionID)
        ? sessionData.recipientBasePath
        : sessionData.sourceBasePath,
    ).recoverUpdateV1Message(recoverUpdateMessage),
    "RecoverUpdate",
  );
}

export async function checkValidRecoverUpdateMessage(
  response: RecoverUpdateV1Message,
  satp: PluginSatpGateway,
): Promise<void> {
  const fnTag = `${satp.className}#checkValidRecoverUpdateMessage`;

  const sessionID = response.sessionID;
  const sessionData = satp.sessions.get(sessionID);
  if (sessionData == undefined) {
    throw new Error(`${fnTag}, session data is undefined`);
  }

  const pubKey = satp.isClientGateway(response.sessionID)
    ? sessionData.recipientGatewayPubkey
    : sessionData.sourceGatewayPubkey;

  if (pubKey == undefined) {
    throw new Error(`${fnTag}, session data is undefined`);
  }

  // if (response.messageType != SatpMessageType.CommitFinalResponse) {
  //   throw new Error(`${fnTag}, wrong message type for CommitFinalResponse`);
  // }

  // check if this is a valid recover update message

  if (!satp.verifySignature(response, pubKey)) {
    throw new Error(
      `${fnTag}, RecoverUpdateMessage message signature verification failed`,
    );
  }

  // check logs from counter party gateway
  const recoveredLogs = response.recoveredLogs;
  let maxTimestamp = "0";

  for (const recLog of recoveredLogs) {
    if (recLog.key == undefined) {
      throw new Error(`${fnTag}, the received log is not correctly defined`);
    }

    log.info(`${fnTag}, received log: ${JSON.stringify(recLog)}`);

    const ipfsLog = await satp.getLogFromRemote(recLog.key);

    const hash = SHA256(JSON.stringify(recLog)).toString();

    if (ipfsLog.hash != hash) {
      throw new Error(
        `${fnTag}, RecoverUpdateMessage message has invalid recovered logs`,
      );
    }

    if (recLog.data == undefined || recLog.timestamp == undefined) {
      throw new Error(
        `${fnTag}, RecoverUpdateMessage message is not correctly defined`,
      );
    }

    if (parseInt(recLog.timestamp) > parseInt(maxTimestamp)) {
      maxTimestamp = recLog.timestamp;

      const data = JSON.parse(recLog.data);

      // don't override new gateway public keys in case of being a backup gateway
      if (satp.isClientGateway(sessionID)) {
        data.sourceGatewayPubkey = satp.pubKey;
      } else {
        data.recipientGatewayPubkey = satp.pubKey;
      }

      satp.sessions.set(sessionID, data);
    }
  }

  log.info(`RecoverUpdateMessage passed all checks.`);
}
