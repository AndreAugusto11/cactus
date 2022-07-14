export * from "./generated/openapi/typescript-axios/index";

export {
  IPluginOdapGatewayConstructorOptions,
  PluginOdapGateway,
} from "./gateway/plugin-odap-gateway";

import { IPluginFactoryOptions } from "@hyperledger/cactus-core-api";
import { PluginFactoryOdapGateway } from "./gateway/plugin-factory-odap-gateway";

export async function createPluginFactory(
  pluginFactoryOptions: IPluginFactoryOptions,
): Promise<PluginFactoryOdapGateway> {
  return new PluginFactoryOdapGateway(pluginFactoryOptions);
}
