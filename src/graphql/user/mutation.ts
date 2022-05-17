import { mutationField, nonNull, nullable, stringArg } from "nexus";
import { User } from "./types";
import { UserModel } from "./user";

export const createUser = mutationField("createUser", {
  type: nonNull(User),
  description: "Create a new user",
  args: {
    name: stringArg({ description: "The user name" }),
    email: nonNull(stringArg({ description: "The user email" })),
  },
  resolve: async (_root, { name, email }) => {
    const user = new UserModel({ name, email });
    await user.save();
    return user;
  },
});

export const login = mutationField("login", {
  type: nonNull("Boolean"),
  description: "Create a new user",
  args: {
    id: stringArg({ description: "The user id" }),
  },
  resolve: async (_root, { id }, context) => {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("Wrong credentials");
    }
    context.session.set("user", user.toObject());
    context.session.user = user.toObject();
    return !!user;
  },
});
