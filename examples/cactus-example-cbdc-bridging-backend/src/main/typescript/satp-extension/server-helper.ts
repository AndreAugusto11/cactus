import { SHA256 } from "crypto-js";
import {
  SessionData,
  TransferInitializationV1Request,
} from "@hyperledger/cactus-plugin-satp-hermes";
import {
  SatpMessageType,
  PluginSatpGateway,
} from "@hyperledger/cactus-plugin-satp-hermes";
import { ServerGatewayHelper } from "@hyperledger/cactus-plugin-satp-hermes";

import { FabricSatpGateway } from "./fabric-satp-gateway";
import { LogLevelDesc } from "@hyperledger/cactus-common";

export interface IServerHelperOptions {
  logLevel?: LogLevelDesc;
}

export class ServerHelper extends ServerGatewayHelper {
  public static readonly CLASS_NAME: string = "ServerHelper";

  constructor(readonly opts: IServerHelperOptions) {
    super();
    this.log.debug(`Instantiated ${this.className} OK`);
  }

  public get className(): string {
    return ServerHelper.CLASS_NAME;
  }

  async checkValidInitializationRequest(
    request: TransferInitializationV1Request,
    satp: PluginSatpGateway,
  ): Promise<void> {
    const fnTag = `${satp.className}#checkValidInitializationRequest()`;

    const sessionData: SessionData = {};
    const recvTimestamp: string = Date.now().toString();
    const sessionID = request.sessionID;

    sessionData.id = sessionID;
    sessionData.step = 2;
    sessionData.initializationRequestMessageRcvTimeStamp = recvTimestamp;

    satp.sessions.set(sessionID, sessionData);

    await satp.storeSatpLog({
      sessionID: sessionID,
      type: "exec",
      operation: "validate",
      data: JSON.stringify(sessionData),
    });

    if (request.messageType != SatpMessageType.InitializationRequest) {
      throw new Error(
        `${fnTag}, wrong message type for TransferInitializationRequest`,
      );
    }

    if (!satp.verifySignature(request, request.sourceGatewayPubkey)) {
      throw new Error(
        `${fnTag}, TransferInitializationRequest message signature verification failed`,
      );
    }

    if (!satp.supportedDltIDs.includes(request.sourceGatewayDltSystem)) {
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

    if (request.payloadProfile.assetProfile.keyInformationLink?.length != 3) {
      throw new Error(`${fnTag}, CBDC parameters not specified`);
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
    sessionData.allowedRecipientBackupGateways = satp.backupGatewaysAllowed;

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

    sessionData.initializationRequestMessageProcessedTimeStamp =
      Date.now().toString();

    satp.sessions.set(request.sessionID, sessionData);

    if (satp instanceof FabricSatpGateway) {
      await satp
        .isValidBridgeBackCBDC(
          request.payloadProfile.assetProfile.keyInformationLink[1].toString(), // FabricID
          request.payloadProfile.assetProfile.keyInformationLink[2].toString(), // ETH Address
        )
        .catch((err) => {
          throw new Error(`${err.response.data.error}`);
        });
    }

    await satp.storeSatpLog({
      sessionID: sessionID,
      type: "done",
      operation: "validate",
      data: JSON.stringify(sessionData),
    });

    this.log.info(`TransferInitializationRequest passed all checks.`);
  }
}
