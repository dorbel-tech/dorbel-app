import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
// import { Col, Grid, Row } from 'react-bootstrap';

@observer(['appStore', 'appProviders'])
export default class EditListing extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const { appProviders, listingId } = this.props;

    appProviders.listingProvider.loadFullListingDetails(listingId);

    // TEMP TEMP TEMP

    // Until this is integrated into actual dashboard
  }

  render() {
    return (
      <div>
        <h1>Here i am baby</h1>
      </div>
    );
  }
}

EditListing.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
};

