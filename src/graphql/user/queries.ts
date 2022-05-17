import {
  booleanArg,
  list,
  nonNull,
  nullable,
  queryField,
  stringArg,
} from "nexus";
import { User } from "./types";
import { UserModel } from "./user";

export const readUser = queryField("readUser", {
  type: nullable(User),
  description: "Return a user",
  args: {
    id: stringArg({ description: "The user ID" }),
  },
  resolve: async (_root, { id }, _context) => {
    const user = await UserModel.findById(id);
    return user;
  },
});

export const readUsers = queryField("readUsers", {
  type: nullable(list(User)),
  description: "Return all users",
  authorize: (_root, _args, ctx) => ctx.auth.isLoggedIn(),
  resolve: async () => {
    const users = await UserModel.find();
    return users;
  },
});

export const readSession = queryField("readSession", {
  type: nonNull("Boolean"),
  description: "Return if a user is logged in",
  resolve: async (_root, _args, context) => {
    return !!context.session.user;
  },
});
