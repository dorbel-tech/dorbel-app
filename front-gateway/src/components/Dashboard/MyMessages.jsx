import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ismobilejs from 'ismobilejs';
import { hideIntercom } from '~/providers/utils';

import './MyMessages.scss';

@inject('appProviders') @observer
class MyMessages extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { messagingProvider } = this.props.appProviders;

    messagingProvider.createInbox(this.talkjsContainer, this.props.listingId);
    if (ismobilejs.phone) {
      hideIntercom(true);
    }
  }

  componentWillUnmount() {
    hideIntercom(false);
  }

  render() {
    return (
      <div className="my-messages-container">
        <div ref={(el) => { this.talkjsContainer = el; }}></div>
      </div>
    );
  }
}

MyMessages.wrappedComponent.propTypes = {
  appProviders: PropTypes.object.isRequired,
  listingId: PropTypes.string
};

export default MyMessages;
