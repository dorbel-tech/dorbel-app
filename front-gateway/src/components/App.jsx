import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import AppHeader from '~/components/Header/Header';
import AppFooter from '~/components/Footer/Footer';
import Notifications from '~/components/Notifications/Notifications';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import moment from 'moment';

moment.locale('he'); // TODO : dynamic locale

@inject('appStore') @observer
class App extends Component {
  setViewport() {
    if (process.env.IS_CLIENT) {
      const { currentView } = this.props.appStore;

      const metaElement = document.createElement('meta');
      metaElement.name = 'viewport';
      if (currentView.viewportWidth) {
        const ratio = window.screen.width / currentView.viewportWidth;
        metaElement.content = `width=${window.screen.width}, initial-scale=${ratio}, user-scalable=yes`;
      }
      else {
        metaElement.content = 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no';
      }

      document.getElementsByTagName('head')[0].appendChild(metaElement);
    }
  }

  render() {
    const { appStore } = this.props;
    this.setViewport();
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
  appStore: React.PropTypes.object
};

export default App;

