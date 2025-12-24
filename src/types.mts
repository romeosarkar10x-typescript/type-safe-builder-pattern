declare const BUILDER: unique symbol;

export type BuilderZygoteType = { [BUILDER]: "Builder" };

export type BuilderAddProperty<
    Key extends string,
    Value,
    BuilderObject extends BuilderZygoteType = BuilderZygoteType,
> = string extends Key
    ? never
    : PrettifyObject<
          {
              [K in keyof BuilderObject]: BuilderObject[K];
          } & Record<Key, Value>
      >;

type PrettifyObject<T extends object> = {
    [K in keyof T]: T[K] extends object ? PrettifyObject<T[K]> : T[K];
} & {};
