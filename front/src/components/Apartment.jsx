import React, { Component } from 'react';

class Apartment extends Component {
  render() {
    return (
      <div>
        <h4>ID: {this.props.params.apartmentId}</h4>
      </div>
    );
  }
}

Apartment.propTypes = {
  params: React.PropTypes.object
};

export default Apartment;
