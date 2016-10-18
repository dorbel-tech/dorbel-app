import React, { Component } from 'react';
import NavLink from './NavLink';
import { observer } from 'mobx-react';

@observer(['appState'])
class Apartments extends Component {
  static serverWillRender(appState) {
    return appState.apartmentStore.loadApartments();
  }

  componentDidMount() {
    const { apartmentStore } = this.props.appState;

    if (apartmentStore.apartments.length === 0) {
      apartmentStore.loadApartments();
    }
  }

  render() {
    const { apartmentStore } = this.props.appState;

    return (
      <div>
        <h2>Apartments</h2>
        <ul>
          {apartmentStore.apartments.map(apt =>
            <li key={apt.id}><NavLink to={'/apartments/' + apt.id}>{apt.title}</NavLink></li>
          )}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

Apartments.wrappedComponent.propTypes = {
  children: React.PropTypes.node,
  appState: React.PropTypes.object.isRequired
};

export default Apartments;
