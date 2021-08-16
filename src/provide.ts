import 'reflect-metadata';
import { MetaData } from './metaData';
import { Ioc } from "./constants";
import camelcase from "camelcase";

const Provide = (identifier?: string, args?: any[], $scope?: string) => {
  return (target: any) => {
    if (Reflect.hasOwnMetadata(Ioc.PROVIDE, target)) {
      const metaData: MetaData = Reflect.getMetadata(Ioc.PROVIDE, target);
      const { scopeMap } = metaData;

      metaData.setParam(camelcase(identifier || target.name), args);

      if (!$scope || scopeMap.has($scope)) {
        throw Error('重复绑定');
      }

      // 在 Ioc 中注册当前空间的 target 
      scopeMap.set($scope, {
        identifier,
        args
      });

      // 覆盖之前的 metaData 
      Reflect.defineMetadata(
        Ioc.PROVIDE,
        metaData,
        target
      )

    } else {
      if (!identifier) {
        identifier = camelcase(target.name);
      }

      Reflect.defineMetadata(
        Ioc.PROVIDE,
        new MetaData(camelcase(identifier), args, $scope),
        target
      );
    }

    return target;
  }
}

export { Provide };
