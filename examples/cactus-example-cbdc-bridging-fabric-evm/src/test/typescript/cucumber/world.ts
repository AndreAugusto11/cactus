import { IStartInfo } from "../../../main/typescript/cbdc-bridging-app";

import { setWorldConstructor, setDefaultTimeout, World } from "cucumber";

class CustomWorld implements World {
  public app: IStartInfo;
}

setWorldConstructor(CustomWorld);

setDefaultTimeout(60 * 1000);
