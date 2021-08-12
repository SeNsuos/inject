import 'reflect-metadata';
import { MetaData } from './metaData';

const IOC_PROVIDE = 'ioc:provide';

const provide = (identifier?: string, args?: any[], $scope?: string | Symbol) => {
  return (target: any) => {
    if (Reflect.hasOwnMetadata('ioc:provide', target)) {
      const metaData: MetaData = Reflect.getMetadata(IOC_PROVIDE, target);
      const { scopeMap } = metaData;

      metaData.setParam(identifier || target.name, args);

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
        IOC_PROVIDE,
        metaData,
        target
      )

    } else {
      if (!identifier) {
        identifier = target.name;
      }

      Reflect.defineMetadata(
        IOC_PROVIDE,
        new MetaData(identifier, args, $scope),
        target
      );
    }

    return target;
  }
}

export { provide };