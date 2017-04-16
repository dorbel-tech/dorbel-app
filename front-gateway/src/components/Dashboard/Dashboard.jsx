import React, { Component } from 'react';
import autobind from 'react-autobind';
import NavLink from '~/components/NavLink';
import { MENU_ITEMS } from './DashboardShared';
import Property from './Property';
import { find } from 'lodash';

import './Dashboard.scss';

class Dashboard extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);
    autobind(this);
  }

  renderMenuItem(item) {
    const isSelected = this.props.action === item.navTo;

    return <div key={'dashboard-menu-item-' + item.navTo}
                className={'dashboard-menu-item ' + (isSelected ? 'dashboard-menu-item-selected' : '')}>
        <i className={'dashboard-menu-item-icon fa ' + item.faIconClassName}  aria-hidden="true"></i>
        <NavLink to={'/dashboard/' + item.navTo}>{item.menuText}</NavLink>
      </div>;
  }

  render() {
    let selectedActionItem;
    if (this.props.propertyId) {
      selectedActionItem = {component: <Property propertyId={this.props.propertyId} tab={this.props.tab} />};
    } else {
      selectedActionItem = find(MENU_ITEMS, {navTo: this.props.action});
    }

    return <div className="dashboard-container">
        <div className="dashboard-menu-wrapper">
          {MENU_ITEMS.map((item) => this.renderMenuItem(item))}
        </div>
        <div className="dashboard-action-wrapper">
          {selectedActionItem ? selectedActionItem.component : null}
        </div>
      </div>;
  }
}

Dashboard.propTypes = {
  action: React.PropTypes.string,
  propertyId: React.PropTypes.string,
  tab: React.PropTypes.string
};

export default Dashboard;
