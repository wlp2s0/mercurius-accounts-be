import { makeSchema, fieldAuthorizePlugin } from "nexus";
import { join } from "path";
import { UserMutation, UserQuery } from "./graphql/user";
import { transformSchemaFederation } from "graphql-transform-federation";
import { Expense, User } from "./graphql/user/types";

const schema = makeSchema({
  types: [Expense, User, UserQuery, UserMutation],
  outputs: {
    typegen: join(__dirname, "typegen.ts"),
    schema: join(__dirname, "generated", "schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "./utils/buildContext.ts"),
    export: "Context",
  },
  plugins: [fieldAuthorizePlugin()],
});

export const federatedSchema = transformSchemaFederation(schema, {
  User: {
    keyFields: ["id"],
  },
  Expense: {
    extend: true,
    keyFields: ["id"],
    fields: {
      id: {
        external: true,
      },
    },
  },
});
