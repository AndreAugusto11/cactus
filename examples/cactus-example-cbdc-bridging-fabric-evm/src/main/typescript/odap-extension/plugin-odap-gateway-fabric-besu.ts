/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  FabricContractInvocationType,
  RunTransactionRequest as FabricRunTransactionRequest,
} from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import {
  EthContractInvocationType,
  InvokeContractV1Request as BesuInvokeContractV1Request,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import {
  IPluginOdapGatewayConstructorOptions,
  PluginOdapGateway,
  SessionDataRollbackActionsPerformedEnum,
} from "@hyperledger/cactus-plugin-odap-hermes/src/main/typescript/index";
import { Logger, LoggerProvider } from "@hyperledger/cactus-common";

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

export class PluginOdapGatewayFabricBesu extends PluginOdapGateway {
  private readonly logger: Logger;

  constructor(options: IPluginOdapGatewayConstructorOptions) {
    super(options);
    const level = "INFO";
    const label = this.className;
    this.logger = LoggerProvider.getOrCreate({ level, label });
  }

  async lockFabricAsset(sessionID: string): Promise<string> {
    const fnTag = `${this.className}#lockFabricAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (sessionData == undefined) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let fabricLockAssetProof = "";

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec",
      operation: "lock-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.fabricApi != undefined) {
      const response = await this.fabricApi.runTransactionV1({
        signingCredential: this.fabricSigningCredential,
        channelName: this.fabricChannelName,
        contractName: this.fabricContractName,
        invocationType: FabricContractInvocationType.Send,
        methodName: "LockAssetReference",
        params: [sessionData.fabricAssetID],
      } as FabricRunTransactionRequest);

      const receiptLockRes = await this.fabricApi.getTransactionReceiptByTxIDV1(
        {
          signingCredential: this.fabricSigningCredential,
          channelName: this.fabricChannelName,
          contractName: "qscc",
          invocationType: FabricContractInvocationType.Call,
          methodName: "GetBlockByTxID",
          params: [this.fabricChannelName, response.data.transactionId],
        } as FabricRunTransactionRequest,
      );

      this.logger.warn(receiptLockRes.data);
      fabricLockAssetProof = JSON.stringify(receiptLockRes.data);
    }

    sessionData.lockEvidenceClaim = fabricLockAssetProof;

    this.sessions.set(sessionID, sessionData);

    this.logger.info(
      `${fnTag}, proof of the asset lock: ${fabricLockAssetProof}`,
    );

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof",
      operation: "lock",
      data: fabricLockAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done",
      operation: "lock-asset",
      data: JSON.stringify(sessionData),
    });

    return fabricLockAssetProof;
  }

  async unlockFabricAsset(sessionID: string): Promise<string> {
    const fnTag = `${this.className}#unlockFabricAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (
      sessionData == undefined ||
      sessionData.rollbackActionsPerformed == undefined ||
      sessionData.rollbackProofs == undefined
    ) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let fabricUnlockAssetProof = "";

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec-rollback",
      operation: "unlock-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.fabricApi != undefined) {
      const response = await this.fabricApi.runTransactionV1({
        signingCredential: this.fabricSigningCredential,
        channelName: this.fabricChannelName,
        contractName: this.fabricContractName,
        invocationType: FabricContractInvocationType.Send,
        methodName: "CreateAssetReference",
        params: [sessionData.fabricAssetID],
      } as FabricRunTransactionRequest);

      const receiptUnlock = await this.fabricApi.getTransactionReceiptByTxIDV1({
        signingCredential: this.fabricSigningCredential,
        channelName: this.fabricChannelName,
        contractName: "qscc",
        invocationType: FabricContractInvocationType.Call,
        methodName: "GetBlockByTxID",
        params: [this.fabricChannelName, response.data.transactionId],
      } as FabricRunTransactionRequest);

      this.logger.warn(receiptUnlock.data);
      fabricUnlockAssetProof = JSON.stringify(receiptUnlock.data);
    }

    sessionData.rollbackActionsPerformed.push(
      SessionDataRollbackActionsPerformedEnum.Unlock,
    );
    sessionData.rollbackProofs.push(fabricUnlockAssetProof);

    this.sessions.set(sessionID, sessionData);

    this.logger.info(
      `${fnTag}, proof of the asset unlock: ${fabricUnlockAssetProof}`,
    );

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof-rollback",
      operation: "unlock",
      data: fabricUnlockAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done-rollback",
      operation: "unlock-asset",
      data: JSON.stringify(sessionData),
    });

    return fabricUnlockAssetProof;
  }

  async createFabricAsset(sessionID: string): Promise<string> {
    const fnTag = `${this.className}#createFabricAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (
      sessionData == undefined ||
      sessionData.fabricAssetID == undefined ||
      this.fabricChannelName == undefined ||
      this.fabricContractName == undefined ||
      this.fabricSigningCredential == undefined ||
      sessionData.rollbackProofs == undefined ||
      sessionData.rollbackActionsPerformed == undefined
    ) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let fabricCreateAssetProof = "";

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec-rollback",
      operation: "create-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.fabricApi != undefined) {
      const response = await this.fabricApi.runTransactionV1({
        contractName: this.fabricContractName,
        channelName: this.fabricChannelName,
        params: [sessionData.fabricAssetID, "19"],
        methodName: "DeleteAssetReference",
        invocationType: FabricContractInvocationType.Send,
        signingCredential: this.fabricSigningCredential,
      });

      const receiptCreate = await this.fabricApi.getTransactionReceiptByTxIDV1({
        signingCredential: this.fabricSigningCredential,
        channelName: this.fabricChannelName,
        contractName: "qscc",
        invocationType: FabricContractInvocationType.Call,
        methodName: "GetBlockByTxID",
        params: [this.fabricChannelName, response.data.transactionId],
      } as FabricRunTransactionRequest);

      this.logger.warn(receiptCreate.data);
      fabricCreateAssetProof = JSON.stringify(receiptCreate.data);
    }

    sessionData.rollbackActionsPerformed.push(
      SessionDataRollbackActionsPerformedEnum.Create,
    );

    sessionData.rollbackProofs.push(fabricCreateAssetProof);

    this.sessions.set(sessionID, sessionData);

    this.logger.info(
      `${fnTag}, proof of the asset creation: ${fabricCreateAssetProof}`,
    );

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof-rollback",
      operation: "create",
      data: fabricCreateAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done-rollback",
      operation: "create-asset",
      data: JSON.stringify(sessionData),
    });

    return fabricCreateAssetProof;
  }

  async deleteFabricAsset(sessionID: string): Promise<string> {
    const fnTag = `${this.className}#deleteFabricAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (sessionData == undefined) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let fabricDeleteAssetProof = "";

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "exec",
      operation: "delete-asset",
      data: JSON.stringify(sessionData),
    });

    if (this.fabricApi != undefined) {
      const deleteRes = await this.fabricApi.runTransactionV1({
        signingCredential: this.fabricSigningCredential,
        channelName: this.fabricChannelName,
        contractName: this.fabricContractName,
        invocationType: FabricContractInvocationType.Send,
        methodName: "UnlockAssetReference",
        params: [sessionData.fabricAssetID],
      } as FabricRunTransactionRequest);

      const receiptDeleteRes = await this.fabricApi.getTransactionReceiptByTxIDV1(
        {
          signingCredential: this.fabricSigningCredential,
          channelName: this.fabricChannelName,
          contractName: "qscc",
          invocationType: FabricContractInvocationType.Call,
          methodName: "GetBlockByTxID",
          params: [this.fabricChannelName, deleteRes.data.transactionId],
        } as FabricRunTransactionRequest,
      );

      this.logger.warn(receiptDeleteRes.data);
      fabricDeleteAssetProof = JSON.stringify(receiptDeleteRes.data);
    }

    sessionData.commitFinalClaim = fabricDeleteAssetProof;

    this.sessions.set(sessionID, sessionData);

    this.logger.info(
      `${fnTag}, proof of the asset deletion: ${fabricDeleteAssetProof}`,
    );

    await this.storeOdapProof({
      sessionID: sessionID,
      type: "proof",
      operation: "delete",
      data: fabricDeleteAssetProof,
    });

    await this.storeOdapLog({
      sessionID: sessionID,
      type: "done",
      operation: "delete-asset",
      data: JSON.stringify(sessionData),
    });

    return fabricDeleteAssetProof;
  }

  async createBesuAsset(sessionID: string): Promise<string> {
    const fnTag = `${this.className}#createBesuAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (sessionData == undefined) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
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
        methodName: "createAssetReference",
        gas: 1000000,
        params: [
          sessionData.besuAssetID,
          100,
          "0x52550D554cf8907b5d09d0dE94e8ffA34763918d",
        ], //the second is size, may need to pass this from client?
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

    this.logger.info(
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

  async deleteBesuAsset(sessionID: string): Promise<string> {
    const fnTag = `${this.className}#deleteBesuAsset()`;

    const sessionData = this.sessions.get(sessionID);

    if (
      sessionData == undefined ||
      sessionData.rollbackActionsPerformed == undefined ||
      sessionData.rollbackProofs == undefined
    ) {
      throw new Error(`${fnTag}, session data is not correctly initialized`);
    }

    let besuDeleteAssetProof = "";

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
        methodName: "lockAssetReference",
        gas: 1000000,
        params: [sessionData.besuAssetID],
        signingCredential: this.besuWeb3SigningCredential,
        keychainId: this.besuKeychainId,
      } as BesuInvokeContractV1Request);

      const assetCreationResponse = await this.besuApi.invokeContractV1({
        contractName: this.besuContractName,
        invocationType: EthContractInvocationType.Send,
        methodName: "deleteAssetReference",
        gas: 1000000,
        params: [sessionData.besuAssetID],
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

    this.logger.info(
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
}
