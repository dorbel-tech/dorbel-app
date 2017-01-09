import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button, Row, Col } from 'react-bootstrap';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import TimeRangePicker from '~/components/TimeRangePicker/TimeRangePicker';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';

@inject('appProviders')
class EditOHEModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { warningDismissed: false };
    autobind(this);
  }

  timeChange(values) {
    this.setState(values);
  }

  submit() {
    this.props.appProviders.oheProvider.updateOhe(this.props.ohe.id, {
      start_time: this.state.start_time,
      end_time: this.state.end_time
    })
    .catch(() => alert('Edit failed'))
    .then(this.close);
  }

  close() {
    this.setState({ warningDismissed: false }); // reset the warning
    if (this.props.onClose) { 
      this.props.onClose(); 
    }
  }

  renderWarning() {
    return (
      <div className="text-center">
        <h4>שימו לב!</h4>
        <p>
          ישנם דיירים שנרשמו לביקור במועד זה!
          שינוי פרטי הביקור תבטל את הרשמת הדיירים.
          <br/>
          האם אתם בטוחים שברצונכם להמשיך?
        </p>
        <p className="text-muted">
          שינוי של שעת תחילת או סיום הביקור בלבד
          תשלח על כך עדכון לנרשמים ללא ביטול הביקור
        </p>
        <Button bsStyle="danger" onClick={() => this.setState({ warningDismissed: true })} block>עריכת מועד ביקור</Button>
        <Button onClick={this.close} block>ביטול</Button>
      </div>
    );
  }

  renderEditForm() {
    return (
      <FormWrapper.Wrapper layout="vertical" ref="form">                        
        <TimeRangePicker onChange={this.timeChange} ohe={this.props.ohe} />
        <Button bsStyle="danger" onClick={this.submit} block>שמור</Button>
        <Button onClick={this.close} block>ביטול</Button>
      </FormWrapper.Wrapper>
    );
  }

  render() {
    const { ohe } = this.props;
    const showWarning = ohe.registrations.length > 0 && !this.state.warningDismissed;
    const body = showWarning ? this.renderWarning() : this.renderEditForm();

    return (
      <DorbelModal 
        show={this.props.show}
        onClose={this.close}
        modalSize="small"
        title="עריכת מועד ביקור"
        body={body}
      />
    );
  }
}

EditOHEModal.wrappedComponent.propTypes = {
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  appProviders: React.PropTypes.object,
  ohe: React.PropTypes.object.isRequired
};

export default EditOHEModal;
