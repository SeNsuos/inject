import { Provide, Inject, Container } from '..';

interface Warrior {
  fight(): string;
  sneak(): string;
}

interface Weapon {
  hit(): string;
}

interface ThrowableWeapon {
  throw(): string;
}

// const TYPES = {
//   Warrior: Symbol.for("Warrior"),
//   Weapon: Symbol.for("Weapon"),
//   ThrowableWeapon: Symbol.for("ThrowableWeapon")
// };

@Provide()
class Katana implements Weapon {
  public hit(): string {
    return "cut!";
  }
}

@Provide()
class Shuriken implements ThrowableWeapon {
  public throw(): string {
    return "hit!";
  }
}

@Provide()
class Ninja implements Warrior {

  @Inject()
  public _katana: Katana;
  @Inject()
  public _shuriken: Shuriken;

  public constructor() {

  }

  public fight(): string {
    return this._katana.hit();
  }
  public sneak(): string {
    return this._shuriken.throw();
  }
}

let ninja: Ninja;

beforeAll(() => {
  const container = new Container();
  container.bind<Katana>(Katana);
  container.bind<Shuriken>(Shuriken);
  container.bind<Ninja>(Ninja);
  ninja = container.get<Ninja>('ninja');

  console.log(ninja);
})

describe('test ioc ability without auto scan', () => {

  it('test ninja use ioc', () => {
    expect<string>(ninja.fight()).toEqual<string>('cut!');
    expect<string>(ninja.sneak()).toEqual<string>('hit!');
  })
})
