const dbHandler = require('./DatabaseHandler')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const USER_TABLE = 'users'

const UserResolver = {
  resolve: async (parent, args, context, info) => {
  // TODO Authentication
    const id = parent.author || args.id
    if (id) {
      const user = await dbHandler.from(USER_TABLE).where({ id })
      return user[0]
    }
    return null
  },
  me: async (parent, args, context, info) => {
    const {
      user
    } = context
    if (!user) {
      throw new Error('You are not authenticated!')
    }

    return user
  },
  getUserByEmail: async (email) => {
    const result = await dbHandler.from(USER_TABLE).where({email})
    return result[0]
  },
  login: async (parent, args, context, info) => {
    const {
      email,
      password
    } = args
    const result = await dbHandler.from(USER_TABLE).where({email})
    const user = result[0]
    if (!user) {
      throw new Error('No user with that email')
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new Error('Incorrect password')
    }

    // return json web token
    return {
      token: jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      ),
      user
    }
  },
  signup: async (parent, args, context, info) => {
    const {
      username,
      email,
      password
    } = args

    const user = await dbHandler('users').insert({
      name: username,
      email,
      password: await bcrypt.hash(password, 10)
    })

    // return json web token
    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1y' }
    )
  }
}

module.exports = UserResolver
