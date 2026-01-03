import { describe, test, expect } from "bun:test";
import { objectBuilder } from "@/index";

// ============================================================================
// Test Schemas
// ============================================================================

type SimpleSchema = {
    id: number;
    name: string;
};

type SchemaWithOptional = {
    id: number;
    name: string;
    nickname?: string;
};

type SchemaWithAllOptional = {
    a?: string;
    b?: number;
};

type ComplexSchema = {
    id: number;
    firstName: string;
    lastName?: string;
    dateOfBirth: Date;
    email: `${string}@${string}`;
    age: number;
};

type SchemaWithNestedObject = {
    id: number;
    metadata: {
        createdAt: Date;
        updatedAt: Date;
    };
};

type SchemaWithArray = {
    id: number;
    tags: string[];
    scores: number[];
};

type SchemaWithUnion = {
    id: number;
    status: "active" | "inactive" | "pending";
};

type SchemaWithNull = {
    id: number;
    deletedAt: Date | null;
};

type SchemaWithBoolean = {
    id: number;
    isActive: boolean;
    isVerified: boolean;
};

type SinglePropertySchema = {
    value: string;
};

type LargeSchema = {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: string;
    g: string;
    h: string;
    i: string;
    j: string;
};

// ============================================================================
// Basic Functionality Tests
// ============================================================================

describe("objectBuilder - Basic Functionality", () => {
    test("should create an empty builder", () => {
        const builder = objectBuilder<SimpleSchema>();

        expect(builder).toBeDefined();
        expect(typeof builder.set).toBe("function");
    });

    test("should build a simple object with all required properties", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Test")
            .build();

        expect(result).toEqual({ id: 1, name: "Test" });
    });

    test("should build an object with properties set in any order", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("name", "Test")
            .set("id", 42)
            .build();

        expect(result).toEqual({ id: 42, name: "Test" });
    });

    test("should handle single property schema", () => {
        const result = objectBuilder<SinglePropertySchema>()
            .set("value", "hello")
            .build();

        expect(result).toEqual({ value: "hello" });
    });
});

// ============================================================================
// Optional Properties Tests
// ============================================================================

describe("objectBuilder - Optional Properties", () => {
    test("should build without optional properties", () => {
        const result = objectBuilder<SchemaWithOptional>()
            .set("id", 1)
            .set("name", "Test")
            .build();

        expect(result).toEqual({ id: 1, name: "Test" });
    });

    test("should build with optional properties included", () => {
        const result = objectBuilder<SchemaWithOptional>()
            .set("id", 1)
            .set("name", "Test")
            .set("nickname", "Testy")
            .build();

        expect(result).toEqual({ id: 1, name: "Test", nickname: "Testy" });
    });

    test("should build with all optional schema - no properties set", () => {
        const result = objectBuilder<SchemaWithAllOptional>().build();
        expect(result).toEqual({});
    });

    test("should build with all optional schema - some properties set", () => {
        const result = objectBuilder<SchemaWithAllOptional>()
            .set("a", "hello")
            .build();

        expect(result).toEqual({ a: "hello" });
    });

    test("should build with all optional schema - all properties set", () => {
        const result = objectBuilder<SchemaWithAllOptional>()
            .set("a", "hello")
            .set("b", 42)
            .build();

        expect(result).toEqual({ a: "hello", b: 42 });
    });
});

// ============================================================================
// Complex Schema Tests
// ============================================================================

describe("objectBuilder - Complex Schema", () => {
    test("should build complex object with all properties", () => {
        const dob = new Date("1990-01-15");

        const result = objectBuilder<ComplexSchema>()
            .set("id", 1)
            .set("firstName", "Romeo")
            .set("dateOfBirth", dob)
            .set("email", "romeo@example.com")
            .set("age", 33)
            .set("lastName", "Sarkar")
            .build();

        expect(result).toEqual({
            id: 1,
            firstName: "Romeo",
            dateOfBirth: dob,
            email: "romeo@example.com",
            age: 33,
            lastName: "Sarkar",
        });
    });

    test("should build complex object without optional lastName", () => {
        const dob = new Date("1990-01-15");

        const result = objectBuilder<ComplexSchema>()
            .set("id", 1)
            .set("firstName", "Romeo")
            .set("dateOfBirth", dob)
            .set("email", "romeo@example.com")
            .set("age", 33)
            .build();

        expect(result).toEqual({
            id: 1,
            firstName: "Romeo",
            dateOfBirth: dob,
            email: "romeo@example.com",
            age: 33,
        });
        expect(result).not.toHaveProperty("lastName");
    });
});

