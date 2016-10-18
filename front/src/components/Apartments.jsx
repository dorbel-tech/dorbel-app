import React, { Component } from 'react';
import NavLink from './NavLink';
import { observer } from 'mobx-react';

@observer(['appStore'])
class Apartments extends Component {
  static serverWillRender(appStore) {
    return appStore.apartmentStore.loadApartments();
  }

  componentDidMount() {
    const { apartmentStore } = this.props.appStore;

    if (apartmentStore.apartments.length === 0) {
      apartmentStore.loadApartments();
    }
  }

  render() {
    const { apartmentStore } = this.props.appStore;

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
  appStore: React.PropTypes.object.isRequired
};

export default Apartments;
