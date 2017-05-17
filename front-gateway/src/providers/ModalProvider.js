import React from 'react';
import { Button } from 'react-bootstrap';

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

      params.footer = (
        <div>
          <Button onClick={() => this.close(resolve, true)} bsStyle={params.confirmStyle || 'danger'} block>{params.confirmButton || 'המשך'}</Button>
          <Button onClick={() => this.close(resolve, false)} block>{params.cancelButton || 'ביטול'}</Button>
        </div>
      );

      this.show(params, () => close(false), 'text-center');
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

  show(params, closeHandler, bodyClass) {
    this.appStore.modalParams = {
      title: params.title,
      body: (
          <div className={bodyClass}>
            { params.heading && (<h4>{params.heading}</h4>) }
            { params.body }
          </div>
        ),
      footer: params.footer,
      modalSize: params.modalSize || 'small',
      onClose: closeHandler};

    this.appStore.showModal = true;
  }
}
