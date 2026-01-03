import type { BuilderAddProperty, PrettifyBuilderObject } from "./types";

type SchemaConstraint = Record<string, unknown>;

type ObjectBuilderSetFunctionReturnType<
    Current extends SchemaConstraint,
    Schema extends SchemaConstraint,
> = Current extends Schema
    ? ObjectBuilderHelperWithBuildMethodType<Current, Schema>
    : ObjectBuilderHelperType<Current, Schema>;

interface ObjectBuilderHelperType<
    Current extends SchemaConstraint,
    Schema extends SchemaConstraint,
> {
    set: <
        const Key extends Exclude<keyof Schema, keyof Current> & string,
        const Value extends Schema[Key],
        const Next extends object & BuilderAddProperty<Key, Value, Current> =
            BuilderAddProperty<Key, Value, Current>,
    >(
        key: Key,
        value: Value,
    ) => ObjectBuilderSetFunctionReturnType<Next, Schema>;
}

interface ObjectBuilderHelperWithBuildMethodType<
    Current extends SchemaConstraint,
    Schema extends SchemaConstraint,
> extends ObjectBuilderHelperType<Current, Schema> {
    build: () => Current;
}

export function objectBuilder<const Schema extends SchemaConstraint>() {
    return objectBuilderHelper<{}, Schema>({});
}

function objectBuilderHelper<
    const Current extends SchemaConstraint,
    const Schema extends SchemaConstraint,
>(o: Current): ObjectBuilderSetFunctionReturnType<Current, Schema>;

function objectBuilderHelper<
    const Current extends SchemaConstraint,
    const Schema extends SchemaConstraint,
>(
    object: Current,
):
    | ObjectBuilderHelperType<Current, Schema>
    | ObjectBuilderHelperWithBuildMethodType<Current, Schema> {
    function set<
        const Key extends Exclude<keyof Schema, keyof Current> & string,
        const Value extends Schema[Key],
        const Next extends BuilderAddProperty<Key, Value, Current> =
            BuilderAddProperty<Key, Value, Current>,
    >(
        key: Key,
        value: Value,
    ): ObjectBuilderSetFunctionReturnType<Next, Schema> {
        return objectBuilderHelper({
            [key]: value,
            ...object,
        } as Next);
    }

    function build(): PrettifyBuilderObject<Current> {
        return object;
    }

    return {
        set,
        build,
    };
}
