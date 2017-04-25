import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Col } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import NavLink from '~/components/NavLink';
import SearchResults from '~/components/Search/SearchResults';

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
                  <NavLink className="my-properties-add" to="/apartments/new_form">
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
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default MyProperties;
