'use strict';
/**
* SearchResults components should display search results for main search, my properties, my likes
* It will take the results from the SearchStore and activate the SearchProvider for paging, etc...
**/
import React from 'react';
import PropTypes from 'prop-types';
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
      this.restoreScrollTop = true;
      this.scrollKey = location.pathname;

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
    const { appProviders } = this.props;
    const lastScrollTop = appProviders.searchProvider.getLastScrollTop(this.scrollKey);

    if (this.restoreScrollTop && lastScrollTop > 0) {
      setTimeout(() => this.scrollTargets.forEach(el => el.scrollTop = lastScrollTop), 200);

      this.restoreScrollTop = false;
    }
  }

  // Set the relevant scroll targets if none were set before
  setScrollTargets() {
    if (!this.scrollTargets) {
      this.scrollTargets = ['search-results-scroll', 'dashboard-action-wrapper'].map(
        elClassName => document.getElementsByClassName(elClassName)[0]
      ).filter(el => !!el);
    }
  }

  handleScroll(e) {
    const { appProviders, appStore } = this.props;
    const target = e.target;
    const distanceFromBottom = target.scrollHeight - target.offsetHeight - target.scrollTop;

    if (distanceFromBottom < INFINITE_SCROLL_MARGIN && appStore.searchStore.hasMorePages) {
      appProviders.searchProvider.loadNextPage();
    }

    // Empty search pages will have undefined scrollTargets
    this.scrollTargets = this.scrollTargets || [];
    // Filter out targets with scroll top 0
    const scrollTarget = this.scrollTargets.filter(el => el.scrollTop > 0)[0];
    // If a relevant scroll target was found use it's scrollTop otherwise use 0
    appProviders.searchProvider.setLastScrollTop(scrollTarget ? scrollTarget.scrollTop : 0, this.scrollKey);
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
        <div className="search-results-scroll"
          onScroll={this.handleScroll}
          ref={this.setScrollTargets}>
          { title || null }
          <Grid className="search-results-container">
            <Row>
              { results.map((listing, idx) => <ListingThumbnail listing={listing} key={listing.id} thumbIndex={idx} {...thumbnailProps} />) }
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
  appStore: PropTypes.object.isRequired,
  appProviders: PropTypes.object.isRequired,
  noResultsContent: PropTypes.node.isRequired,
  title: PropTypes.node,
  retryLink: PropTypes.node,
  isReady: PropTypes.bool,
  thumbnailProps: PropTypes.object
};

SearchResults.wrappedComponent.defaultProps = {
  isReady: true,
  thumbnailProps: {}
};

