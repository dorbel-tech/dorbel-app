import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Col } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import NavLink from '~/components/NavLink';
import SearchResults from '~/components/Search/SearchResults';
import { PROPERTY_SUBMIT_PREFIX } from '~/routesHelper';

import './MyProperties.scss';

// TODO: Add infinite scrolling support as introduced in Search.jsx to load more items.
@inject('appStore', 'appProviders') @observer
class MyProperties extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this is a workaround for duplicate results after re-publish and deleting listings
    // because the search store is unique per listing-id and not per apartment-id
    // and the MyProperties query isn't changing - the store/provider don't know they should reset+query again
    this.props.appStore.searchStore.reset();
    this.props.appProviders.searchProvider.search({
      'city': '*',
      'myProperties': true
    });
  }

  render() {
    return (
      <div className="my-properties-container">
        <SearchResults
          title={ <p className="my-properties-title">הנכסים שלי</p> }
          thumbnailProps={ { isMyProperties: true } }
          noResultsContent={
            <Grid fluid>
              <Col lg={4} sm={6} xs={12}>
                <div className="my-properties-empty">
                  <NavLink className="my-properties-add" to={PROPERTY_SUBMIT_PREFIX}>
                    <div className="my-properties-cross">
                      <img src="https://static.dorbel.com/images/dashboard/add-property-icon.svg" />
                    </div>
                    <div className="my-properties-title">הוסיפו נכס</div>
                  </NavLink>
                  <div className="my-properties-text">אין לכם נכסים קיימים. הוסיפו נכס בבעלותכם או את הדירה בה אתם גרים.</div>
                </div>
              </Col>
            </Grid>
          }
        />
      </div>
    );
  }
}

MyProperties.wrappedComponent.propTypes = {
  appStore: PropTypes.object.isRequired,
  appProviders: PropTypes.object.isRequired
};

export default MyProperties;
