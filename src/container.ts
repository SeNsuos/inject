import 'reflect-metadata';
import { Ioc } from "./constants";
import camelcase from "camelcase";

interface BaseContainer {
  bind<T>(target: Newable<T>, identifier: string, args?: any[]): void;
}

interface BindValue {
  clazz: any;
  args: any[]
}

type Newable<T> = new (...args: any[]) => T;

class Container implements BaseContainer {
  private dependMap = new Map<string, BindValue>();

  bind<T>(target: Newable<T>, identifier?: string, args: any[] = []): void {
    if (identifier) {
      this.dependMap.set(camelcase(identifier), {
        clazz: target,
        args
      });
    } else {
      this.dependMap.set(camelcase(target.name), {
        clazz: target,
        args
      })
    }
  }

  get<T>(identifier: string, $scope?: string | Symbol): T {
    if (!this.dependMap.has(identifier)) {
      throw Error(`identifier ${identifier} not exit`);
    }

    const bindValue = this.dependMap.get(identifier);
    const { clazz, args } = bindValue;

    const props = Reflect.getMetadata(Ioc.INJECT, clazz);
    const inst = Reflect.construct(clazz, args);

    for (let prop in props) {
      const identifier = props[prop].value;
      // 递归获取注入的对象
      inst[prop] = this.get(identifier);
    }
    return inst as T;
  }
}

export { Container };
