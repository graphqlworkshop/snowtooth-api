const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");

const lifts = require("./data/lifts.json");
const trails = require("./data/trails.json");

const typeDefs = gql`
  scalar DateTime

  type Lift {
    id: ID
    name: String!
    status: LiftStatus!
    capacity: Int!
    night: Boolean!
    elevationGain: Int!
    trailAccess: [Trail!]!
  }

  type Trail {
    id: ID
    name: String!
    status: TrailStatus
    difficulty: String!
    groomed: Boolean!
    trees: Boolean!
    night: Boolean!
    accessedByLifts: [Lift!]!
  }

  enum LiftStatus {
    OPEN
    HOLD
    CLOSED
  }

  enum TrailStatus {
    OPEN
    CLOSED
  }

  type SetLiftStatusPayload {
    lift: Lift
    changed: DateTime
  }

  type Query {
    allLifts(status: LiftStatus): [Lift!]!
    findLiftById(id: ID!): Lift!
    liftCount(status: LiftStatus!): Int!
    allTrails(status: TrailStatus): [Trail!]!
    findTrailByName(name: String!): Trail!
    trailCount(status: TrailStatus!): Int!
  }

  type Mutation {
    setLiftStatus(id: ID!, status: LiftStatus!): SetLiftStatusPayload!
    setTrailStatus(id: ID!, status: TrailStatus!): Trail!
  }
`;
const resolvers = {
  Query: {
    allLifts: (parent, { status }) =>
      !status ? lifts : lifts.filter(lift => lift.status === status),
    findLiftById: (parent, { id }) => lifts.find(lift => id === lift.id),
    liftCount: (parent, { status }) =>
      !status
        ? lifts.length
        : lifts.filter(lift => lift.status === status).length,
    allTrails: (parent, { status }) =>
      !status ? trails : trails.filter(trail => trail.status === status),
    findTrailByName: (parent, { name }) =>
      trails.find(trail => name === trail.name),
    trailCount: (parent, { status }) =>
      !status
        ? trails.length
        : trails.filter(trail => trail.status === status).length
  },
  Mutation: {
    setLiftStatus: (parent, { id, status }) => {
      let updatedLift = lifts.find(lift => id === lift.id);
      updatedLift.status = status;
      return {
        lift: updatedLift,
        changed: new Date()
      };
    },
    setTrailStatus: (parent, { id, status }) => {
      let updatedTrail = trails.find(trail => id === trail.id);
      updatedTrail.status = status;
      return updatedTrail;
    }
  },
  Lift: {
    trailAccess: parent =>
      parent.trails.map(id => trails.find(t => id === t.id))
  },
  Trail: {
    accessedByLifts: parent =>
      parent.lift.map(id => lifts.find(l => id === l.id))
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => new Date(ast.value)
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
