import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import express from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from "body-parser";
import cors from "cors";
import { readFileSync } from "fs";
import { PubSub } from "graphql-subscriptions";
import { GraphQLScalarType } from "graphql";
import lifts from "./data/lifts.json" assert { type: "json" };
import trails from "./data/trails.json" assert { type: "json" };

const pubsub = new PubSub();

const schemaString = readFileSync(
  "./typeDefs.graphql",
  "UTF-8"
);

const resolvers = {
  Query: {
    allLifts: (parent, { status }) =>
      !status
        ? lifts
        : lifts.filter((lift) => lift.status === status),
    findLiftById: (parent, { id }) =>
      lifts.find((lift) => id === lift.id),
    liftCount: (parent, { status }) =>
      !status
        ? lifts.length
        : lifts.filter((lift) => lift.status === status)
            .length,
    allTrails: (parent, { status }) =>
      !status
        ? trails
        : trails.filter((trail) => trail.status === status),
    findTrailByName: (parent, { name }) =>
      trails.find((trail) => name === trail.name),
    trailCount: (parent, { status }) =>
      !status
        ? trails.length
        : trails.filter((trail) => trail.status === status)
            .length,
  },
  Mutation: {
    setLiftStatus: (parent, { id, status }) => {
      let updatedLift = lifts.find(
        (lift) => id === lift.id
      );
      updatedLift.status = status;
      pubsub.publish("lift-status-change", {
        liftStatusChange: {
          lift: updatedLift,
          changed: new Date(),
        },
      });
      return {
        lift: updatedLift,
        changed: new Date(),
      };
    },
    setTrailStatus: (parent, { id, status }) => {
      let updatedTrail = trails.find(
        (trail) => id === trail.id
      );
      updatedTrail.status = status;
      return updatedTrail;
    },
  },
  Lift: {
    trailAccess: (parent) =>
      parent.trails.map((id) =>
        trails.find((t) => id === t.id)
      ),
  },
  Trail: {
    accessedByLifts: (parent) =>
      parent.lift.map((id) =>
        lifts.find((l) => id === l.id)
      ),
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => new Date(ast.value),
  }),
  Subscription: {
    liftStatusChange: {
      subscribe: (parent, data) =>
        pubsub.asyncIterator("lift-status-change"),
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: schemaString,
  resolvers,
});

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressMiddleware(server)
);

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(
    `Server is now running on http://localhost:${PORT}/graphql`
  );
});
