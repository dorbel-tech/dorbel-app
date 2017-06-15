import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import ListingDetailsForm from '~/components/ApartmentForm/ListingDetailsForm/ListingDetailsForm';
import { FRC } from '~/components/FormWrapper/FormWrapper';

export default class EditListingForm extends Component {
  render() {
    const { publishing_user_type, show_phone } = this.props.editedListingStore.formValues;

    return (
      <ListingDetailsForm editedListingStore={this.props.editedListingStore} values={this.props.values} loadedFrom="editForm">
        <Row className="form-section">
          <Row>
            <Col md={12}>
              <FRC.Textarea name="directions" rows={3} label="הכוונה לדירה בבניין (אם צריך)"
                placeholder="(לדוגמא: הדלת הלבנה משמאל למדרגות)" />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FRC.RadioGroup name="publishing_user_type" value={publishing_user_type} type="inline" label="הגדר אותי במודעה כ:"
                options={[{ label: 'בעל הדירה', value: 'landlord' }, { label: 'הדייר הנוכחי', value: 'tenant' }]} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <label>טלפון:</label>
              <div className="is-phone-visible-input">
                <FRC.Checkbox name="show_phone" label="הציגו את המספר שלי במודעה" value={show_phone} />
              </div>
            </Col>
          </Row>
        </Row>
      </ListingDetailsForm>
    );
  }
}

EditListingForm.propTypes = {
  editedListingStore: React.PropTypes.object.isRequired,
  values: React.PropTypes.object,
};

