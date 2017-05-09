import React from 'react';
import { Button } from 'react-bootstrap';

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

      this.appStore.modalParams = {
        title: params.title,
        body: (
          <div className="text-center">
            { params.heading && (<h4>{params.heading}</h4>) }
            { params.body }
            <Button onClick={() => close(true)} bsStyle={params.confirmStyle || 'danger'} block>{params.confirmButton || 'המשך'}</Button>
            <Button onClick={() => close(false)} block>{params.cancelButton || 'ביטול'}</Button>
          </div>
        ),
        footer: params.footer,
        modalSize: params.modalSize || 'small',
        onClose: () => close(false)
      };

      this.appStore.showModal = true;
    });
  }

  showInfoModal(params) {
    return new Promise((resolve) => {
      // expecting only one modal open each time so calling modalProvider.close() will close it
      this.close = () => {
        resolve(true);
        this.appStore.showModal = false;
      };

      this.appStore.modalParams = {
        title: params.title,
        body: (
          <div>
            {params.heading ? (<h4>{params.heading}</h4>) : null}
            <div>
              {params.body}
            </div>
          </div>
        ),
        footer: params.footer,
        modalSize: params.modalSize || 'small',
        onClose: () => this.close()
      };

      this.appStore.showModal = true;
    });
  }
}
