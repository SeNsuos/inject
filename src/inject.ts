import 'reflect-metadata';

const IOC_INJECT = 'ioc:inject';

const inject = (identifier?: string, $scope?: string | Symbol) => {
  return (target: any, propertyKey: string) => {
    const annotationTarget = target.constructor;
    let props = {};
    if (Reflect.hasOwnMetadata(IOC_INJECT, annotationTarget)) {
      props = Reflect.getMetadata(IOC_INJECT, annotationTarget);
    }
    if (identifier) {
      props[identifier] = {
        value: identifier,
      };
    } else {
      props[propertyKey] = {
        value: propertyKey
      }
    }

    Reflect.defineMetadata(IOC_INJECT, props, annotationTarget);
  }
}

export { inject }