// ============================================================================
// Special Value Types Tests
// ============================================================================

describe("objectBuilder - Special Value Types", () => {
    test("should handle Date objects", () => {
        const now = new Date();
        const result = objectBuilder<{ timestamp: Date }>()
            .set("timestamp", now)
            .build();

        expect(result.timestamp).toBe(now);
        expect(result.timestamp instanceof Date).toBe(true);
    });

    test("should handle nested objects", () => {
        const metadata = {
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-06-01"),
        };

        const result = objectBuilder<SchemaWithNestedObject>()
            .set("id", 1)
            .set("metadata", metadata)
            .build();

        expect(result).toEqual({ id: 1, metadata });
        expect(result.metadata).toBe(metadata);
    });

    test("should handle arrays", () => {
        const result = objectBuilder<SchemaWithArray>()
            .set("id", 1)
            .set("tags", ["typescript", "builder", "pattern"])
            .set("scores", [100, 95, 88])
            .build();

        expect(result).toEqual({
            id: 1,
            tags: ["typescript", "builder", "pattern"],
            scores: [100, 95, 88],
        });
    });

    test("should handle empty arrays", () => {
        const result = objectBuilder<SchemaWithArray>()
            .set("id", 1)
            .set("tags", [])
            .set("scores", [])
            .build();

        expect(result).toEqual({ id: 1, tags: [], scores: [] });
    });

    test("should handle union types", () => {
        const result1 = objectBuilder<SchemaWithUnion>()
            .set("id", 1)
            .set("status", "active")
            .build();

        const result2 = objectBuilder<SchemaWithUnion>()
            .set("id", 2)
            .set("status", "inactive")
            .build();

        const result3 = objectBuilder<SchemaWithUnion>()
            .set("id", 3)
            .set("status", "pending")
            .build();

        expect(result1.status).toBe("active");
        expect(result2.status).toBe("inactive");
        expect(result3.status).toBe("pending");
    });

    test("should handle null values", () => {
        const result1 = objectBuilder<SchemaWithNull>()
            .set("id", 1)
            .set("deletedAt", null)
            .build();

        const deletedDate = new Date();
        const result2 = objectBuilder<SchemaWithNull>()
            .set("id", 2)
            .set("deletedAt", deletedDate)
            .build();

        expect(result1.deletedAt).toBeNull();
        expect(result2.deletedAt).toBe(deletedDate);
    });

    test("should handle boolean values", () => {
        const result = objectBuilder<SchemaWithBoolean>()
            .set("id", 1)
            .set("isActive", true)
            .set("isVerified", false)
            .build();

        expect(result).toEqual({ id: 1, isActive: true, isVerified: false });
    });

    test("should handle template literal types", () => {
        const result = objectBuilder<{ email: `${string}@${string}` }>()
            .set("email", "test@example.com")
            .build();

        expect(result.email).toBe("test@example.com");
    });

    test("should handle number edge cases", () => {
        type NumberSchema = {
            integer: number;
            float: number;
            negative: number;
            zero: number;
        };

        const result = objectBuilder<NumberSchema>()
            .set("integer", 42)
            .set("float", 3.14159)
            .set("negative", -100)
            .set("zero", 0)
            .build();

        expect(result).toEqual({
            integer: 42,
            float: 3.14159,
            negative: -100,
            zero: 0,
        });
    });

    test("should handle string edge cases", () => {
        type StringSchema = {
            empty: string;
            whitespace: string;
            unicode: string;
            multiline: string;
        };

        const result = objectBuilder<StringSchema>()
            .set("empty", "")
            .set("whitespace", "   ")
            .set("unicode", "こんにちは 🎉")
            .set("multiline", "line1\nline2\nline3")
            .build();

        expect(result).toEqual({
            empty: "",
            whitespace: "   ",
            unicode: "こんにちは 🎉",
            multiline: "line1\nline2\nline3",
        });
    });
});

// ============================================================================
// Chaining Behavior Tests
// ============================================================================

