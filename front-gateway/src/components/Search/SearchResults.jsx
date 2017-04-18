/***
* SearchResults components should display search results for main search, my properties, my likes
* It will take the results from the SearchStore and activate the SearchProvider for paging, etc...
**/
'use strict';
import React from 'react';
import autobind from 'react-autobind';


/* We will load another page when the distance from the bottom of the viewable area
to the bottom of the scrollable area is below this margin.
Currently this is just a little more than 2 rows of listings */
const INFINITE_SCROLL_MARGIN = 900;

@inject('appStore', 'appProviders') @observer
export default class SearchResults extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleScroll(e) {
    const { appProviders, appStore } = this.props;
    const target = e.target;
    const distanceFromBottom = target.scrollHeight - target.offsetHeight - target.scrollTop;

    if (distanceFromBottom < INFINITE_SCROLL_MARGIN && appStore.searchStore.hasMorePages) {
      appProviders.searchProvider.loadNextPage();
    }
  }


  render() {
    const { searchStore, cityStore, title, noResultsContent } = this.props.appStore;
    const isLoadingCities = cityStore.cities.length === 0;
    const results = searchStore.searchResults();

    if (searchStore.searchError) {
      return (
        <div className="search-results-not-found">
          <b className="search-results-not-found-title">אופס!</b><br />
          הייתה תקלה כלשהי בחיפוש שביקשתם<br />
          אנא <a href="/apartments">נסו שנית</a>
        </div>
      );
    } else if (searchStore.isLoadingNewSearch || isLoadingCities) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    } else if (results.length > 0) {
      return (
        <div className="search-results-scroll" onScroll={this.handleScroll}>
          { title || null }
          <Grid fluid className="search-results-container">
            <Row>
              { results.map(listing => <ListingThumbnail listing={listing} key={listing.id} />) }
            </Row>
            { searchStore.isLoadingNextPage ? <Row><LoadingSpinner /></Row> : null}
          </Grid>
        </div>
      );
    } else {
      return noResultsContent;
    }
  }
}
