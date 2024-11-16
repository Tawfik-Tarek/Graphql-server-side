const schema = `#graphql

  type Issue {
    id: ID!
    name: String!
    content: String!
    status: IssueStatus
    userId: ID!
    projectId: ID!
    user: User!
    createdAt: String!
  }

  input IssueInput {
    name: String!
    content: String!
    status: IssueStatus
  }

  enum IssueStatus {
    DONE
    INPROGRESS
    TODO
    BACKLOG
  }

  type User {
    id: ID!
    email: String!
    createdAt: String!
    token: String
  }

  input AuthInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
  }

  type Mutation{
    signin(input: AuthInput!): User
    createUser(input: AuthInput!): User
    createIssue(input: IssueInput!): Issue
  }
`

export default schema
