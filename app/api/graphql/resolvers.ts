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
    issues: async (parent: any, { input }: any, context: any) => {
      const user = context.user
      if (!user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: { code: 401 },
        })
      }

      if (input && input.statuses && input.statuses.length > 0) {
        const data = await db.query.issues.findMany({
          where: and(
            eq(issues.userId, user.id),
            or(
              ...input.statuses.map((status: any) => eq(issues.status, status))
            )
          ),
        })
        return data
      }

      const data = await db.query.issues.findMany({
        where: eq(issues.userId, user.id),
      })
      return data
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
    editIssue: async (_: any, args: any, context: GQLContext) => {
      const user = context.user
      if (!user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: { code: 401 },
        })
      }
      const {id: issueId, ...updates } = args.input
      if (!issueId) {
        throw new GraphQLError('issueId is required', {
          extensions: { code: 401 },
        })
      }

      if (!updates.name && !updates.content && !updates.status) {
        throw new GraphQLError('at least one field is required', {
          extensions: { code: 401 },
        })
      }

      const data = await db
        .update(issues)
        .set(updates)
        .where(and(eq(issues.id, issueId), eq(issues.userId, user.id)))
        .returning()
      if (!data) {
        throw new GraphQLError('could not update issue', {
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
    TODO: 'todo',
    BACKLOG: 'backlog',
  },
  User: {
    issues: async (parent: any, args: any, context: any) => {
      const data = await db.query.issues.findMany({
        where: eq(issues.userId, parent.id),
      })
      return data
    },
  },
}

export default resolvers
