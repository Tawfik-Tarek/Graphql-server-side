import { gql } from 'urql'

export const CreateIssueMutation = gql`
  mutation CreateIssue($input: IssueInput!) {
    createIssue(input: $input) {
      createdAt
      id
      name
      status
    }
  }
`
