import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';

import './MyProperties.scss';

@observer(['appStore', 'appProviders'])
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
        <Grid fluid className="search-results-container">
          <Row>
            { results.map(listing => <ListingThumbnail listing={listing} key={listing.id} isMyProperties="true" />) }
          </Row>
          { searchStore.isLoadingNextPage ? <Row><LoadingSpinner /></Row> : null}
        </Grid>
      );
    } else {
      return (<Col lg={4} sm={6} xs={12}><div className="dashboard-my-properties-empty">
                <NavLink className="add" to="/apartments/new_form">
                  <div className="cross"><img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/dashboard/add-property-icon.svg"/></div>
                  <div className="title">הוסיפו דירה</div>
                </NavLink>
                <div className="text">אין נכסים קיימים. הוסיפו נכס בבעלותכם או את הדירה בה אתם גרים.</div>
              </div></Col>);
    }
  }

  render() {
    return <div className="dashboard-my-properties-container">
        <div className="dashboard-my-properties-wrapper">
          {this.renderResults()}
        </div>
      </div>;
  }
}

MyProperties.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default MyProperties;
