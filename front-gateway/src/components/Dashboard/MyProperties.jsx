import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Col } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';

import './MyProperties.scss';

// TODO: Add infinite scrolling support as introduced in Search.jsx to load more items.
@inject('appStore', 'appProviders') @observer
class MyProperties extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.props.appProviders.searchProvider.search({ 
      'city': '*',
      'myProperties': true
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
          <p className="my-properties-title">הנכסים שלי</p>
          <Grid fluid className="search-results-container">
            <Row>
              { results.map(listing => <ListingThumbnail listing={listing} key={listing.id} isMyProperties="true" />) }
            </Row>
            { searchStore.isLoadingNextPage ? <Row><LoadingSpinner /></Row> : null}
          </Grid>
        </div>
      );
    } else {
      return (<Grid fluid>
                <Col lg={4} sm={6} xs={12}>
                  <div className="my-properties-empty">
                    <NavLink className="my-properties-add" to="/apartments/new_form">
                      <div className="my-properties-cross">
                        <img src="https://static.dorbel.com/images/dashboard/add-property-icon.svg" />
                      </div>
                      <div className="my-properties-title">הוסיפו נכס</div>
                    </NavLink>
                    <div className="my-properties-text">אין לכם נכסים קיימים. הוסיפו נכס בבעלותכם או את הדירה בה אתם גרים.</div>
                  </div>
                </Col>
              </Grid>);
    }
  }

  render() {
    return <div className="my-properties-container">
          {this.renderResults()}
      </div>;
  }
}

MyProperties.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default MyProperties;
