function* clearAllUserLikes(apiClient) {
  const existingLikesResponse = yield apiClient.getUserLikes().expect(200).end();

  for (let i = 0; i < existingLikesResponse.body.length; i++) {
    yield apiClient.unlikeListing(existingLikesResponse.body[i]).expect(200).end();
  }
}

module.exports = {
  clearAllUserLikes
};
