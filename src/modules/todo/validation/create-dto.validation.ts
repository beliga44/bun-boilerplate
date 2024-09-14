import {t} from "elysia";

export default t.Object({
    name: t.String({
        minLength: 3,
        error: "Name is required",
    }),
    description: t.String({
        minLength: 3,
        error: "Description is required",
    }),
});