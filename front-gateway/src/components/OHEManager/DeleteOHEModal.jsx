import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button } from 'react-bootstrap';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';

@inject('appProviders')
class DeleteOHEModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  submit() {
    this.props.appProviders.oheProvider.deleteOhe(this.props.ohe.id)
    .catch(() => alert('Delete failed'));
    // we don't need to close the modal because the ohe will be removed from the store
  }

  render() {
    const { ohe } = this.props;

    let warning = null;
    if (ohe.registrations && ohe.registrations.length > 0) {
      warning = (
        <p>
          ישנם דיירים שנרשמו לביקור במועד זה!
          <br/>
          מחיקת הביקור תבטל את הרשמת הדיירים
        </p>
      );
    }
    
    return (
      <DorbelModal 
        show={this.props.show}
        onClose={this.props.onClose}
        modalSize="small"
        title="מחיקת מועד ביקור"
        body={
          <div className="text-center">
            <h4>שימו לב!</h4>            
            {warning}
            <p>
              האם אתם בטוחים שברצונכם להמשיך ?
            </p>
            <Button bsStyle="danger" onClick={this.submit} block>מחיקת ביקור</Button>
            <Button onClick={this.props.onClose} block>ביטול</Button>
          </div>
        }
      />
    );
  }
}

DeleteOHEModal.wrappedComponent.propTypes = {
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  appProviders: React.PropTypes.object,
  ohe: React.PropTypes.object.isRequired
};

export default DeleteOHEModal;
