const { ApolloServer, gql } = require('apollo-server')
const { resolvers } = require('./resolvers')

// Type definitions
const typeDefs = gql`
  type Content {
    id: ID!
    address: String!
    content: String
    imgUrl: String
  }

  type Query {
    contents: [Content]
  }
`

// Create the Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers })

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
