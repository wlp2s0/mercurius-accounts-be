import { FastifyRequest, FastifyReply } from "fastify";
import { IUser } from "../graphql/user/user";
import type * as Fastify from "fastify";

declare module "fastify" {
  interface Session {
    user?: IUser;
  }
}

export interface Context {
  session: Fastify.Session;
  user?: IUser;
  auth: {
    isLoggedIn: () => boolean;
  };
}

// Make a builder (?)
export const buildContext = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<Context> => {
  const context: Partial<Context> = { session: request.session };
  if (!context.auth) {
    context.auth = {
      isLoggedIn: () => !!context.user,
    };
  }

  try {
    if (request.session.user) {
      context.user = request.session.user;
    }
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader?.includes("Basic")) {
    }

    if (authorizationHeader?.includes("Bearer")) {
      // const token = authorizationHeader.replace("Bearer ", "")
      // const payload = await verifyToken(token)
      // context = { payload }
    }
  } catch (error) {
    console.error(error);
  }
  return context as Context;
};
