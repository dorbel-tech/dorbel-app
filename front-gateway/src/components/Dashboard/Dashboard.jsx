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
    return <div>
        <i className={'fa ' + faIconClassName}  aria-hidden="true"></i>
        <NavLink to={navTo}>{menuText}</NavLink>
      </div>
  }

  render() {
    return <div className="dashboard-container" onScroll={this.handleScroll}>
        <div className="dashboard-menu-wrapper">
          {this.renderMenuItem('fa-home', 'הנכסים שלי', '/dashboard/listings')}
          {this.renderMenuItem('fa-heart', 'המועדפים שלי', '/dashboard/likes')}
          {this.renderMenuItem('fa-sign-out', 'יציאה', '/dashboard/logout')}
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
