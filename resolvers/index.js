const UserResolver = require('./UserResolver')


const resolvers = {
  Query: {
    me: UserResolver.me
  },
  Mutation: {
    login: UserResolver.login,
    signup: UserResolver.signup
  }
}

module.exports = resolvers
