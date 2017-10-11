import React from 'react';
import PropTypes from 'prop-types';
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
    const { formsy } = this.form.refs;

    if (formsy.state.isValid) {
      const { appProviders, listing_id } = this.props;
      appProviders.listingsProvider.addTenant(listing_id, formsy.getCurrentValues())
        .then(() => {
          appProviders.notificationProvider.success('הדייר החדש נוסף בהצלחה');
          appProviders.modalProvider.close();
        })
        .catch(() => appProviders.notificationProvider.error('חלה שגיאה בהוספת הדייר'));
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
        <FormWrapper.Wrapper layout="vertical" ref={el => this.form = el}>
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
  appProviders: PropTypes.object.isRequired,
  listing_id: PropTypes.number.isRequired
};
