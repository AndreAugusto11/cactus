import { RollbackV1Message } from "../../generated/openapi/typescript-axios";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { PluginSatpGateway } from "../plugin-satp-gateway";
// import { SHA256 } from "crypto-js";

const log = LoggerProvider.getOrCreate({
  level: "INFO",
  label: "rollback-helper",
});

export async function sendRollbackMessage(
  sessionID: string,
  satp: PluginSatpGateway,
  remote: boolean,
): Promise<void | RollbackV1Message> {
  const fnTag = `${satp.className}#sendRollbackMessage()`;

  const sessionData = satp.sessions.get(sessionID);

  if (
    sessionData == undefined ||
    sessionData.maxTimeout == undefined ||
    sessionData.maxRetries == undefined ||
    sessionData.rollbackProofs == undefined ||
    sessionData.sourceBasePath == undefined ||
    sessionData.recipientBasePath == undefined ||
    sessionData.rollbackActionsPerformed == undefined
  ) {
    throw new Error(`${fnTag}, session data is not correctly initialized`);
  }

  const rollbackMessage: RollbackV1Message = {
    sessionID: sessionID,
    success: true,
    actionPerformed: sessionData.rollbackActionsPerformed,
    proofs: sessionData.rollbackProofs,
    signature: "",
  };

  const signature = PluginSatpGateway.bufArray2HexStr(
    satp.sign(JSON.stringify(rollbackMessage)),
  );

  rollbackMessage.signature = signature;

  log.info(`${fnTag}, sending Rollback message...`);

  if (!remote) {
    return rollbackMessage;
  }

  await satp.makeRequest(
    sessionID,
    PluginSatpGateway.getSatpAPI(
      satp.isClientGateway(sessionID)
        ? sessionData.recipientBasePath
        : sessionData.sourceBasePath,
    ).rollbackV1Message(rollbackMessage),
    "Rollback",
  );
}

export async function checkValidRollbackMessage(
  response: RollbackV1Message,
  satp: PluginSatpGateway,
): Promise<void> {
  const fnTag = `${satp.className}#checkValidRollbackMessage`;

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

  if (!satp.verifySignature(response, pubKey)) {
    throw new Error(
      `${fnTag}, RollbackMessage message signature verification failed`,
    );
  }

  log.info(`RollbackMessage passed all checks.`);
}
