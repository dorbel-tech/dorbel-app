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

  type Building {
    id: Int!
    street_name: String!
    house_number: String!
    entrance: String
    floors: Int
    geolocation: String
    elevator: Boolean
    neighborhood: Neighborhood
    city: City
  }

  type Apartment {
    id: Int!
    apt_number: String
    size: Int
    rooms: Float!
    floor: Int!
    parking: Boolean
    sun_heated_boiler: Boolean
    pets: Boolean
    air_conditioning: Boolean
    balcony: Boolean
    security_bars: Boolean
    parquet_floor: Boolean
    building: Building
  }

  type Listing {
    id: Int!
    title: String
    description: String
    status: String!
    monthly_rent: Float!
    roommates: Boolean
    property_tax: Float
    board_fee: Float
    lease_start: String
    lease_end: String
    publishing_user_id: ID
    publishing_user_type: String!
    publishing_username: String
    roommate_needed: Boolean
    directions: String
    show_phone: Boolean
    show_for_future_booking: Boolean
    property_value: Float
    rent_lead_by: String
    apartment: Apartment
    documents: [Document]
    images: [Image]
  }

  type Document {
    id: Int!
    dorbel_user_id: ID!
    provider: String!
    provider_file_id: String!
    filename: String!
    type: String
    size: Int
  }

  type Image {
    id: Int!
    url: String!
    display_order: Float
  }

  # the root query of the graph
  type Query {
    cities: [City]
    neighborhoods(city_id: Int!): [Neighborhood]
    listing(listing_id: Int!): Listing
    listings(myProperties: Boolean, oldListings: Boolean): [Listing]
  }
`;