import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Button } from 'react-bootstrap';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';

@inject('appProviders')
export default class AddTenantModal extends React.Component {
  static title = 'הוספת דייר חדש לדירה';

  constructor(props) {
    super(props);
    autobind(this);
  }

  submit() {
    const { formsy } = this.refs.form.refs;

    if (formsy.state.isValid) {
      const { appProviders, listing_id } = this.props;
      appProviders.listingsProvider.addTenant(listing_id, formsy.getCurrentValues())
        .catch(() => appProviders.notificationProvider.error('חלה שגיאה בהוספת הדייר'))
        .then(() => appProviders.modalProvider.close());
    } else {
      formsy.submit(); // show validation errors
    }
  }

  render() {
    return (
      <div>
        <p>
          <b>צרפו דייר חדש לדירה שהשכרתם</b><br/>
          הדייר יקבל מייל עם הזמנה למלא את פרטיו, שיתווספו עבורכם אוטומטית למסך ניהול הדירה
        </p>
        <FormWrapper.Wrapper layout="vertical" ref="form">
          <FRC.Input value="" name="email" type="email" label="אי-מייל" validations="isEmail" />
          <FRC.Input value="" name="first_name" type="text" label="שם פרטי" required />
          <FRC.Input value="" name="last_name" type="text" label="שם משפחה" />
          <FRC.Input value="" name="phone" type="text" label="טלפון" />
          <Button bsStyle="success" onClick={this.submit} block>אישור</Button>
        </FormWrapper.Wrapper>
      </div>
    );
  }
}

AddTenantModal.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  listing_id: React.PropTypes.number.isRequired
};
