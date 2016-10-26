import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NavLink from '~/components/NavLink';

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  componentDidMount() {
    const { appProviders, appStore } = this.props;
    if (appStore.apartmentStore.apartments.length === 0) {
      appProviders.apiProvider.loadApartments();
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
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Apartments;
