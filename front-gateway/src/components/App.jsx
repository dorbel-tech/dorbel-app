import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AppHeader from '~/components/Header/Header';
import moment from 'moment';

moment.locale('he'); // TODO : dynamic locale

@observer(['appStore'])
class App extends Component {
  render() {
    const { appStore } = this.props;
    const header =  appStore.currentView.hideApplicationHeader ? null : (<AppHeader />); 

    return (
      <div className="full-height">
        {header}
        <appStore.currentView {...appStore.routeParams} />
      </div>
    );
  }

}

App.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object
};

export default App;

