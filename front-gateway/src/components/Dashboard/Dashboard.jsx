import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';

import './Dashboard.scss';

const dashboardMenuItems = [
  { navTo: 'listings', menuText: 'הנכסים שלי', faIconClassName: 'fa-home' },
  { navTo: 'likes', menuText: 'המועדפים שלי', faIconClassName: 'fa-heart' },
  { navTo: 'logout', menuText: 'יציאה', faIconClassName: 'fa-sign-out' }
];

@observer(['appStore', 'appProviders', 'router'])
class Dashboard extends Component {
  static hideFooter = true;

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
    return <div>{this.props.action}</div>
  }

  renderMenuItem(item) {
    const isSelected = this.props.action === item.navTo;

    return <div key={'dashboard-menu-item-' + item.navTo}
                className={'dashboard-menu-item ' + (isSelected ? 'dashboard-menu-item-selected' : '')}>
        <i className={'dashboard-menu-item-icon fa ' + item.faIconClassName}  aria-hidden="true"></i>
        <NavLink to={'/dashboard/' + item.navTo}>{item.menuText}</NavLink>
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
          {dashboardMenuItems.map((item) => this.renderMenuItem(item))}
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
