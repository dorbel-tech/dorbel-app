import React, { Component } from 'react';
import NavLink from './NavLink';
import { observer } from 'mobx-react';

@observer(['apartmentStore'])
class Apartments extends Component {
  componentDidMount() {
    const { apartmentStore } = this.props;

    if (apartmentStore.apartments.length === 0) {
      apartmentStore.loadApartments();
    }
  }

  render() {
    return (
      <div>
        <h2>Apartments</h2>
        <ul>
          {this.props.apartmentStore.apartments.map(apt =>
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
  apartmentStore: React.PropTypes.object.isRequired
};

export default Apartments;
