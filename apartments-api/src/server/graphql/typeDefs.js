module.exports = `
  type City {
    id: Int!
    city_name: String!
    display_order: Float
  }

  type Neighborhood {
    id: Int!
    neighborhood_name: String!
    display_order: Float
  }

  # the root query of the graph
  type Query {
    cities: [City]
    neighborhoods(city_id: Int!): [Neighborhood]
  }
`;
