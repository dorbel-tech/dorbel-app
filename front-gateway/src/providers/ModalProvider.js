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
            { params.heading ? (<h4>{params.heading}</h4>) : null }
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
}
