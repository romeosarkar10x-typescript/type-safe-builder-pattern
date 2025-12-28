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
    BuilderObject extends Record<string, unknown> = {},
> = {
    [K in keyof BuilderObject]: BuilderObject[K];
} & Record<KeyLiteral, Value>;

type BuilderDoAddProperty<
    KeyLiteral extends string,
    Value,
    BuilderObject extends Record<string, unknown> = {},
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
    BuilderObject extends Record<string, unknown> = {},
> = string extends Key
    ? never
    : PrettifyBuilderObject<BuilderDoAddProperty<Key, Value, BuilderObject>>;
/*
export type BuilderAddProperty<
    Key extends string,
    Value,
    BuilderObject extends object = object,
> = string extends Key
    ? never
    : BuilderDoAddProperty<Key, Value, BuilderObject>;
    */

export type PrettifyBuilderObject<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K];
} & {};
