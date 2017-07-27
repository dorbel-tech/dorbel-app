module.exports = `
  query NeighborhoodQuery($city_id: Int!) {
    neighborhoods(city_id: $city_id) {
      id
      neighborhood_name
      display_order
    }
  }
`;
