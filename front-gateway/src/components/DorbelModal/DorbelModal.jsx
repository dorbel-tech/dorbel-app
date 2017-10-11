import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import autobind from 'react-autobind';
import { get } from 'lodash';

// TODO: Consider using Modal (and removing DorbelModal entirely) directly from ModalProvider
class DorbelModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  close() {
    const closeFunction = this.props.onClose || get(this.props, 'params.onClose');

    if (closeFunction) {
      closeFunction();
    }
  }

  render() {
    const { closeButton, modalSize, title, body, footer } = (this.props.params || this.props);

    return (
      <Modal show={this.props.show} bsSize={modalSize} onHide={this.close}>
        <Modal.Header closeButton={closeButton}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        {
          footer &&
          (<Modal.Footer className="text-center">
            {footer}
          </Modal.Footer>)
        }
      </Modal>
    );
  }
}

DorbelModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.any,
  body: PropTypes.any,
  footer: PropTypes.any,
  onClose: PropTypes.func,
  modalSize: PropTypes.oneOf(['small', 'large']),
  params: PropTypes.any
};

export default DorbelModal;
