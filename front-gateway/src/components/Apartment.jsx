import React, { Component } from 'react';

class Apartment extends Component {
  render() {
    return (
      <div>
        <h4>ID: {this.props.apartmentId}</h4>
      </div>
    );
  }
}

Apartment.propTypes = {
  apartmentId: React.PropTypes.string.isRequired
};

export default Apartment;
