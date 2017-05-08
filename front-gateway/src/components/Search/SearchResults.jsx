'use strict';
/***
* SearchResults components should display search results for main search, my properties, my likes
* It will take the results from the SearchStore and activate the SearchProvider for paging, etc...
**/
import React from 'react';
import autobind from 'react-autobind';
import { inject, observer } from 'mobx-react';
import { Grid, Row } from 'react-bootstrap';
import ListingThumbnail from '~/components/ListingThumbnail/ListingThumbnail.jsx';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';

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

  componentDidMount() {
    if (process.env.IS_CLIENT) {
      // scrolling is caught at the document level because this component doesn't actually scroll, it's parent does
      document.addEventListener('scroll', this.handleScroll, true);
    }
  }

  componentWillUnmount() {
    if (process.env.IS_CLIENT) {
      document.removeEventListener('scroll', this.handleScroll, true);
    }
  }

  componentDidUpdate() {
    if (!process.env.IS_CLIENT) {
      return;
    }

    const { searchProvider } = this.props.appProviders;
    if (this.props.scrollTarget) {
      this.props.scrollTarget.scrollTop = searchProvider.getLastScrollTop();
    }
  }

  handleScroll(e) {
    const { appProviders, appStore } = this.props;
    const target = e.target;
    const distanceFromBottom = target.scrollHeight - target.offsetHeight - target.scrollTop;

    appProviders.searchProvider.setLastScrollTop(target.scrollTop);
    if (distanceFromBottom < INFINITE_SCROLL_MARGIN && appStore.searchStore.hasMorePages) {
      appProviders.searchProvider.loadNextPage();
    }
  }

  render() {
    const { title, noResultsContent, isReady, retryLink, appStore, thumbnailProps } = this.props;
    const { searchStore } = appStore;
    const results = searchStore.searchResults();

    if (searchStore.searchError) {
      return (
        <div className="search-results-not-found">
          <b className="search-results-not-found-title">אופס!</b><br />
          הייתה תקלה כלשהי בחיפוש שביקשתם<br />
          { retryLink || 'אנא נסו שנית' }
        </div>
      );
    } else if (searchStore.isLoadingNewSearch || !isReady) {
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
              { results.map(listing => <ListingThumbnail listing={listing} key={listing.id} {...thumbnailProps} />) }
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

SearchResults.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  noResultsContent: React.PropTypes.node.isRequired,
  title: React.PropTypes.node,
  retryLink: React.PropTypes.node,
  isReady: React.PropTypes.bool,
  thumbnailProps: React.PropTypes.object,
  scrollTarget: React.PropTypes.object
};

SearchResults.wrappedComponent.defaultProps = {
  isReady: true,
  thumbnailProps: {}
};

