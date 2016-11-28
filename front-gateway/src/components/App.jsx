import React, { Component } from 'react';
import mobx from 'mobx';
import { observer } from 'mobx-react';
import AppHeader from '~/components/Header/Header';
import moment from 'moment';

moment.locale('he'); // TODO : dynamic locale
mobx.useStrict(true);

@observer(['appStore'])
class App extends Component {
  render() {
    const { appStore } = this.props;
    const devTools = {
      mobx: process.env.NODE_ENV === 'development' ? require('mobx-react-devtools').default : (() => null)
    };
    
    const viewClassName = appStore.currentView.behindHeader ? 'full-height' : 'app-content-with-header full-height';   

    return (
      <div className="full-height">
        <AppHeader />
        <div className={viewClassName}>
          <appStore.currentView {...appStore.routeParams} />
        </div>
        <devTools.mobx />
      </div>
    );
  }

}

App.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object
};

export default App;

