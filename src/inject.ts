import 'reflect-metadata';
import { Ioc } from "./constants";
import camelcase from "camelcase";

const Inject = (identifier?: string, $scope?: string) => {
  return (target: any, propertyKey: string) => {
    const annotationTarget = target.constructor;
    let props = {};
    // TODO 是否可以先从 Provide 中取?
    // if (Reflect.hasOwnMetadata(Ioc.PROVIDE, annotationTarget)) {
    //   props = Reflect.getMetadata(Ioc.PROVIDE, annotationTarget);
    // } else
    if (Reflect.hasOwnMetadata(Ioc.INJECT, annotationTarget)) {
      props = Reflect.getMetadata(Ioc.INJECT, annotationTarget);
    }
    const t = Reflect.getMetadata(Ioc.TYPE, target, propertyKey);
    if (identifier) {
      props[identifier] = {
        value: identifier,
      };
    } else {
      props[propertyKey] = {
        value: camelcase(t?.name ?? propertyKey)
      }
    }

    Reflect.defineMetadata(Ioc.INJECT, props, annotationTarget);
  }
}

export { Inject }
