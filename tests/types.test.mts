import { describe, test, expectTypeOf } from "bun:test";
import type { BuilderAddProperty } from "@/types";

describe("BuilderAddProperty", () => {
    test("should add a single property to empty zygote", () => {
        type Result = BuilderAddProperty<"name", string>;

        expectTypeOf<Result>().toHaveProperty("name");
        expectTypeOf<Result>().toEqualTypeOf<{ name: string }>();
    });

    test("should add multiple properties sequentially", () => {
        type Step0 = {};
        type Step1 = BuilderAddProperty<"name", string, Step0>;
        type Step2 = BuilderAddProperty<"age", number, Step1>;
        type Step3 = BuilderAddProperty<"isActive", boolean, Step2>;

        expectTypeOf<Step3>().toEqualTypeOf<{
            name: string;
            age: number;
            isActive: boolean;
        }>();
    });

    test("should preserve existing properties when adding new ones", () => {
        type WithName = BuilderAddProperty<"name", string, {}>;
        type WithNameAndAge = BuilderAddProperty<"age", number, WithName>;

        expectTypeOf<WithNameAndAge>().toHaveProperty("name");
        expectTypeOf<WithNameAndAge>().toHaveProperty("age");
    });

    test("should handle different value types", () => {
        type WithString = BuilderAddProperty<"str", string>;
        type WithNumber = BuilderAddProperty<"num", number>;
        type WithBoolean = BuilderAddProperty<"bool", boolean>;
        type WithArray = BuilderAddProperty<"arr", string[]>;
        type WithObject = BuilderAddProperty<"obj", { nested: number }>;

        expectTypeOf<WithString>().toEqualTypeOf<{ str: string }>();
        expectTypeOf<WithNumber>().toEqualTypeOf<{ num: number }>();
        expectTypeOf<WithBoolean>().toEqualTypeOf<{ bool: boolean }>();
        expectTypeOf<WithArray>().toEqualTypeOf<{ arr: string[] }>();
        expectTypeOf<WithObject>().toEqualTypeOf<{ obj: { nested: number } }>();
    });

    test("should reject non-literal string keys", () => {
        type InvalidResult = BuilderAddProperty<string, number>;
        expectTypeOf<InvalidResult>().toBeNever();
    });

    test("should handle union types as values", () => {
        type WithUnion = BuilderAddProperty<"status", "active" | "inactive">;

        expectTypeOf<WithUnion>().toEqualTypeOf<{
            status: "active" | "inactive";
        }>();
    });

    test("should handle optional types as values", () => {
        type WithOptional = BuilderAddProperty<"maybe", string | undefined>;

        expectTypeOf<WithOptional>().toEqualTypeOf<{
            maybe: string | undefined;
        }>();
    });

    test("should handle null as a value", () => {
        type WithNull = BuilderAddProperty<"nullable", string | null>;

        expectTypeOf<WithNull>().toEqualTypeOf<{
            nullable: string | null;
        }>();
    });

    test("should handle complex nested objects", () => {
        type ComplexValue = {
            user: {
                profile: {
                    name: string;
                    age: number;
                };
                settings: {
                    theme: "light" | "dark";
                };
            };
        };

        type WithComplex = BuilderAddProperty<"data", ComplexValue>;

        expectTypeOf<WithComplex>().toEqualTypeOf<{ data: ComplexValue }>();
    });

    test("should create independent type branches", () => {
        type Base = BuilderAddProperty<"id", number>;

        type Branch1 = BuilderAddProperty<"name", string, Base>;

        expectTypeOf<Branch1>().toEqualTypeOf<{ id: number; name: string }>();
        expectTypeOf<Branch1>().not.toEqualTypeOf<{ email: string }>();

        type Branch2 = BuilderAddProperty<"email", string, Base>;

        expectTypeOf<Branch2>().toEqualTypeOf<{ id: number; email: string }>();
        expectTypeOf<Branch2>().not.toEqualTypeOf<{ name: string }>();
    });

    test("should handle function types as values", () => {
        function fn(x: number): string {
            return x.toExponential();
        }

        type WithFunction = BuilderAddProperty<"callback", typeof fn>;

        expectTypeOf<WithFunction>().toEqualTypeOf<{
            callback: (x: number) => string;
        }>();
    });

    test("should handle generic types as values", () => {
        type WithPromise = BuilderAddProperty<"async", Promise<string>>;
        type WithArray = BuilderAddProperty<"list", Array<number>>;

        expectTypeOf<WithPromise>().toEqualTypeOf<{ async: Promise<string> }>();
        expectTypeOf<WithArray>().toEqualTypeOf<{ list: Array<number> }>();
    });

    test("should maintain type safety with literal types", () => {
        type WithLiteral = BuilderAddProperty<"type", "user">;

        // should accept only the literal type
        expectTypeOf<WithLiteral>().toEqualTypeOf<{ type: "user" }>();
        expectTypeOf<WithLiteral>().not.toEqualTypeOf<{ type: string }>();
    });

    test("should handle numeric keys (edge case)", () => {
        const num = 2;
        type NumericKey = typeof num;

        // @ts-expect-error: Type 'number' does not satisfy the constraint 'string'.
        type Result = BuilderAddProperty<NumericKey, number>;
    });

    test("should handle symbol keys (edge case)", () => {
        const sym = Symbol.for("TEST");
        type SymbolKey = typeof sym;

        // @ts-expect-error: Type 'typeof sym' does not satisfy the constraint 'string'.
        type Result = BuilderAddProperty<SymbolKey, number>;
    });

    test("should create flattened object types (prettified)", () => {
        type Step0 = {};
        type Step1 = BuilderAddProperty<"a", number, Step0>;
        type Step2 = BuilderAddProperty<"b", string, Step1>;

        // The resulting type should be a clean object, not an intersection
        type keys = keyof Step2;
        expectTypeOf<keys>().toEqualTypeOf<"a" | "b">();
    });

    test("should handle readonly values", () => {
        type WithReadonly = BuilderAddProperty<
            "immutable",
            Readonly<{ value: number }>
        >;

        expectTypeOf<WithReadonly>().toEqualTypeOf<{
            immutable: { readonly value: number };
        }>();
    });

    test("should build up complex real-world types", () => {
        type UserBuilder = {};
        type WithID = BuilderAddProperty<"id", string, UserBuilder>;
        type WithName = BuilderAddProperty<"name", string, WithID>;
        type WithEmail = BuilderAddProperty<"email", string, WithName>;
        type WithAge = BuilderAddProperty<"age", number, WithEmail>;
        type WithRoles = BuilderAddProperty<
            "roles",
            Array<"admin" | "user">,
            WithAge
        >;

        type FinalUser = WithRoles;

        expectTypeOf<FinalUser>().toEqualTypeOf<{
            id: string;
            name: string;
            email: string;
            age: number;
            roles: Array<"admin" | "user">;
        }>();

        expectTypeOf<FinalUser>().toHaveProperty("id");
        expectTypeOf<FinalUser>().toHaveProperty("name");
        expectTypeOf<FinalUser>().toHaveProperty("email");
        expectTypeOf<FinalUser>().toHaveProperty("age");
        expectTypeOf<FinalUser>().toHaveProperty("roles");
    });
});

