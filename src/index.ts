import Fastify from "fastify";
import mercurius from "mercurius";
import { connect } from "mongoose";
import fastifySession from "@fastify/session";
import fastifyCookie from "fastify-cookie";
// import "./generated/typegen";
import "./typegen";

import { buildContext } from "./utils/buildContext";
import { federatedSchema } from "./schema";

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module "mercurius" {
  interface MercuriusContext
    extends PromiseType<ReturnType<typeof buildContext>> {}
}

const main = async () => {
  await connect("mongodb://root:example@localhost:27017/test", {
    authSource: "admin",
  });
  const app = Fastify();
  app.register(fastifyCookie);
  app.register(fastifySession, {
    secret: "asecretwithminimumlengthof32characters",
    cookie: {
      secure: false,
    },
  });

  app.register(mercurius, {
    schema: federatedSchema,
    context: buildContext,
    // Expose request and reply objects in context
    graphiql: "graphiql",
  });

  app.listen(3032);
};

main().catch((error) => {
  console.error(error);
});
