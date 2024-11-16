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
    createIssue: async (_: any, args: any, context: GQLContext) => {
      const user = context.user
      if (!user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: { code: 401 },
        })
      }
      const data = await db
        .insert(issues)
        .values({ ...args.input, userId: context.user?.id })
        .returning()
      if (!data) {
        throw new GraphQLError('could not create issue', {
          extensions: { code: 401 },
        })
      }
      return data[0]
    },
  },
  Issue: {
    user: async (parent: any, _: any, context: GQLContext) => {
      if (!context.user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: { code: 401 },
        })
      }
      const data = await db.query.users.findFirst({
        where: eq(users.id, parent.userId),
      })
      if (!data) {
        throw new GraphQLError('could not find user', {
          extensions: { code: 401 },
        })
      }
      return data
    },
  },
  IssueStatus: {
    DONE: 'done',
    INPROGRESS: 'inprogress',
    TODO : 'todo',
    BACKLOG : 'backlog',
  },
}

export default resolvers