describe("objectBuilder - Chaining Behavior", () => {
    test("should return a new builder instance on each set call", () => {
        const builder1 = objectBuilder<SimpleSchema>();
        const builder2 = builder1.set("id", 1);
        const builder3 = builder2.set("name", "Test");

        // Each should be a distinct builder
        expect(builder1).not.toBe(builder2);
        expect(builder2).not.toBe(builder3);
    });

    test("should maintain immutability - original builder unchanged", () => {
        const builder1 = objectBuilder<SimpleSchema>();
        const builder2 = builder1.set("id", 1);

        // builder1 should still only have set method (no build yet)
        // This tests that setting on builder2 doesn't affect builder1
        const builder3 = builder1.set("id", 999);
        const builder4 = builder3.set("name", "Different");

        const result = builder4.build();
        expect(result).toEqual({ id: 999, name: "Different" });
    });

    test("should allow branching from intermediate state", () => {
        const baseBuilder = objectBuilder<ComplexSchema>()
            .set("id", 1)
            .set("firstName", "Base")
            .set("dateOfBirth", new Date("2000-01-01"))
            .set("email", "base@test.com")
            .set("age", 24);

        const result1 = baseBuilder.set("lastName", "Branch1").build();
        const result2 = baseBuilder.set("lastName", "Branch2").build();

        expect(result1.lastName).toBe("Branch1");
        expect(result2.lastName).toBe("Branch2");
        expect(result1.firstName).toBe("Base");
        expect(result2.firstName).toBe("Base");
    });
});

// ============================================================================
// Property Immutability Tests
// ============================================================================

describe("objectBuilder - Property Immutability", () => {
    test("should prevent setting the same property twice on the same chain", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Original")
            // @ts-expect-error - Cannot set 'name' twice on the same chain
            .set("name", "Updated");
    });

    test("should prevent multiple overrides of the same property", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            // @ts-expect-error - Cannot set 'id' multiple times on the same chain
            .set("id", 2)
            // @ts-expect-error - Cannot set 'id' multiple times on the same chain
            .set("id", 3);
    });

    test("should prevent override with different value types in union", () => {
        const result = objectBuilder<SchemaWithNull>()
            .set("id", 1)
            .set("deletedAt", new Date())
            // @ts-expect-error - Cannot set 'deletedAt' twice on the same chain
            .set("deletedAt", null);
    });

    test("should allow setting a property on different branches", () => {
        const baseBuilder = objectBuilder<SimpleSchema>().set("id", 1);

        const builder1 = baseBuilder.set("name", "Branch1");
        const builder2 = baseBuilder.set("name", "Branch2");

        expect(builder1.build().name).toBe("Branch1");
        expect(builder2.build().name).toBe("Branch2");
    });
});

// ============================================================================
// Property Immutability Tests
// ============================================================================

describe("objectBuilder - Property Immutability", () => {
    test("should prevent setting the same property twice on the same chain", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Original")
            // @ts-expect-error - Cannot set 'name' twice on the same chain
            .set("name", "Updated");
    });

    test("should prevent multiple overrides of the same property", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            // @ts-expect-error - Cannot set 'id' multiple times on the same chain
            .set("id", 2)
            // @ts-expect-error - Cannot set 'id' multiple times on the same chain
            .set("id", 3);
    });

    test("should prevent override with different value types in union", () => {
        const result = objectBuilder<SchemaWithNull>()
            .set("id", 1)
            .set("deletedAt", new Date())
            // @ts-expect-error - Cannot set 'deletedAt' twice on the same chain
            .set("deletedAt", null);
    });

    test("should allow setting a property on different branches", () => {
        const baseBuilder = objectBuilder<SimpleSchema>().set("id", 1);

        const builder1 = baseBuilder.set("name", "Branch1");
        const builder2 = baseBuilder.set("name", "Branch2");

        expect(builder1.build().name).toBe("Branch1");
        expect(builder2.build().name).toBe("Branch2");
    });
});

// ============================================================================
// Property Immutability - Runtime Validation Tests
// ============================================================================

