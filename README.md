# Type Safe Builder Pattern

A lightweight, zero-dependency TypeScript implementation of the **Builder Design Pattern**. This package ensures total type safety by preventing you from calling `.build()` until all required properties of your schema are defined.

## ✨ Key Features

- **🔒 Type Completion Enforcement**: The `.build()` method is hidden via TypeScript's type system until every required property is set.
- **🧊 Immutable by Design**: Every `.set()` call returns a new instance of the builder, allowing for easy branching and state sharing without side effects.
- **🛠️ Complex Type Support**: Seamlessly handles Optionals, Unions, Enums, Nested Objects, Arrays, and Template Literals.
- **🚀 Bun Optimized**: Developed and tested using the Bun runtime for maximum performance.

---

## 📦 Installation

```bash
# Using npm
npm install type-safe-builder-pattern

# Using bun
bun add type-safe-builder-pattern

```

---

## 🚀 Quick Start

The core power of this library is that it makes "incomplete" objects impossible to build.

```typescript
import { objectBuilder } from "type-safe-builder-pattern";

type User = {
    id: number;
    username: string;
    email: string;
    isAdmin?: boolean; // Optional
};

const builder = objectBuilder<User>()
    .set("id", 1)
    .set("username", "romeosarkar");

// ERROR: .build() does not exist yet because 'email' is missing!
// builder.build();

const user = builder.set("email", "romeo@example.com").build(); // Now it works!

console.log(user);
// { id: 1, username: "romeosarkar", email: "romeo@example.com" }
```

---

## 💡 Advanced Usage

### 🌿 Immutability & Branching

Since each `.set()` returns a new instance, you can create a base configuration and branch off it.

```typescript
const baseConfig = objectBuilder<Config>()
    .set("host", "localhost")
    .set("port", 5432);

const devConfig = baseConfig.set("database", "dev_db").build();
const prodConfig = baseConfig.set("database", "prod_db").build();
```

### 🧩 Nested Objects & Arrays

The builder maintains full type safety for complex nested structures.

```typescript
type Project = {
    name: string;
    tags: string[];
    metadata: {
        version: string;
    };
};

const myProject = objectBuilder<Project>()
    .set("name", "TypeSafeApp")
    .set("tags", ["typescript", "builder"])
    .set("metadata", { version: "1.0.0" })
    .build();
```

---

## 🛠️ Development

This project uses [Bun](https://bun.sh) for development and testing.

### Prerequisites

- Bun >= 1.x
- Node.js >= 25 (for runtime compatibility)

### Setup

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build the project
bun run build

# Format code
bun run format

```

---

## 📄 License

MIT © [Romeo Sarkar](https://www.google.com/search?q=https://github.com/romeosarkar10x-typescript)

---

### Why use this instead of a plain object?

In large-scale applications, creating complex objects with many required fields can become messy. Using this builder:

1. **Prevents Runtime Errors**: You can't accidentally forget a field.
2. **Improves Readability**: Named `.set(key, value)` calls are often clearer than large object literals.
3. **Encourages Immutability**: Easier to maintain state in functional environments.
