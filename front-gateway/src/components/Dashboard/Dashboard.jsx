import React, { Component } from 'react';
import autobind from 'react-autobind';
import { observer } from 'mobx-react';
import NavLink from '~/components/NavLink';
import MyProperties from '~/components/Dashboard/MyProperties';
import './Dashboard.scss';

const dashboardMenuItems = [
  { navTo: 'my-properties', menuText: 'הנכסים שלי', faIconClassName: 'fa-home', component: <MyProperties/> },
  { navTo: 'my-likes', menuText: 'דירות שאהבתי', faIconClassName: 'fa-heart', component:  <div>My Likes</div>}
];

@observer(['router'])
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
    return <div className="dashboard-container">
        <div className="dashboard-menu-wrapper">
          {dashboardMenuItems.map((item) => this.renderMenuItem(item))}
        </div>
        <div className="dashboard-action-wrapper">
          {dashboardMenuItems.map((item) => this.props.action === item.navTo ? item.component : null )}          
        </div>
      </div>;
  }
}

Dashboard.wrappedComponent.propTypes = {
  action: React.PropTypes.string,
  router: React.PropTypes.any
};

export default Dashboard;
