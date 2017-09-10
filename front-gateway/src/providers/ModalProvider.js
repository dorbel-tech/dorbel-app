import React from 'react';
import autobind from 'react-autobind';
import { Button } from 'react-bootstrap';
import ShareModal from '~/components/Modals/ShareModal/ShareModal';

// TODO: Simplify and cleanup the close handlers and delegates mess
export default class ModalProvider {
  constructor(appStore) {
    this.appStore = appStore;
    autobind(this);
  }

  showConfirmationModal(params) {
    return new Promise((resolve) => {
      params.closeHandler = (choice) => resolve(choice);
      params.bodyClass = 'text-center';
      params.footer = (
        <div>
          <Button onClick={() => this.close(true)} bsStyle={params.confirmStyle || 'danger'} block>{params.confirmButton || 'המשך'}</Button>
          <Button onClick={() => this.close(false)} block>{params.cancelButton || 'ביטול'}</Button>
        </div>
      );
      this.show(params);
    });
  }

  showInfoModal(params) {
    return new Promise((resolve) => {
      params.closeHandler = () => resolve(true);
      this.show(params);
    });
  }

  showShareModal(params) {
    this.show({
      body: <ShareModal
        shareUrl={params.shareUrl}
        title={params.title}
        content={params.content} />,
      modalSize: ShareModal.modalSize
    });
  }

  show(params) {
    if (process.env.IS_CLIENT) {
      // close on clicking back
      history.pushState(null, null);
      window.onpopstate = this.close;
    }

    this.appStore.modalParams = {
      title: params.title,
      body: (
        <div className="text-center">
          <div className={params.bodyClass}>
            {params.heading && (<h4>{params.heading}</h4>)}
            {params.body}
          </div>
        </div>
      ),
      footer: params.footer,
      modalSize: params.modalSize || 'small',
      onClose: (value) => {
        if (params.closeHandler) {
          params.closeHandler(value);
        }
        this.appStore.showModal = false;
      }
    };

    this.appStore.showModal = true;
  }

  close(value) {
    const { onClose } = this.appStore.modalParams;
    if (onClose) { onClose(value) }
    this.appStore.showModal = false;
  }
}
