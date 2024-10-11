import { SATPError } from "../../core/errors/satp-errors";
import {
  Integration,
  IntegrationsResponse,
} from "../../generated/gateway-client/typescript-axios/api";
import { Logger } from "@hyperledger/cactus-common";
import { SATPManager } from "../../gol/satp-manager";
import { SupportedChain } from "../../core/types";

export async function ExecuteGetIntegrations(
  logger: Logger,
  manager: SATPManager,
): Promise<IntegrationsResponse> {
  const fnTag = `GetIntegrationsHandler`;
  logger.info(`${fnTag}, Obtaining integrations...`);

  try {
    const result = await GetIntegrationsService(logger, manager);

    return {
      integrations: result,
    };
  } catch (error) {
    if (error instanceof SATPError) {
      logger.error(`${fnTag}, Error getting status: ${error.message}`);
      throw error;
    } else {
      logger.error(`${fnTag}, Unexpected error: ${error.message}`);
      throw new Error("An unexpected error occurred while obtaining status.");
    }
  }
}

// TODO call SATP core, use try catch to propagate errors
export async function GetIntegrationsService(
  logger: Logger,
  manager: SATPManager,
): Promise<Integration[]> {
  // Implement the logic for getting status here; call core

  const supportedSystems = manager.supportedDLTs;

  return supportedSystems.map((supportedSystem) =>
    convertSupportedChainsIntoIntegrations(supportedSystem),
  );
}

function convertSupportedChainsIntoIntegrations(
  supportedChain: SupportedChain,
): Integration {
  switch (supportedChain) {
    case SupportedChain.FABRIC:
      return {
        id: "dummyId",
        name: "Hyperledger Fabric",
        type: "fabric",
        environment: "testnet",
      } as Integration;
    case SupportedChain.BESU:
      return {
        id: "dummyId",
        name: "Hyperledger Besu",
        type: "besu",
        environment: "testnet",
      } as Integration;
    default:
      throw new Error(`Unsupported chain: ${supportedChain}`);
  }
}
