import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NavLink from '~/components/NavLink';

@observer(['appStore'])
class App extends Component {
  render() {
    const { appStore } = this.props;

    return (
      <div>
        <NavLink to="/"><h1>dorbel</h1></NavLink>
        <ul role="nav">
          <li><NavLink to="/apartments">Apartments</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
        <appStore.currentView {...appStore.routeParams} />
      </div>
    );
  }

}

App.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object
};

export default App;
