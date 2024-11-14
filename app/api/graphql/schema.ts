const schema = `#graphql
  type Person {
    id: ID!
    name: String!
  }

  type Animal {
    id: ID!
    name: String!
    speed: Int!
  }

  type bird  {
    id: ID!
    name: String!
    wingspan: Int!
  }

  union AnimalOrBird = Animal | bird

  type Query {
    hello: String!,
    people: [Person!]!
    animalOrBird: [AnimalOrBird]!
  }
`

export default schema
