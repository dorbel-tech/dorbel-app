import React from 'react';
import { Modal } from 'react-bootstrap';
import autobind from 'react-autobind';

class DorbelModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">          
          {this.props.body}
        </Modal.Body>
        <Modal.Footer className="text-center">
          {this.props.footer}
        </Modal.Footer>
      </Modal>
    );
  }
}

DorbelModal.propTypes = {
  show: React.PropTypes.bool,
  title: React.PropTypes.any,
  body: React.PropTypes.any,
  footer: React.PropTypes.any,
  onClose: React.PropTypes.func
};

export default DorbelModal;
