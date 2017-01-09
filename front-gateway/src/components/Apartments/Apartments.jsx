import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NavLink from '~/components/NavLink';

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  componentDidMount() {
    this.props.appProviders.apartmentsProvider.loadApartments();
  }

  render() {    
    const { listingStore } = this.props.appStore;

    return (
      <div>
        <h2>Apartments</h2>
        <ul>
          {listingStore.apartments.map(apt =>
            <li key={apt.id}><NavLink to={'/apartments/' + apt.id}>{apt.apartment.building.street_name} {apt.apartment.building.house_number} - {apt.apartment.apt_number}</NavLink></li>
          )}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

Apartments.wrappedComponent.propTypes = {
  children: React.PropTypes.node,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Apartments;
