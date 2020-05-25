// Queries which will let through to resolvers without having the requirement of a valid user in context
module.exports = [
  'IntrospectionQuery',
  'LoginMutation',
  'SignupMutation'
]
