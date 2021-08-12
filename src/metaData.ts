import { id } from "inversify";
import { Identifier } from "./interface";


class MetaData {
  private _identifier?: Identifier;
  private _args: any[];
  private _scopeMap: Map<string | Symbol, { identifier: Identifier, args: any[] }>

  constructor(identifier?: Identifier, args?: any[], $scope?: string | Symbol) {
    this._identifier = identifier;
    this._args = args;
    if ($scope) {
      this._scopeMap.set($scope, {
        identifier,
        args
      });
    }
  }

  get identifier(): Identifier {
    return this._identifier;
  }

  get args() {
    return this._args;
  }

  get scopeMap() {
    return this._scopeMap;
  }

  setParam(identifier: Identifier, args?: any[]) {
    this._identifier = identifier;
    this._args = args;
  }
}

export {
  MetaData
}