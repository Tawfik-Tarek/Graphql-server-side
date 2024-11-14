const resolvers = {
  AnimalOrBird: {
    __resolveType(obj) {
      if (obj.speed) {
        return 'Animal'
      }
      if (obj.wingspan) {
        return 'bird'
      }
    },
  },
  Person: {
    name: (parent) => parent.name.toUpperCase(),
  },
  Query: {
    hello: () => 'Hello World',
    people: () => {
      return [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ]
    },
    animalOrBird: () => {
      return [
        { id: 1, name: 'Cheetah', speed: 75 },
        { id: 1, name: 'Eagle', wingspan: 2 },
        { id: 1, name: 'Penguin', wingspan: 1 },
      ]
    },
  },
}

export default resolvers
