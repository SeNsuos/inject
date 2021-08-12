type Identifier = string | Symbol;

interface IOptions {
  autowired: boolean;
  scoped: boolean;
}

export {
  Identifier,
  IOptions
}