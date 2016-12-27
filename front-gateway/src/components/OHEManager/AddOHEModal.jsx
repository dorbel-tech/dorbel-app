import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button } from 'react-bootstrap';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import TimeRangePicker from '~/components/TimeRangePicker/TimeRangePicker';
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
    this.props.appProviders.oheProvider.createOhe(this.state)
    .catch(() => {
      alert('OHE not created');
    })
    .then(() => {
      if (this.props.onClose) {
        this.props.onClose(this.state);
      }
    });
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
            <TimeRangePicker onChange={this.timeChange} />
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
