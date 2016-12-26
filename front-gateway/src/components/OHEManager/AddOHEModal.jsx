import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button } from 'react-bootstrap';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';

class AddOHEModal extends React.Component {
  render() {
    return (
      <DorbelModal 
        show={this.props.show}
        onClose={this.props.onClose}
        title="הוספת מועד חדש"
        body={
          <FormWrapper.Wrapper layout="elementOnly" ref="form">
            <FRC.Input name="user.email" placeholder="מייל" type="email" validations="isEmail" validationError="כתובת מייל לא תקינה" required/>
            <br/>
            <Button bsStyle="success" onClick={this.follow}>עדכנו אותי!</Button>
          </FormWrapper.Wrapper>
        }
      />
    );
  }
}

AddOHEModal.propTypes = {
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

export default AddOHEModal;
