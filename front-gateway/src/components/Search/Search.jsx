import React, { Component } from 'react';
import { Grid, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import Filter from './Filter.jsx';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './Search.scss';

@observer(['appStore', 'appProviders'])
class Search extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);

    this.props.appStore.metaData.title = 'dorbel - דירות שתשמחו לגור בהן. ללא תיווך';
  }

  renderResults() {
    const { searchStore } = this.props.appStore;
    const results = searchStore.searchResults.length ? searchStore.searchResults : [];

    if (!searchStore.isLoading && results.length > 0) {
      return (<Grid fluid>
        <Row>
          {results.map(listing => <ListingThumbnail listing={listing} key={listing.id} />)}
        </Row>
      </Grid>);
    } else if (!searchStore.filterChanged || searchStore.isLoading) {
      return (
        <div className="loaderContainer">
          <LoadingSpinner />
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
    return <div className="search-container">
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