describe("Type Safety Edge Cases", () => {
    test("should prevent duplicate keys (last write wins)", () => {
        type Step0 = {};
        type Step1 = BuilderAddProperty<"value", number, Step0>;
        type Step2 = BuilderAddProperty<"value", string, Step1>;

        expectTypeOf<Step2>().toEqualTypeOf<{ value: string }>();
        expectTypeOf<Step2>().not.toEqualTypeOf<{ value: number }>();
    });

    test("should handle empty string keys", () => {
        type WithEmpty = BuilderAddProperty<"", number>;

        expectTypeOf<WithEmpty>().toHaveProperty("");
    });

    test("should handle keys with special characters", () => {
        type WithDash = BuilderAddProperty<"user-name", string>;
        type WithDot = BuilderAddProperty<"user.name", string>;
        type WithUnderscore = BuilderAddProperty<"user_name", string>;
        type WithSpace = BuilderAddProperty<"user name", string>;
        type WithAt = BuilderAddProperty<"user@domain", string>;
        type WithHash = BuilderAddProperty<"item#123", string>;
        type WithDollar = BuilderAddProperty<"$price", string>;
        type WithPercent = BuilderAddProperty<"discount%", string>;
        type WithAmpersand = BuilderAddProperty<"name&value", string>;
        type WithAsterisk = BuilderAddProperty<"field*required", string>;
        type WithPlus = BuilderAddProperty<"total+tax", string>;
        type WithEquals = BuilderAddProperty<"key=value", string>;
        type WithBrackets = BuilderAddProperty<"array[0]", string>;
        type WithBraces = BuilderAddProperty<"obj{prop}", string>;
        type WithPipe = BuilderAddProperty<"option|default", string>;
        type WithBackslash = BuilderAddProperty<"path\\file", string>;
        type WithForwardSlash = BuilderAddProperty<"path/file", string>;
        type WithColon = BuilderAddProperty<"namespace:key", string>;
        type WithSemicolon = BuilderAddProperty<"cmd;params", string>;
        type WithQuotes = BuilderAddProperty<'it\'s"quoted"', string>;
        type WithLessThan = BuilderAddProperty<"value<10", string>;
        type WithGreaterThan = BuilderAddProperty<"value>10", string>;
        type WithComma = BuilderAddProperty<"first,last", string>;
        type WithQuestion = BuilderAddProperty<"is?valid", string>;
        type WithTilde = BuilderAddProperty<"~approximate", string>;
        type WithBacktick = BuilderAddProperty<"code`snippet", string>;
        type WithCaret = BuilderAddProperty<"power^2", string>;
        type WithMultiple = BuilderAddProperty<
            "user-name@domain.com_v2",
            string
        >;

        expectTypeOf<WithDash>().toEqualTypeOf<{ "user-name": string }>();
        expectTypeOf<WithDot>().toEqualTypeOf<{ "user.name": string }>();
        expectTypeOf<WithUnderscore>().toEqualTypeOf<{ user_name: string }>();
        expectTypeOf<WithSpace>().toEqualTypeOf<{ "user name": string }>();
        expectTypeOf<WithAt>().toEqualTypeOf<{ "user@domain": string }>();
        expectTypeOf<WithHash>().toEqualTypeOf<{ "item#123": string }>();
        expectTypeOf<WithDollar>().toEqualTypeOf<{ $price: string }>();
        expectTypeOf<WithPercent>().toEqualTypeOf<{ "discount%": string }>();
        expectTypeOf<WithAmpersand>().toEqualTypeOf<{ "name&value": string }>();
        expectTypeOf<WithAsterisk>().toEqualTypeOf<{
            "field*required": string;
        }>();
        expectTypeOf<WithPlus>().toEqualTypeOf<{ "total+tax": string }>();
        expectTypeOf<WithEquals>().toEqualTypeOf<{ "key=value": string }>();
        expectTypeOf<WithBrackets>().toEqualTypeOf<{ "array[0]": string }>();
        expectTypeOf<WithBraces>().toEqualTypeOf<{ "obj{prop}": string }>();
        expectTypeOf<WithPipe>().toEqualTypeOf<{ "option|default": string }>();
        expectTypeOf<WithBackslash>().toEqualTypeOf<{ "path\\file": string }>();
        expectTypeOf<WithForwardSlash>().toEqualTypeOf<{
            "path/file": string;
        }>();
        expectTypeOf<WithColon>().toEqualTypeOf<{ "namespace:key": string }>();
        expectTypeOf<WithSemicolon>().toEqualTypeOf<{ "cmd;params": string }>();
        expectTypeOf<WithQuotes>().toEqualTypeOf<{ 'it\'s"quoted"': string }>();
        expectTypeOf<WithLessThan>().toEqualTypeOf<{ "value<10": string }>();
        expectTypeOf<WithGreaterThan>().toEqualTypeOf<{ "value>10": string }>();
        expectTypeOf<WithComma>().toEqualTypeOf<{ "first,last": string }>();
        expectTypeOf<WithQuestion>().toEqualTypeOf<{ "is?valid": string }>();
        expectTypeOf<WithTilde>().toEqualTypeOf<{ "~approximate": string }>();
        expectTypeOf<WithBacktick>().toEqualTypeOf<{
            "code`snippet": string;
        }>();
        expectTypeOf<WithCaret>().toEqualTypeOf<{ "power^2": string }>();
        expectTypeOf<WithMultiple>().toEqualTypeOf<{
            "user-name@domain.com_v2": string;
        }>();
    });

    test("should handle very long property chains", () => {
        type Chain0 = {};
        type Chain1 = BuilderAddProperty<"a", 1, Chain0>;
        type Chain2 = BuilderAddProperty<"b", 2, Chain1>;
        type Chain3 = BuilderAddProperty<"c", 3, Chain2>;
        type Chain4 = BuilderAddProperty<"d", 4, Chain3>;
        type Chain5 = BuilderAddProperty<"e", 5, Chain4>;
        type Chain6 = BuilderAddProperty<"f", 6, Chain5>;
        type Chain7 = BuilderAddProperty<"g", 7, Chain6>;
        type Chain8 = BuilderAddProperty<"h", 8, Chain7>;
        type Chain9 = BuilderAddProperty<"i", 9, Chain8>;

        expectTypeOf<Chain9>().toEqualTypeOf<{
            a: 1;
            b: 2;
            c: 3;
            d: 4;
            e: 5;
            f: 6;
            g: 7;
            h: 8;
            i: 9;
        }>();
    });
});
