import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button } from 'react-bootstrap';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import AddOHEInput from '~/components/AddOHEInput/AddOHEInput';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';

@inject('appProviders')
class AddOHEModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { listing_id: props.listing.id };
    autobind(this);
  }

  timeChange(values) {
    this.setState(values);
  }

  submit() {
    const formsy = this.refs.form.refs.formsy;
    if (formsy.state.isValid) {
      this.props.appProviders.oheProvider.createOhe(this.state)
        .catch(() => {
          this.props.appProviders.notificationProvider.add('Error', 'OHE not created');
        })
        .then(() => {
          if (this.props.onClose) {
            this.props.onClose(this.state);
          }
        });
    } else {
      formsy.submit(); // will trigger validation messages
    }

  }

  render() {
    return (
      <DorbelModal
        show={this.props.show}
        onClose={this.props.onClose}
        modalSize="small"
        title="הוספת מועד חדש"
        body={
          <FormWrapper.Wrapper layout="vertical" ref="form">
            <AddOHEInput onChange={this.timeChange} />
            <Button bsStyle="success" onClick={this.submit} block>אישור</Button>
          </FormWrapper.Wrapper>
        }
      />
    );
  }
}

AddOHEModal.wrappedComponent.propTypes = {
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object
};

export default AddOHEModal;
