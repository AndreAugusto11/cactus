import { IStartInfo } from "../../../main/typescript/cbdc-bridging-app";

import { setWorldConstructor, World } from "cucumber";

class CustomWorld implements World {
  public app: IStartInfo | undefined;
}

setWorldConstructor(CustomWorld);
