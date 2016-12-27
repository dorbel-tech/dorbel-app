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
      <Modal show={this.props.show} bsSize={this.props.modalSize}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          {this.props.body}
        </Modal.Body>
        { 
          this.props.footer ? 
          (<Modal.Footer className="text-center">
            {this.props.footer}
          </Modal.Footer>)
          : null 
        }
      </Modal>
    );
  }
}

DorbelModal.propTypes = {
  show: React.PropTypes.bool,
  title: React.PropTypes.any,
  body: React.PropTypes.any,
  footer: React.PropTypes.any,
  onClose: React.PropTypes.func,
  modalSize: React.PropTypes.oneOf(['small', 'large'])
};

export default DorbelModal;
