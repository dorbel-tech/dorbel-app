import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import Filter from './Filter.jsx';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './Search.scss';

/* We will load another page when the distance from the bottom of the viewable area
to the bottom of the scrollable area is below this margin. 
Currently this is just a little more than 2 rows of listings */
const INFINITE_SCROLL_MARGIN = 900;

@inject('appStore', 'appProviders') @observer
class Search extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {showScrollUp: false};
    this.props.appStore.metaData.title = 'dorbel - דירות שתשמחו לגור בהן. ללא תיווך';
  }

  componentDidMount() {
    this.filterHeight = document.getElementsByClassName('filter-wrapper')[0].clientHeight;
  }

  handleScroll(e) {
    const { appProviders, appStore } = this.props;
    const target = e.target;
    const distanceFromBottom = target.scrollHeight - target.offsetHeight - target.scrollTop;

    if (target.scrollTop > this.filterHeight) {
      this.setState({showScrollUp: true});
    } else if (this.state.showScrollUp) {
      this.setState({showScrollUp: false});
    }

    if (distanceFromBottom < INFINITE_SCROLL_MARGIN && appStore.searchStore.hasMorePages) {
      appProviders.searchProvider.loadNextPage();
    }
  }

  scrollUpClickHandler() {
    const scrollElement = document.getElementsByClassName('search-container')[0];
    let perTick;

    const scrollTo = (duration) => {
      if (duration <= 0) {
        return;
      }

      perTick = scrollElement.scrollTop / duration * 10;

      setTimeout(function() {
        scrollElement.scrollTop = scrollElement.scrollTop - perTick;
        scrollTo(duration - 10);
      }, 10);
    };

    scrollTo(600);
  }

  renderResults() {
    const { searchStore, cityStore } = this.props.appStore;
    const isLoadingCities = cityStore.cities.length === 0;
    const results = searchStore.searchResults();

    if (searchStore.searchError) {
      return (<div className="search-results-not-found">
        <b className="search-results-not-found-title">אופס!</b><br />
        הייתה תקלה כלשהי בחיפוש שביקשתם<br />
        אנא <a href="/apartments">נסו שנית</a>
      </div>);
    } else if (searchStore.isLoadingNewSearch || isLoadingCities) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    } else if (results.length > 0) {
      return (
        <div className="search-results-scroll" onScroll={this.handleScroll}>
          <Grid fluid className="search-results-container">
            <Row>
              { results.map(listing => <ListingThumbnail listing={listing} key={listing.id} />) }
            </Row>
            { searchStore.isLoadingNextPage ? <Row><LoadingSpinner /></Row> : null}
          </Grid>
        </div>
      );
    } else {
      return (<div className="search-results-not-found">
        <b className="search-results-not-found-title">הלוואי והייתה לנו דירה בדיוק כזו.</b><br />
        כנראה שהייתם ספציפיים מדי - לא נמצאו דירות לחיפוש זה.<br />
        נסו לשנות את הגדרות החיפוש</div>);
    }
  }

  render() {
    const showScrollUpClass = this.state.showScrollUp ? 'search-scroll-up-show' : '';

    return <div className="search-container" onScroll={this.handleScroll}>
        <Button className={'search-scroll-up ' + showScrollUpClass}
          onClick={this.scrollUpClickHandler}>
          בחזרה למעלה
        </Button>
        <Filter />
        <div className="search-results-wrapper">
          {this.renderResults()}
        </div>
      </div>;
  }
}

Search.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Search;
