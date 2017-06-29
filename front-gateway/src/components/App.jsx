import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import AppHeader from '~/components/Header/Header';
import AppFooter from '~/components/Footer/Footer';
import Notifications from '~/components/Notifications/Notifications';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import moment from 'moment';

moment.locale('he'); // TODO : dynamic locale

@inject('appStore', 'appProviders') @observer
class App extends Component {
  setViewport() {
    if (process.env.IS_CLIENT) {
      const { currentView } = this.props.appStore;
      const { utils } = this.props.appProviders;

      const metaElement = document.getElementsByName('viewport');
      if (currentView.viewportWidth && (window.screen.width < currentView.viewportWidth) && utils.isMobile()) {
        const ratio = window.screen.width / currentView.viewportWidth;
        metaElement[0].setAttribute('content', `initial-scale=${ratio}, maximum-scale=2.0, user-scalable=yes`);
      }
      else {
        metaElement[0].setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no');
      }
    }
  }

  render() {
    this.setViewport();
    const { appStore } = this.props;
    const components = {
      mobxDevTools: process.env.NODE_ENV === 'development' ? require('mobx-react-devtools').default : (() => null),
      footer: appStore.currentView.hideFooter ? (() => null) : AppFooter
    };

    let viewClassName = (appStore.currentView.hideHeader || appStore.currentView.behindHeader) ? '' : 'app-content-with-header';
    if (appStore.currentView.hideFooter) { viewClassName += ' full-height'; }

    return (
      <div className="full-height">
        {appStore.currentView.hideHeader ? null : <AppHeader />}
        <div className={viewClassName}>
          <appStore.currentView {...appStore.routeParams} />
        </div>
        <components.footer />
        <components.mobxDevTools />
        <Notifications />
        <DorbelModal show={appStore.showModal} params={appStore.modalParams} />
      </div>
    );
  }

}

App.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object
};

export default App;