describe("objectBuilder - Property Immutability Runtime", () => {
    test("setting the same property twice should use the first value", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Original")
            // @ts-ignore
            .set("name", "Updated")
            // @ts-ignore
            .build();

        expect(result.name).toBe("Original");
    });

    test("multiple overrides should use the first value", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            // @ts-ignore
            .set("id", 2)
            // @ts-ignore
            .set("id", 3)
            // @ts-ignore
            .set("name", "Test")
            .build();

        expect(result.id).toBe(1);
        expect(result.name).toBe("Test");
    });

    test("override with different union types should use first value", () => {
        const date = new Date();
        const result = objectBuilder<SchemaWithNull>()
            .set("deletedAt", date)
            .set("id", 1)
            // @ts-ignore
            .set("deletedAt", null)
            // @ts-ignore
            .build();

        expect(result.deletedAt).toBe(date);
    });

    test("branching preserves immutability at runtime", () => {
        const baseBuilder = objectBuilder<SimpleSchema>().set("id", 1);

        const result1 = baseBuilder.set("name", "Branch1").build();
        const result2 = baseBuilder.set("name", "Branch2").build();

        // Each branch should have its own value
        expect(result1.name).toBe("Branch1");
        expect(result2.name).toBe("Branch2");

        // Building again should give same results
        expect(baseBuilder.set("name", "Branch1").build().name).toBe("Branch1");
    });

    test("overriding optional property should use first value", () => {
        const result = objectBuilder<SchemaWithOptional>()
            .set("id", 1)
            .set("name", "Test")
            .set("nickname", "First")
            // @ts-ignore
            .set("nickname", "Second")
            // @ts-ignore
            .build();

        expect(result.nickname).toBe("First");
    });

    test("complex values override preserves reference of first set", () => {
        const date1 = new Date("2024-01-01");
        const date2 = new Date("2024-12-31");

        const result = objectBuilder<ComplexSchema>()
            .set("id", 1)
            .set("firstName", "Test")
            .set("dateOfBirth", date1)
            // @ts-ignore
            .set("dateOfBirth", date2)
            // @ts-ignore
            .set("email", "test@test.com")
            // @ts-ignore
            .set("age", 25)
            .build();

        expect(result.dateOfBirth).toBe(date1);
        expect(result.dateOfBirth).not.toBe(date2);
    });

    test("array override uses first set value", () => {
        const tags1 = ["a", "b"];
        const tags2 = ["x", "y", "z"];

        const result = objectBuilder<SchemaWithArray>()
            .set("id", 1)
            .set("tags", tags1)
            .set("tags" as any, tags2)
            // @ts-ignore
            .set("scores", [1, 2, 3])
            .build();

        expect(result.tags).toBe(tags1);
        expect(result.tags).not.toBe(tags2);
        expect(result.tags).toEqual(["a", "b"]);
    });

    test("nested object override uses first set value", () => {
        const metadata1 = {
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-06-01"),
        };

        const metadata2 = {
            createdAt: new Date("2024-12-01"),
            updatedAt: new Date("2024-12-31"),
        };

        const result = objectBuilder<SchemaWithNestedObject>()
            .set("id", 1)
            .set("metadata", metadata1)
            // @ts-ignore
            .set("metadata", metadata2)
            // @ts-ignore
            .build();

        expect(result.metadata).toBe(metadata1);
        expect(result.metadata).not.toBe(metadata2);
    });
});

// ============================================================================
// Large Schema Tests
// ============================================================================

