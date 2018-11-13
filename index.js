const { ApolloServer } = require('apollo-server')

const lifts = require('./data/lifts.json')
const trails = require('./data/trails.json')

const typeDefs = `

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

  type Query {
    allLifts(status: LiftStatus): [Lift!]!
    findLiftById(id: ID!): Lift!
    liftCount(status: LiftStatus!): Int!
    allTrails(status: TrailStatus): [Trail!]!
    findTrailByName(name: String!): Trail!
    trailCount(status: TrailStatus!): Int!
  }

  type Mutation {
    setLiftStatus(id: ID!, status: LiftStatus!): Lift!
    setTrailStatus(id: ID!, status: TrailStatus!): Trail!
  }

`
const resolvers = {
  Query: {
    allLifts: (parent, { status }) => {
      if (!status) {
        return lifts
      } else {
        return lifts.filter(lift => lift.status === status)
      }
    },
    findLiftById: (parent, { id }) => {
      return lifts.find(lift => id === lift.id)
    },
    liftCount: (parent, { status }) => {
      let i = 0
      lifts.map(lift => {
        lift.status === status ? i++ : null
      })
      return i
    },
    allTrails: (parent, { status }) => {
      if (!status) {
        return trails
      } else {
        return trails.filter(trail => trail.status === status)
      }
    },
    findTrailByName: (parent, { name }) => {
      return trails.find(trail => name === trail.name)
    },
    trailCount: (parent, { status }) => {
      let i = 0
      trails.map(trail => {
        trail.status === status ? i++ : null
      })
      return i
    }
  },
  Mutation: {
    setLiftStatus: (parent, { id, status }) => {
      let updatedLift = lifts.find(lift => id === lift.id)
      updatedLift.status = status
      return updatedLift
    },
    setTrailStatus: (parent, { id, status }) => {
      let updatedTrail = trails.find(trail => id === trail.id)
      updatedTrail.status = status
      return updatedTrail
    }
  },
  Lift: {
    trailAccess: parent =>
      parent.trails.map(id => trails.find(t => id === t.id))
  },
  Trail: {
    accessedByLifts: parent =>
      parent.lift.map(id => lifts.find(l => id === l.id))
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`)
})
