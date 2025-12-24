import type { BuilderAddProperty, BuilderZygoteType } from "./types.mts";

type X0 = BuilderAddProperty<"a", 1>;
type X1 = BuilderAddProperty<"b", 2, X0>;
type X2 = BuilderAddProperty<"c", 3, X1>;

let p: X0;
let q: X1 = { ...p!, b: 2 };

type x0 = X0 extends BuilderZygoteType ? true : false;
type x1 = X1 extends BuilderZygoteType ? true : false;
type x2 = X2 extends BuilderZygoteType ? true : false;

const BUILDER_SYMBOL = Symbol("BUILDER");

class ObjectBuilderHelper<T extends BuilderZygoteType = BuilderZygoteType> {
    [BUILDER_SYMBOL]: {
        internal: T;
    };

    constructor(o: T) {
        this[BUILDER_SYMBOL] = {
            internal: o,
        };
    }

    set<const KeyStringLiteral extends string, const Value, const Key>(
        key: string extends Key ? never : Key,
        value: Value,
    ) {
        // (this[BUILDER_SYMBOL].internal as T & { [K in Key]: Value} )[key] = value;
        // return this as ObjectBuilderHelper<BuilderAddProperty<Key, Value, T>>;
        type X = BuilderAddProperty<KeyStringLiteral, Value, T>;
        return new ObjectBuilderHelper<X & BuilderZygoteType>({
            ...this[BUILDER_SYMBOL].internal,
            key: value,
        });
    }

    build(): T {
        return this[BUILDER_SYMBOL].internal;
    }
}

function ObjectBuilder<Props extends string>() {
    return new ObjectBuilderHelper({} as BuilderZygoteType);
}

const obj = ObjectBuilder().set("a", 1).set("b", 2).build();

type StringLiteral<T extends string> = string extends T ? never : T;
/*
Type '{ [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<KeyStringLiteral, Value>)]: ({ [Key in keyof T]: T[Key]; } & Record<KeyStringLiteral, Value>)[K] extends object ? { [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<...>)[K]]: ({ [Key in keyof T]: T[Key]; } & Record<...>)[K][K] extends object ? { [K in keyof (...' does not satisfy the constraint 'BuilderZygoteType'.
  Types of property '[BUILDER]' are incompatible.
    Type '({ [Key in keyof T]: T[Key]; } & Record<KeyStringLiteral, Value>)[unique symbol] extends object ? { [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<...>)[unique symbol]]: ({ [Key in keyof T]: T[Key]; } & Record<...>)[unique symbol][K] extends object ? { [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<...>)[u...' is not assignable to type '"Builder"'.
      Type '({ [Key in keyof T]: T[Key]; } & Record<KeyStringLiteral, Value>)[unique symbol] | { [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<KeyStringLiteral, Value>)[unique symbol]]: ({ [Key in keyof T]: T[Key]; } & Record<...>)[unique symbol][K] extends object ? { [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<.....' is not assignable to type '"Builder"'.
        Type '{ [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<KeyStringLiteral, Value>)[unique symbol]]: ({ [Key in keyof T]: T[Key]; } & Record<KeyStringLiteral, Value>)[unique symbol][K] extends object ? { [K in keyof ({ [Key in keyof T]: T[Key]; } & Record<...>)[unique symbol][K]]: ({ [Key in keyof T]: T[Key]; } & Record...' is not assignable to type '"Builder"'.
        */
