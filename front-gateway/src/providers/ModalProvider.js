import React from 'react';
import { Button } from 'react-bootstrap';
import ShareModal from '~/components/Modals/ShareModal/ShareModal';

// TODO: Simplify and cleanup the close handlers and delegates mess
export default class ModalProvider {
  constructor(appStore) {
    this.appStore = appStore;
  }

  showConfirmationModal(params) {
    return new Promise((resolve) => {
      const close = (choice) => {
        resolve(choice);
        this.appStore.showModal = false;
      };

      params.bodyClass = 'text-center';

      params.footer = (
        <div>
          <Button onClick={() => close(true)} bsStyle={params.confirmStyle || 'danger'} block>{params.confirmButton || 'המשך'}</Button>
          <Button onClick={() => close(false)} block>{params.cancelButton || 'ביטול'}</Button>
        </div>
      );

      this.show(params, () => close(false));
    });
  }

  showInfoModal(params) {
    return new Promise((resolve) => {
      // expecting only one modal open each time so calling modalProvider.close() will close it
      this.close = () => {
        resolve(true);
        this.appStore.showModal = false;
      };

      this.show(params, () => this.close());
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
