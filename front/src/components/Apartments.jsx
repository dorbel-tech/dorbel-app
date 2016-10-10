import React, { Component } from 'react';
import NavLink from './NavLink';
import { observer } from 'mobx-react';

@observer(['apartmentStore'])
class Apartments extends Component {
  componentWillMount() {
    this.props.apartmentStore.loadApartments();
  }

  render() {
    return (
      <div>
        <h2>Apartments</h2>
        <ul>
          <li><NavLink to="/apartments/123">Nice Apartment</NavLink></li>
          <li><NavLink to="/apartments/456">Amazing Home</NavLink></li>
        </ul>
        <p>{this.props.apartmentStore.apartments}</p>
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
