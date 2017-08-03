import React, { Component } from 'react';
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
  appProviders: React.PropTypes.object.isRequired,
  listingId: React.PropTypes.string
};

export default MyMessages;
