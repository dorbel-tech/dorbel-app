import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';

import './Dashboard.scss';

@observer(['appStore', 'appProviders'])
class Dashboard extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  renderAction() {
    console.log(this.props.action);
    return <div>{this.props.action}</div>
  }

  render() {
    return <div className="dashboard-container" onScroll={this.handleScroll}>
        <div className="dashboard-menu-wrapper">
          <div><NavLink to="/dashboard/listings">הנכסים שלי</NavLink></div>
          <div><NavLink to="/dashboard/likes">המועדפים שלי</NavLink></div>
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
  appProviders: React.PropTypes.object.isRequired
};

export default Dashboard;
