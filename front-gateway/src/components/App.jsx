import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AppHeader from '~/components/Header/Header';

@observer(['appStore'])
class App extends Component {
  render() {
    const { appStore } = this.props;

    return (
      <div className="full-height">
        <AppHeader />
        <appStore.currentView {...appStore.routeParams} />
      </div>
    );
  }

}

App.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object
};

export default App;

