import { db } from '@/db/db'
import { InsertIssues, SelectIssues, issues, users } from '@/db/schema'
import { GQLContext } from '@/types'
import { getUserFromToken, signin, signup } from '@/utils/auth'
import { and, asc, desc, eq, or, sql } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

const resolvers = {
  Query: {
    me: (_: any, __: any, context: GraphQLError) => {
      return context.user
    },
  },

  Mutation: {
    signin: async (_: any, args: any, context: GQLContext) => {
      const data = await signin(args.input)
      if (!data || !data.token || !data.user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: { code: 401 },
        })
      }
      return { ...data.user, token: data.token }
    },
    createUser: async (_: any, args: any, context: GQLContext) => {
      const data = await signup(args.input)
      if (!data || !data.token || !data.user) {
        throw new GraphQLError('could not create user', {
          extensions: { code: 401 },
        })
      }
      return { ...data.user, token: data.token }
    },
  },
}

export default resolvers
