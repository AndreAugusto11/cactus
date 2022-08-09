class Calculator {
  private _value: number;
  public get value() {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public add(n1: number, n2: number) {
    this.value = n1 + n2;
  }
}

export { Calculator };
