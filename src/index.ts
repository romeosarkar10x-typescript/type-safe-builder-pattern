import type { BuilderAddProperty, PrettifyBuilderObject } from "@/types";

type SchemaConstraint = Record<string, unknown>;

type ObjectBuilderSetFunctionReturnType<
    T extends SchemaConstraint,
    Schema extends SchemaConstraint,
> = T extends Schema
    ? ObjectBuilderHelperWithBuildMethodType<T, Schema>
    : ObjectBuilderHelperType<T, Schema>;

interface ObjectBuilderHelperType<
    T extends SchemaConstraint,
    Schema extends SchemaConstraint,
> {
    set: <
        const Key extends keyof Schema & string,
        const Value extends Schema[Key],
        const U extends object & BuilderAddProperty<Key, Value, T> =
            BuilderAddProperty<Key, Value, T>,
    >(
        key: Key,
        value: Value,
    ) => ObjectBuilderSetFunctionReturnType<U, Schema>;
}

interface ObjectBuilderHelperWithBuildMethodType<
    T extends SchemaConstraint,
    Schema extends SchemaConstraint,
> extends ObjectBuilderHelperType<T, Schema> {
    build: () => T;
}

export function objectBuilder<const Schema extends SchemaConstraint>() {
    return objectBuilderHelper<{}, Schema>({});
}

function objectBuilderHelper<
    T extends SchemaConstraint,
    const Schema extends SchemaConstraint,
>(o: T): ObjectBuilderSetFunctionReturnType<T, Schema>;

function objectBuilderHelper<
    T extends SchemaConstraint,
    const Schema extends SchemaConstraint,
>(
    object: T,
):
    | ObjectBuilderHelperType<T, Schema>
    | ObjectBuilderHelperWithBuildMethodType<T, Schema> {
    function set<
        const Key extends keyof Schema & string,
        const Value extends Schema[Key],
        const U extends BuilderAddProperty<Key, Value, T> = BuilderAddProperty<
            Key,
            Value,
            T
        >,
    >(key: Key, value: Value): ObjectBuilderSetFunctionReturnType<U, Schema> {
        return objectBuilderHelper({
            ...object,
            [key]: value,
        } as U);
    }

    function build(): PrettifyBuilderObject<T> {
        return object;
    }

    return {
        set,
        build,
    };
}
