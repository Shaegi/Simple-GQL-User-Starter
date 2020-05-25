const { ApolloServer, AuthenticationError } = require('apollo-server')
const { importSchema } = require('graphql-import')
require('dotenv').config({ path: './.env.local' })
const jsonwebtoken = require('jsonwebtoken')

const resolvers = require('./resolvers')
const typeDefs = importSchema('./schema.graphql')
const UserResolver = require('./resolvers/UserResolver')
const WhiteList = require('./WhiteListedQueries')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    apiKey: 'service:Shaegi-5174:F7BnT3sTU9DJQEobmyUk8Q'
  },
  context: async ({ req }) => {
    // get the user token from the headers
    let user = null

    let token = req.headers.authorization || null
    if (token && req.body.query.indexOf('login') === -1) {
      // split bearer
      token = token.split(' ')[1]
      let validToken = null
      try {
        validToken = jsonwebtoken.verify(token, process.env.JWT_SECRET)
      } catch (e) {
        throw new AuthenticationError('No valid token')
      }

      // const user = await UserResolver.getUserFromToken(token)
      // try to retrieve a user with the token
      if (validToken && validToken.email) {
        user = await UserResolver.getUserByEmail(validToken.email)
      }
    }


    if (!user && WhiteList.indexOf(req.body.operationName) === -1) {
      throw new Error('Forbidden')
    }
    return { user }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`)
})
