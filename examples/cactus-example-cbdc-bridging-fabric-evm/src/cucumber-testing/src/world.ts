import { Calculator } from "./models/Calculator";

import { setWorldConstructor, World } from "cucumber";

class CustomWorld implements World {
  public calculator: Calculator;
}

setWorldConstructor(CustomWorld);
