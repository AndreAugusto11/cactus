/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Knex } from "knex";
import { Configuration } from "@hyperledger/cactus-core-api";
import { SessionDataRollbackActionsPerformedEnum } from "../../../main/typescript/generated/openapi/typescript-axios";
import {
  DefaultApi as BesuApi,
  Web3SigningCredential,
  EthContractInvocationType,
  InvokeContractV1Request as BesuInvokeContractV1Request,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { besuAssetExists, isBesuAssetLocked } from "../make-checks-ledgers";
import {
  IOdapPluginKeyPair,
  PluginOdapGateway,
} from "../../../main/typescript/gateway/plugin-odap-gateway";

export enum OdapMessageType {
  InitializationRequest = "urn:ietf:odap:msgtype:init-transfer-msg",
  InitializationResponse = "urn:ietf:odap:msgtype:init-transfer-ack-msg",
  TransferCommenceRequest = "urn:ietf:odap:msgtype:transfer-commence-msg",
  TransferCommenceResponse = "urn:ietf:odap:msgtype:transfer-commence-ack-msg",
  LockEvidenceRequest = "urn:ietf:odap:msgtype:lock-evidence-req-msg",
  LockEvidenceResponse = "urn:ietf:odap:msgtype:lock-evidence-ack-msg",
  CommitPreparationRequest = "urn:ietf:odap:msgtype:commit-prepare-msg",
  CommitPreparationResponse = "urn:ietf:odap:msgtype:commit-ack-msg",
  CommitFinalRequest = "urn:ietf:odap:msgtype:commit-final-msg",
  CommitFinalResponse = "urn:ietf:odap:msgtype:commit-ack-msg",
  TransferCompleteRequest = "urn:ietf:odap:msgtype:commit-transfer-complete-msg",
}

export interface IBesuOdapGatewayConstructorOptions {
  name: string;
  dltIDs: string[];
  instanceId: string;
  keyPair?: IOdapPluginKeyPair;
  backupGatewaysAllowed?: string[];

  ipfsPath?: string;

  besuPath?: string;

  besuContractName?: string;
  besuWeb3SigningCredential?: Web3SigningCredential;
  besuKeychainId?: string;
  fabricAssetID?: string;
  fabricAssetSize?: string;
  besuAssetID?: string;

  knexConfig?: Knex.Config;
}

export class BesuOdapGateway extends PluginOdapGateway {
  public besuApi?: BesuApi;
  public besuContractName?: string;
  public besuWeb3SigningCredential?: Web3SigningCredential;
  public besuKeychainId?: string;

  public constructor(options: IBesuOdapGatewayConstructorOptions) {
    super({
      name: options.name,
      dltIDs: options.dltIDs,
      instanceId: options.instanceId,
      keyPair: options.keyPair,
      backupGatewaysAllowed: options.backupGatewaysAllowed,
      ipfsPath: options.ipfsPath,
      knexConfig: options.knexConfig,
    });

    if (options.besuPath != undefined) this.defineBesuConnection(options);

    this.defineKnexConnection(options.knexConfig);
  }

  private defineBesuConnection(
    options: IBesuOdapGatewayConstructorOptions,
  ): void {
    const fnTag = `${this.className}#defineBesuConnection()`;

    const config = new Configuration({ basePath: options.besuPath });
    const apiClient = new BesuApi(config);
    this.besuApi = apiClient;
    const notEnoughBesuParams: boolean =
      options.besuContractName == undefined ||
      options.besuWeb3SigningCredential == undefined ||
      options.besuKeychainId == undefined;
    if (notEnoughBesuParams) {
      throw new Error(
        `${fnTag}, besu params missing. Should have: signing credentials, contract name, key chain ID, asset ID`,
      );
    }
    this.besuContractName = options.besuContractName;
    this.besuWeb3SigningCredential = options.besuWeb3SigningCredential;
    this.besuKeychainId = options.besuKeychainId;
  }

  async createAsset(sessionID: string, assetId?: string): Promise<string> {
    const fnTag = `${this.className}#createAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (sessionData == undefined) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    if (assetId == undefined) {
      assetId = sessionData.recipientLedgerAssetID;
    }

    let besuCreateAssetProof = "";

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec",
      operation: "create-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.besuApi != undefined) {
      const besuCreateRes = await this.besuApi.invokeContractV1({
        contractName: this.besuContractName,
        invocationType: EthContractInvocationType.Send,
        methodName: "createAsset",
        gas: 1000000,
        params: [assetId, 100], //the second is size, may need to pass this from client?
        signingCredential: this.besuWeb3SigningCredential,
        keychainId: this.besuKeychainId,
      } as BesuInvokeContractV1Request);

      if (besuCreateRes.status != 200) {
        //await this.Revert(sessionID);
        throw new Error(`${fnTag}, besu create asset error`);
      }

      const besuCreateResDataJson = JSON.parse(
        JSON.stringify(besuCreateRes.data),
      );

      if (besuCreateResDataJson.out == undefined) {
        throw new Error(`${fnTag}, besu res data out undefined`);
      }

      if (besuCreateResDataJson.out.transactionReceipt == undefined) {
        throw new Error(`${fnTag}, undefined besu transact receipt`);
      }

      const besuCreateAssetReceipt =
        besuCreateResDataJson.out.transactionReceipt;
      besuCreateAssetProof = JSON.stringify(besuCreateAssetReceipt);
    }

    sessionData.commitAcknowledgementClaim = besuCreateAssetProof;

    this.sessions.set(sessionID, sessionData);

    this.log.info(
      `${fnTag}, proof of the asset creation: ${besuCreateAssetProof}`,
    );

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof",
      operation: "create",
      data: besuCreateAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done",
      operation: "create-asset",
      data: JSON.stringify(sessionData),
    });

    return besuCreateAssetProof;
  }

  async deleteAsset(sessionID: string, assetId?: string): Promise<string> {
    const fnTag = `${this.className}#deleteAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (
      sessionData == undefined ||
      sessionData.rollbackActionsPerformed == undefined ||
      sessionData.rollbackProofs == undefined
    ) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let besuDeleteAssetProof = "";

    if (assetId == undefined) {
      assetId = sessionData.sourceLedgerAssetID;
    }

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec-rollback",
      operation: "delete-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.besuApi != undefined) {
      // we need to lock the asset first
      await this.besuApi.invokeContractV1({
        contractName: this.besuContractName,
        invocationType: EthContractInvocationType.Send,
        methodName: "lockAsset",
        gas: 1000000,
        params: [assetId],
        signingCredential: this.besuWeb3SigningCredential,
        keychainId: this.besuKeychainId,
      } as BesuInvokeContractV1Request);

      const assetCreationResponse = await this.besuApi.invokeContractV1({
        contractName: this.besuContractName,
        invocationType: EthContractInvocationType.Send,
        methodName: "deleteAsset",
        gas: 1000000,
        params: [assetId],
        signingCredential: this.besuWeb3SigningCredential,
        keychainId: this.besuKeychainId,
      } as BesuInvokeContractV1Request);

      if (assetCreationResponse.status != 200) {
        throw new Error(`${fnTag}, besu delete asset error`);
      }

      const assetCreationResponseDataJson = JSON.parse(
        JSON.stringify(assetCreationResponse.data),
      );

      if (assetCreationResponseDataJson.out == undefined) {
        throw new Error(`${fnTag}, besu res data out undefined`);
      }

      if (assetCreationResponseDataJson.out.transactionReceipt == undefined) {
        throw new Error(`${fnTag}, undefined besu transact receipt`);
      }

      const besuCreateAssetReceipt =
        assetCreationResponseDataJson.out.transactionReceipt;
      besuDeleteAssetProof = JSON.stringify(besuCreateAssetReceipt);
    }

    sessionData.rollbackActionsPerformed.push(
      SessionDataRollbackActionsPerformedEnum.Delete,
    );
    sessionData.rollbackProofs.push(besuDeleteAssetProof);

    this.sessions.set(sessionID, sessionData);

    this.log.info(
      `${fnTag}, proof of the asset deletion: ${besuDeleteAssetProof}`,
    );

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof-rollback",
      operation: "delete",
      data: besuDeleteAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done-rollback",
      operation: "delete-asset",
      data: JSON.stringify(sessionData),
    });

    return besuDeleteAssetProof;
  }

  async lockAsset(sessionID: string, assetId?: string): Promise<string> {
    const fnTag = `${this.className}#lockAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (
      sessionData == undefined ||
      sessionData.rollbackActionsPerformed == undefined ||
      sessionData.rollbackProofs == undefined
    ) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let besuLockAssetProof = "";

    if (assetId == undefined) {
      assetId = sessionData.sourceLedgerAssetID;
    }

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec-rollback",
      operation: "lock-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.besuApi != undefined) {
      const assetLockResponse = await this.besuApi.invokeContractV1({
        contractName: this.besuContractName,
        invocationType: EthContractInvocationType.Send,
        methodName: "lockAsset",
        gas: 1000000,
        params: [assetId],
        signingCredential: this.besuWeb3SigningCredential,
        keychainId: this.besuKeychainId,
      } as BesuInvokeContractV1Request);

      if (assetLockResponse.status != 200) {
        throw new Error(`${fnTag}, besu lock asset error`);
      }

      const assetLockResponseDataJson = JSON.parse(
        JSON.stringify(assetLockResponse.data),
      );

      if (assetLockResponseDataJson.out == undefined) {
        throw new Error(`${fnTag}, besu res data out undefined`);
      }

      if (assetLockResponseDataJson.out.transactionReceipt == undefined) {
        throw new Error(`${fnTag}, undefined besu transact receipt`);
      }

      const besuCreateAssetReceipt =
        assetLockResponseDataJson.out.transactionReceipt;
      besuLockAssetProof = JSON.stringify(besuCreateAssetReceipt);
    }

    sessionData.rollbackActionsPerformed.push(
      SessionDataRollbackActionsPerformedEnum.Lock,
    );
    sessionData.rollbackProofs.push(besuLockAssetProof);

    this.sessions.set(sessionID, sessionData);

    this.log.info(`${fnTag}, proof of the asset lock: ${besuLockAssetProof}`);

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof-rollback",
      operation: "lock",
      data: besuLockAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done-rollback",
      operation: "lock-asset",
      data: JSON.stringify(sessionData),
    });

    return besuLockAssetProof;
  }

  async unlockAsset(sessionID: string, assetId?: string): Promise<string> {
    const fnTag = `${this.className}#unlockAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (
      sessionData == undefined ||
      sessionData.rollbackActionsPerformed == undefined ||
      sessionData.rollbackProofs == undefined
    ) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let besuUnlockAssetProof = "";

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec-rollback",
      operation: "unlock-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.besuApi != undefined) {
      const assetUnlockResponse = await this.besuApi.invokeContractV1({
        contractName: this.besuContractName,
        invocationType: EthContractInvocationType.Send,
        methodName: "lockAsset",
        gas: 1000000,
        params: [assetId],
        signingCredential: this.besuWeb3SigningCredential,
        keychainId: this.besuKeychainId,
      } as BesuInvokeContractV1Request);

      if (assetUnlockResponse.status != 200) {
        throw new Error(`${fnTag}, besu unlock asset error`);
      }

      const assetUnlockResponseDataJson = JSON.parse(
        JSON.stringify(assetUnlockResponse.data),
      );

      if (assetUnlockResponseDataJson.out == undefined) {
        throw new Error(`${fnTag}, besu res data out undefined`);
      }

      if (assetUnlockResponseDataJson.out.transactionReceipt == undefined) {
        throw new Error(`${fnTag}, undefined besu transact receipt`);
      }

      const besuCreateAssetReceipt =
        assetUnlockResponseDataJson.out.transactionReceipt;
      besuUnlockAssetProof = JSON.stringify(besuCreateAssetReceipt);
    }

    sessionData.rollbackActionsPerformed.push(
      SessionDataRollbackActionsPerformedEnum.Lock,
    );
    sessionData.rollbackProofs.push(besuUnlockAssetProof);

    this.sessions.set(sessionID, sessionData);

    this.log.info(
      `${fnTag}, proof of the asset unlock: ${besuUnlockAssetProof}`,
    );

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof-rollback",
      operation: "unlock",
      data: besuUnlockAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done-rollback",
      operation: "unlock-asset",
      data: JSON.stringify(sessionData),
    });

    return besuUnlockAssetProof;
  }

  async rollback(sessionID: string) {
    const fnTag = `${this.className}#rollback()`;
    const sessionData = this.sessions.get(sessionID);

    if (
      sessionData == undefined ||
      sessionData.step == undefined ||
      sessionData.lastSequenceNumber == undefined
    ) {
      throw new Error(`${fnTag}, session data is undefined`);
    }

    sessionData.rollback = true;

    this.log.info(`${fnTag}, rolling back session ${sessionID}`);

    if (
      this.besuApi == undefined ||
      this.besuContractName == undefined ||
      this.besuKeychainId == undefined ||
      this.besuWeb3SigningCredential == undefined ||
      sessionData.sourceLedgerAssetID == undefined ||
      sessionData.recipientLedgerAssetID == undefined
    ) {
      return;
    }

    if (this.isClientGateway(sessionID)) {
      if (
        await besuAssetExists(
          this,
          this.besuContractName,
          this.besuKeychainId,
          sessionData.sourceLedgerAssetID,
          this.besuWeb3SigningCredential,
        )
      ) {
        if (
          await isBesuAssetLocked(
            this,
            this.besuContractName,
            this.besuKeychainId,
            sessionData.sourceLedgerAssetID,
            this.besuWeb3SigningCredential,
          )
        ) {
          // Rollback locking of the asset
          await this.unlockAsset(sessionID, sessionData.sourceLedgerAssetID);
        }
      } else {
        // Rollback extinguishment of the asset
        await this.createAsset(sessionID, sessionData.sourceLedgerAssetID);
      }
    } else {
      if (
        await besuAssetExists(
          this,
          this.besuContractName,
          this.besuKeychainId,
          sessionData.recipientLedgerAssetID,
          this.besuWeb3SigningCredential,
        )
      ) {
        // Rollback creation of the asset
        await this.deleteAsset(sessionID, sessionData.recipientLedgerAssetID);
      }
    }
  }
}
