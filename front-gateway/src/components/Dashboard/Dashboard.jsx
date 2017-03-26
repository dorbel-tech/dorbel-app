import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';

import './Dashboard.scss';

@observer(['appStore', 'appProviders', 'router'])
class Dashboard extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.action === 'logout') {
      newProps.appProviders.authProvider.logout();
      newProps.router.setRoute('/');
    }
  }

  renderAction() {
    console.log(this.props.action);
    return <div>{this.props.action}</div>
  }

  renderMenuItem(faIconClassName, menuText, navTo) {
    const isSelected = this.props.action === navTo;

    return <div className={'dashboard-menu-item ' + (isSelected ? 'dashboard-menu-item-selected' : '')}>
        <i className={'dashboard-menu-item-icon fa ' + faIconClassName}  aria-hidden="true"></i>
        <NavLink to={'/dashboard/' + navTo}>{menuText}</NavLink>
      </div>
  }

  render() {
    const profile = this.props.appStore.authStore.profile || {};
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';

    return <div className="dashboard-container" onScroll={this.handleScroll}>
        <div className="dashboard-menu-wrapper">
          <div className="dashboard-menu-profile-section">
            <img src={profile.picture} className="dashboard-menu-profile-image" />
            <div className="dashboard-menu-profile-first-name">{firstName}</div>
            <div className="dashboard-menu-profile-last-name">{lastName}</div>
          </div>
          {this.renderMenuItem('fa-home', 'הנכסים שלי', 'listings')}
          {this.renderMenuItem('fa-heart', 'המועדפים שלי', 'likes')}
          {this.renderMenuItem('fa-sign-out', 'יציאה', 'logout')}
        </div>
        <div className="dashboard-action-wrapper">
          {this.renderAction()}
        </div>
      </div>;
  }
}

Dashboard.wrappedComponent.propTypes = {
  action: React.PropTypes.string,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  router: React.PropTypes.any
};

export default Dashboard;
