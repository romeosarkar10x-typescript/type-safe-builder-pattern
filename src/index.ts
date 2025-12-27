import type { BuilderAddProperty, PrettifyObject } from "@/types";

const BUILDER_SYMBOL = Symbol("BUILDER");

class ObjectBuilderHelper<T extends object> {
    [BUILDER_SYMBOL]: {
        internal: T;
    };

    constructor(o: T) {
        this[BUILDER_SYMBOL] = {
            internal: o,
        };
    }

    set<const Key extends string, const Value>(
        key: string extends Key ? never : Key,
        value: Value,
    ) {
        type U = BuilderAddProperty<Key, Value, T>;

        return new ObjectBuilderHelper<U>({
            ...this[BUILDER_SYMBOL].internal,
            [key]: value,
        } as U);
    }

    build(): PrettifyObject<T> {
        return this[BUILDER_SYMBOL].internal;
    }
}

export function ObjectBuilder() {
    return new ObjectBuilderHelper({});
}
