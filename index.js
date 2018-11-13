const { ApolloServer } = require('apollo-server')
const lifts = require('./data/lifts.json')
const trails = require('./data/trails.json')

const typeDefs = `
    type Query {
        liftCount: Int!
    }
`

const resolvers = {
  Query: {
    liftCount: () => lifts.length
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`)
})
