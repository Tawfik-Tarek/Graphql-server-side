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
    issues: [Issue]!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input IssuesFilterInput{
    statuses: [IssueStatus!]
  }

  type Query {
    me: User
    issues(input: IssuesFilterInput): [Issue]!
  }

  input EditIssueInput {
    id: ID!
    name: String
    content: String
    status: IssueStatus
  }

  type Mutation{
    signin(input: AuthInput!): User
    createUser(input: AuthInput!): User
    createIssue(input: IssueInput!): Issue
    editIssue(input: EditIssueInput!): Issue!
  }
`

export default schema
