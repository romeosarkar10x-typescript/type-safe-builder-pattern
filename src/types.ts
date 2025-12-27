// declare const BUILDER: unique symbol;

// export type BuilderZygoteType = {};

/*
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
      */

type BuilderDoAddUniqueProperty<
    KeyLiteral extends string,
    Value,
    BuilderObject extends object = object,
> = {
    [K in keyof BuilderObject]: BuilderObject[K];
} & Record<KeyLiteral, Value>;

type BuilderDoAddProperty<
    KeyLiteral extends string,
    Value,
    BuilderObject extends object = object,
> = BuilderDoAddUniqueProperty<
    KeyLiteral,
    Value,
    KeyLiteral extends keyof BuilderObject
        ? Omit<BuilderObject, KeyLiteral>
        : BuilderObject
>;

export type BuilderAddProperty<
    Key extends string,
    Value,
    BuilderObject extends object = object,
> = string extends Key
    ? never
    : PrettifyObject<BuilderDoAddProperty<Key, Value, BuilderObject>>;
/*
export type BuilderAddProperty<
    Key extends string,
    Value,
    BuilderObject extends object = object,
> = string extends Key
    ? never
    : BuilderDoAddProperty<Key, Value, BuilderObject>;
    */

export type PrettifyObject<T extends object> = {
    [K in keyof T]: T[K] extends object
        ? T[K] extends Function
            ? T[K]
            : PrettifyObject<T[K]>
        : T[K];
} & {};
