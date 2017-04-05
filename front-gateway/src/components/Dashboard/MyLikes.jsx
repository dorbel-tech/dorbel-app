import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';

import './MyLikes.scss';

// TODO: Add infinite scrolling support as introduced in Search.jsx to load more items.
@observer(['appStore', 'appProviders'])
class MyLikes extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.props.appProviders.searchProvider.search({ 
      'city': '*',
      'liked': true
    });
  }

  renderResults() {
    const { searchStore } = this.props.appStore;
    const results = searchStore.searchResults();

    if (searchStore.searchError) {
      return (<div className="search-results-not-found">
        <b className="search-results-not-found-title">אופס!</b><br />
        הייתה תקלה כלשהי בחיפוש שביקשתם<br />
        אנא נסו שנית
      </div>);
    } else if (searchStore.isLoadingNewSearch) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    } else if (results.length > 0) {
      return (
        <div>
          <p className="my-likes-title">דירות שאהבתי</p>
          <Grid fluid className="search-results-container">
            <Row>
              { results.map(listing => <ListingThumbnail listing={listing} key={listing.id} openInNewWindow="true" />) }
            </Row>
            { searchStore.isLoadingNextPage ? <Row><LoadingSpinner /></Row> : null}
          </Grid>
        </div>
      );
    } else {/* TODO WHAT TO SHOW WHEN EMPTY? */
      return (<div className="my-likes-empty"> 
                <div className="my-likes-text"><b>טרם שמרתם דירות שאהבתם. </b><br/><br/>
                  היכנסו <NavLink to="/apartments">לעמוד החיפוש</NavLink> וסמנו את הדירות שאהבתם בכדי לחזור אליהן בקלות בהמשך.</div>
              </div>);
    }
  }

  render() {
    return <div className="my-likes-container">
          {this.renderResults()}
      </div>;
  }
}

MyLikes.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default MyLikes;