describe("objectBuilder - Large Schema", () => {
    test("should handle schema with many properties", () => {
        const result = objectBuilder<LargeSchema>()
            .set("a", "A")
            .set("b", "B")
            .set("c", "C")
            .set("d", "D")
            .set("e", "E")
            .set("f", "F")
            .set("g", "G")
            .set("h", "H")
            .set("i", "I")
            .set("j", "J")
            .build();

        expect(result).toEqual({
            a: "A",
            b: "B",
            c: "C",
            d: "D",
            e: "E",
            f: "F",
            g: "G",
            h: "H",
            i: "I",
            j: "J",
        });
    });

    test("should handle properties set in random order", () => {
        const result = objectBuilder<LargeSchema>()
            .set("j", "J")
            .set("a", "A")
            .set("e", "E")
            .set("c", "C")
            .set("h", "H")
            .set("b", "B")
            .set("f", "F")
            .set("i", "I")
            .set("d", "D")
            .set("g", "G")
            .build();

        expect(Object.keys(result).sort()).toEqual([
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
        ]);
    });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe("objectBuilder - Edge Cases", () => {
    test("should handle undefined as optional value", () => {
        const result = objectBuilder<SchemaWithOptional>()
            .set("id", 1)
            .set("name", "Test")
            .set("nickname", undefined as unknown as string)
            .build();

        expect(result).toHaveProperty("nickname");
        expect(result.nickname).toBeUndefined();
    });

    test("should preserve object reference for nested objects", () => {
        const nestedObj = { createdAt: new Date(), updatedAt: new Date() };

        const result = objectBuilder<SchemaWithNestedObject>()
            .set("id", 1)
            .set("metadata", nestedObj)
            .build();

        expect(result.metadata).toBe(nestedObj);
    });

    test("should preserve array reference", () => {
        const tags = ["a", "b", "c"];

        const result = objectBuilder<SchemaWithArray>()
            .set("id", 1)
            .set("tags", tags)
            .set("scores", [1, 2, 3])
            .build();

        expect(result.tags).toBe(tags);
    });
});

// ============================================================================
// Builder State Tests
// ============================================================================

describe("objectBuilder - Builder State", () => {
    test("build method should be available after all required props are set", () => {
        const builder = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Test");

        expect(typeof builder.build).toBe("function");
    });

    test("set method should still be available after build is available", () => {
        const builder = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Test");

        expect(typeof builder.set).toBe("function");
    });

    test("calling build multiple times returns same structure", () => {
        const builder = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Test");

        const result1 = builder.build();
        const result2 = builder.build();

        expect(result1).toEqual(result2);
    });

    test("building does not affect further chaining", () => {
        const builder = objectBuilder<SchemaWithOptional>()
            .set("id", 1)
            .set("name", "Test");

        const result1 = builder.build();
        const result2 = builder.set("nickname", "Nick").build();

        expect(result1).toEqual({ id: 1, name: "Test" });
        expect(result2).toEqual({ id: 1, name: "Test", nickname: "Nick" });
    });
});

// ============================================================================
// Real-World Usage Patterns Tests
// ============================================================================

describe("objectBuilder - Real-World Usage Patterns", () => {
    test("should work with user registration pattern", () => {
        type UserRegistration = {
            username: string;
            email: `${string}@${string}`;
            password: string;
            acceptedTerms: boolean;
            newsletter?: boolean;
        };

        const result = objectBuilder<UserRegistration>()
            .set("username", "johndoe")
            .set("email", "john@example.com")
            .set("password", "securePassword123")
            .set("acceptedTerms", true)
            .set("newsletter", true)
            .build();

        expect(result).toEqual({
            username: "johndoe",
            email: "john@example.com",
            password: "securePassword123",
            acceptedTerms: true,
            newsletter: true,
        });
    });

    test("should work with API request pattern", () => {
        type APIRequest = {
            method: "GET" | "POST" | "PUT" | "DELETE";
            url: string;
            headers: Record<string, string>;
            body?: unknown;
        };

        const result = objectBuilder<APIRequest>()
            .set("method", "POST")
            .set("url", "/api/users")
            .set("headers", { "Content-Type": "application/json" })
            .set("body", { name: "Test User" })
            .build();

        expect(result).toEqual({
            method: "POST",
            url: "/api/users",
            headers: { "Content-Type": "application/json" },
            body: { name: "Test User" },
        });
    });

    test("should work with configuration pattern", () => {
        type DatabaseConfig = {
            host: string;
            port: number;
            database: string;
            username: string;
            password: string;
            ssl?: boolean;
            poolSize?: number;
        };

        const result = objectBuilder<DatabaseConfig>()
            .set("host", "localhost")
            .set("port", 5432)
            .set("database", "myapp")
            .set("username", "admin")
            .set("password", "secret")
            .set("ssl", true)
            .set("poolSize", 10)
            .build();

        expect(result).toEqual({
            host: "localhost",
            port: 5432,
            database: "myapp",
            username: "admin",
            password: "secret",
            ssl: true,
            poolSize: 10,
        });
    });

    test("should work with event pattern", () => {
        type Event = {
            type: string;
            timestamp: Date;
            payload: Record<string, unknown>;
            metadata?: {
                source: string;
                version: string;
            };
        };

        const timestamp = new Date();
        const result = objectBuilder<Event>()
            .set("type", "user.created")
            .set("timestamp", timestamp)
            .set("payload", { userId: "123", email: "test@test.com" })
            .set("metadata", { source: "api", version: "1.0" })
            .build();

        expect(result).toEqual({
            type: "user.created",
            timestamp,
            payload: { userId: "123", email: "test@test.com" },
            metadata: { source: "api", version: "1.0" },
        });
    });
});

// ============================================================================
// Type Safety Tests (Runtime verification of type constraints)
// ============================================================================

describe("objectBuilder - Type Constraint Verification", () => {
    test("should correctly type the built object", () => {
        const result = objectBuilder<SimpleSchema>()
            .set("id", 1)
            .set("name", "Test")
            .build();

        // Runtime type checks
        expect(typeof result.id).toBe("number");
        expect(typeof result.name).toBe("string");
    });

    test("should maintain correct types for complex values", () => {
        const date = new Date();
        const result = objectBuilder<ComplexSchema>()
            .set("id", 1)
            .set("firstName", "Test")
            .set("dateOfBirth", date)
            .set("email", "test@test.com")
            .set("age", 25)
            .build();

        expect(result.dateOfBirth instanceof Date).toBe(true);
        expect(typeof result.age).toBe("number");
        expect(typeof result.firstName).toBe("string");
    });
});
