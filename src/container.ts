import 'reflect-metadata';

interface BaseContainer {
  bind<T>(target: T, args?: any[]): void;
  bind<T>(identifier: string | Symbol, target: T, args?: any[]): void;
}

interface BindValue {
  clazz: any;
  args: any[]
}

class Container implements BaseContainer {
  private dependMap = new Map<string | Symbol, BindValue>();

  bind<T>(target: T, args?: any[]): void;
  bind<T>(identifier: string | Symbol, target: T, args?: any[]): void;
  bind<T>(identifier: string | Symbol, target: T, args?: any[]): void {
    if (identifier) {
      this.dependMap.set(identifier, {
        clazz: target,
        args
      });
    } else {
      // @ts-ignore
      this.dependMap.set(target.name, {
        clazz: target,
        args
      })
    }
  }

  get<T>(identifier: string | Symbol, $scope?: string | Symbol): T {
    if (!this.dependMap.has(identifier)) {
      throw Error('not exit');
    }

    const bindValue = this.dependMap.get(identifier);
    const { clazz, args } = bindValue;

    const props = Reflect.getMetadata('ioc:inject', clazz);
    const inst = Reflect.construct(clazz, args);

    for (let prop in props) {
      const identifier = props[prop].value;
      // 递归获取注入的对象
      inst[prop] = this.get(identifier);
    }
    return inst;
  }
}

export { Container };