import React, { Component } from 'react';
import mobx from 'mobx';
import { observer } from 'mobx-react';
import AppHeader from '~/components/Header/Header';
import AppFooter from '~/components/Footer/Footer';
import moment from 'moment';

moment.locale('he'); // TODO : dynamic locale
mobx.useStrict(true);

@observer(['appStore'])
class App extends Component {
  render() {
    const { appStore } = this.props;
    const components = {
      mobxDevTools: process.env.NODE_ENV === 'development' ? require('mobx-react-devtools').default : (() => null),
      footer: appStore.currentView.hideFooter ? (() => null) : AppFooter
    };
    
    let viewClassName = appStore.currentView.behindHeader ? '' : 'app-content-with-header';
    if (appStore.currentView.hideFooter) { viewClassName += ' full-height'; }

    return (
      <div className="full-height">
        <AppHeader />
        <div className={viewClassName}>
          <appStore.currentView {...appStore.routeParams} />
        </div>
        <components.footer />
        <components.mobxDevTools />
      </div>
    );
  }

}

App.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object
};

export default App;

