import { objectBuilder } from "@/index";

type SchemaType = {
    id: number;
    firstName: string;
    lastName?: string;
    dateOfBirth: Date;
    email: `${string}@${string}`;
    age: number;
};

const builder = objectBuilder<SchemaType>();

const x = builder
    .set("id", 1)
    .set("firstName", "Romeo")
    .set("dateOfBirth", new Date())
    .set("email", "a@b")
    .set("age", 23)
    .set("lastName", "Sarkar")
    .build();
