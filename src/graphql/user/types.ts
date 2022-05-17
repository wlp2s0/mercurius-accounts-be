import { interfaceType, objectType } from "nexus";
import { UserModel } from "./user";

export const Node = interfaceType({
  name: "Node",
  resolveType: () => null,
  definition(t) {
    t.id("id");
  },
});

export const Expense = objectType({
  name: "Expense",
  description: "A simple expense object",
  definition(t) {
    t.implements(Node);

    t.list.field("users", {
      type: User,
      resolve: async ({ id: expenseId, ...args }) => {
        console.log({ args });
        const users = await UserModel.find({ expenses: { $in: [expenseId] } });
        return users;
      },
    });
  },
});

export const User = objectType({
  name: "User",
  description: "An user object",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("email", { description: "The user email" });
    t.string("name", { description: "The user email" });
  },
});
