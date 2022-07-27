import { SHA256 } from "crypto-js";
import {
  PluginOdapGateway,
  SessionData,
  TransferInitializationV1Request,
} from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript";
import { OdapMessageType } from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript/gateway/plugin-odap-gateway";
import { ServerGatewayHelper } from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript/gateway/server/server-helper";

export class ServerHelper extends ServerGatewayHelper {
  static async checkValidInitializationRequest(
    request: TransferInitializationV1Request,
    odap: PluginOdapGateway,
  ): Promise<void> {
    const fnTag = `${odap.className}#checkValidInitializationRequest()`;

    const sessionData: SessionData = {};
    const recvTimestamp: string = Date.now().toString();
    const sessionID = request.sessionID;

    sessionData.id = sessionID;
    sessionData.step = 2;
    sessionData.initializationRequestMessageRcvTimeStamp = recvTimestamp;

    odap.sessions.set(sessionID, sessionData);

    await odap.storeOdapLog({
      sessionID: sessionID,
      type: "exec",
      operation: "validate",
      data: JSON.stringify(sessionData),
    });

    if (request.messageType != OdapMessageType.InitializationRequest) {
      throw new Error(
        `${fnTag}, wrong message type for TransferInitializationRequest`,
      );
    }

    if (!odap.verifySignature(request, request.sourceGatewayPubkey)) {
      throw new Error(
        `${fnTag}, TransferInitializationRequest message signature verification failed`,
      );
    }

    if (!odap.supportedDltIDs.includes(request.sourceGatewayDltSystem)) {
      throw new Error(
        `${fnTag}, source gateway dlt system is not supported by this gateway`,
      );
    }

    if (request.payloadProfile.assetProfile.issuer != "CB1") {
      throw new Error(`${fnTag}, asset issuer not recognized`);
    }

    if (request.payloadProfile.assetProfile.assetCode != "CBDC1") {
      throw new Error(`${fnTag}, asset code not recognized`);
    }

    if (request.payloadProfile.assetProfile.keyInformationLink?.length != 1) {
      throw new Error(`${fnTag}, asset amount not specified`);
    }

    const expiryDate: string =
      request.payloadProfile.assetProfile.expirationDate;
    const isDataExpired: boolean = new Date() >= new Date(expiryDate);
    if (isDataExpired) {
      throw new Error(`${fnTag}, asset has expired`);
    }

    sessionData.version = request.version;
    sessionData.maxRetries = request.maxRetries;
    sessionData.maxTimeout = request.maxTimeout;

    sessionData.allowedSourceBackupGateways = request.backupGatewaysAllowed;
    sessionData.allowedRecipientBackupGateways = odap.backupGatewaysAllowed;

    sessionData.sourceBasePath = request.sourceBasePath;
    sessionData.recipientBasePath = request.recipientBasePath;
    sessionData.lastSequenceNumber = request.sequenceNumber;
    sessionData.loggingProfile = request.loggingProfile;
    sessionData.accessControlProfile = request.accessControlProfile;
    sessionData.payloadProfile = request.payloadProfile;
    sessionData.applicationProfile = request.applicationProfile;
    sessionData.assetProfile = request.payloadProfile.assetProfile;
    sessionData.sourceGatewayPubkey = request.sourceGatewayPubkey;
    sessionData.sourceGatewayDltSystem = request.sourceGatewayDltSystem;
    sessionData.recipientGatewayPubkey = request.recipientGatewayPubkey;
    sessionData.recipientGatewayDltSystem = request.recipientGatewayDltSystem;
    sessionData.rollbackActionsPerformed = [];
    sessionData.rollbackProofs = [];
    sessionData.lastMessageReceivedTimestamp = new Date().toString();
    sessionData.recipientLedgerAssetID = request.recipientLedgerAssetID;
    sessionData.sourceLedgerAssetID = request.sourceLedgerAssetID;

    sessionData.initializationRequestMessageHash = SHA256(
      JSON.stringify(request),
    ).toString();

    sessionData.clientSignatureInitializationRequestMessage = request.signature;

    sessionData.initializationRequestMessageProcessedTimeStamp = Date.now().toString();

    odap.sessions.set(request.sessionID, sessionData);

    await odap.storeOdapLog({
      sessionID: sessionID,
      type: "done",
      operation: "validate",
      data: JSON.stringify(sessionData),
    });

    this.log.info(`TransferInitializationRequest passed all checks.`);
  }
}
