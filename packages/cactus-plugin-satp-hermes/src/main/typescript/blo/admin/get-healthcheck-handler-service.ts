import { GetStatusError } from "../../core/errors/satp-errors";
import { HealthCheckResponse } from "../../generated/gateway-client/typescript-axios/api";
import { Logger } from "@hyperledger/cactus-common";
import { SATPManager } from "../../gol/satp-manager";

export async function ExecuteGetHealthCheck(
  logger: Logger,
  manager: SATPManager,
): Promise<HealthCheckResponse> {
  const fnTag = `GetHeathCheckHandler`;
  logger.info(`${fnTag}, Obtaining healthcheck`);

  try {
    const result = await GetHealthCheckService(logger, manager);
    return result;
  } catch (error) {
    if (error instanceof GetStatusError) {
      logger.error(`${fnTag}, Error getting status: ${error.message}`);
      throw error;
    } else {
      logger.error(`${fnTag}, Unexpected error: ${error.message}`);
      throw new Error("An unexpected error occurred while obtaining status.");
    }
  }
}

// TODO call SATP core, use try catch to propagate errors
export async function GetHealthCheckService(
  logger: Logger,
  manager: SATPManager,
): Promise<HealthCheckResponse> {
  const status = manager.healthCheck();

  const res: HealthCheckResponse = {
    status: status,
  };

  logger.info(res);

  return res;
}
