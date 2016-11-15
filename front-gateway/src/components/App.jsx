import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AppHeader from '~/components/Header/Header';
import moment from 'moment';

moment.locale('he'); // TODO : dynamic locale

@observer(['appStore'])
class App extends Component {
  render() {
    const { appStore } = this.props;

    return (
      <div className="full-height">
        <AppHeader />
        <div className="app-content-with-header full-height">
          <appStore.currentView {...appStore.routeParams} />
        </div>
      </div>
    );
  }

}

App.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object
};

export default App;

