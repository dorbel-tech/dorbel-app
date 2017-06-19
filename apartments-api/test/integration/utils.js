function* clearAllUserLikes(apiClient) {
  const existingLikesResponse = yield apiClient.getUserLikes().expect(200).end();

  for (let i = 0; i < existingLikesResponse.body.length; i++) {
    let userLike = existingLikesResponse.body[i];
    console.log('userLike', userLike);
    yield apiClient.unlikeApartment(userLike.apartment_id, userLike.listing_id).expect(200).end();
  }
}

module.exports = {
  clearAllUserLikes
};
