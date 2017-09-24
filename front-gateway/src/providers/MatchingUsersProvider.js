export default class MatchingUsersProvider {
  constructor(appStore, apiProvider) {
    this.apiProvider = apiProvider;
    this.matchingUsersStore = appStore.matchingUsersStore;
  }

  getMatchingUsers(listingId) {
    const potentialRenters = this.matchingUsersStore.get(listingId);
    if (potentialRenters) {
      return Promise.resolve(potentialRenters);
    }
    else {
      return this.apiProvider.fetch(`/api/apartments/v1/filters?matchingListingId=${listingId}`)
        .then((filters) => {
          if (filters && filters.length) {
            const uids = filters.map((filter) => { return filter.dorbel_user_id; });
            this.apiProvider.fetch(`/api/apartments/v1/user-profile?uids=${uids.join(',')}`)
              .then((profiles) => {
                this.matchingUsersStore.set(listingId, profiles);
              });
          }
          else { this.matchingUsersStore.set(listingId, []); }
        });
    }
  }
}
