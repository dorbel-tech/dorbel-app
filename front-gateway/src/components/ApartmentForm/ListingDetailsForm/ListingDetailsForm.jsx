import React from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';
import DatePicker from '~/components/DatePicker/DatePicker';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';
import autobind from 'react-autobind';

@observer(['appStore', 'appProviders'])
export default class ListingDetailsForm extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    // load form with existing values from store
    this.refs.form.refs.formsy.reset(this.props.editedListingStore.formValues);
  }

  updateStore(changes) {
    this.props.editedListingStore.updateFormValues(changes);
  }

  getCityOptions() {
    const cities = this.props.appStore.cityStore.cities;
    if (cities.length) {
      return cities.map(city => ({ value: city.id, label: city.city_name }));
    } else {
      this.props.appProviders.cityProvider.loadCities();
      return [{ value: 0, label: 'טוען...' }];
    }
  }

  getNeighborhoodOptions(cityId) {
    const neighborhoodsByCityId = this.props.appStore.neighborhoodStore.neighborhoodsByCityId;
    const neighborhoods = neighborhoodsByCityId.get(cityId);
    if (neighborhoods) {
      return neighborhoods.map(neighborhood => ({ value: neighborhood.id, label: neighborhood.neighborhood_name }));
    } else {
      this.props.appProviders.neighborhoodProvider.loadNeighborhoodByCityId(cityId);
      return [{ label: 'טוען...' }];
    }
  }

  getNeighborhoodValue(options) {
    var storedValue = this.props.editedListingStore.formValues['apartment.building.neighborhood.id'];
    if (storedValue && options.find(option => option.value === storedValue)) {
      return storedValue;
    } else {
      return options[0].value;
    }
  }

  // used outside of component
  getValidationErrors() {
    const formsy = this.refs.form.refs.formsy;
    if (formsy.state.isValid) {
      this.updateStore(this.refs.form.refs.formsy.getCurrentValues());
      return null;
    } else {
      return formsy;
    }
  }

  render() {
    const { editedListingStore } = this.props;
    const citySelectorOptions = this.getCityOptions();
    const citySelectorValue = editedListingStore.formValues['apartment.building.city.id'] || citySelectorOptions[0].value;
    const neighborhoodSelectorOptions = this.getNeighborhoodOptions(citySelectorValue);
    const neighborhoodSelectorValue = this.getNeighborhoodValue(neighborhoodSelectorOptions);

    const roomOptions = editedListingStore.roomOptions.slice(0);
    if (!editedListingStore.formValues.rooms) { roomOptions.unshift({ label: 'בחר' }); }

    return (
      <FormWrapper.Wrapper layout="vertical" onChange={this.updateStore} ref="form">
        <Row className="form-section">
          <div className="form-section-headline">כתובת</div>
          <Row>
            <Col md={6}>
              <FRC.Select name="apartment.building.city.id" label="עיר" options={citySelectorOptions} value={citySelectorValue} required />
            </Col>
            <Col md={6}>
              <FRC.Select name="apartment.building.neighborhood.id" label="שכונה" options={neighborhoodSelectorOptions} value={neighborhoodSelectorValue} required />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FRC.Input value="" name="apartment.building.street_name" label="שם רחוב" type="text" required />
            </Col>
            <Col md={3}>
              <FRC.Input value="" name="apartment.building.house_number" label="מספר בניין" required
                type="text" placeholder="(לא יוצג באתר)" />
            </Col>
            <Col md={3}>
              <FRC.Input value="" name="apartment.apt_number" label="מספר דירה" type="text" required
                placeholder="(לא יוצג באתר)" />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FRC.Input name="apartment.building.entrance" label="כניסה" type="text" />
            </Col>
            <Col md={4}>
              <FRC.Input value="" name="apartment.floor" label="קומה" type="number" required />
            </Col>
            <Col md={4}>
              <FRC.Input name="apartment.building.floors" label="מס' קומות בבניין" type="number" />
            </Col>
          </Row>
        </Row>

        <Row className="form-section">
          <div className="form-section-headline">פרטי הדירה</div>
          <Row>
            <Col md={6}>
              <FRC.Input value="" name="apartment.size" label="גודל הדירה" type="number" required />
            </Col>
            <Col md={6}>
              <FRC.Select value="" name="apartment.rooms" label="מספר חדרים" required options={roomOptions} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FRC.Textarea name="description" label="מידע נוסף ותיאור הדירה" maxLength="500"
                className="upload-apt-left-container-description"
                placeholder="תארו את מצב הדירה (משופצת, שמורה), האם היא עורפית/ מוארת/ שקטה/ מרוהטת? ספרו על יתרונות הדירה והאיזור וכל פרט שיסייע לדיירים להבין שזו הדירה שהם מחפשים." />
            </Col>
          </Row>
          <Row>
            <FRC.Checkbox name="apartment.parking" label="חנייה" rowClassName="checkbox-inline" />
            <FRC.Checkbox name="apartment.building.elevator" label="מעלית" rowClassName="checkbox-inline" />
            <FRC.Checkbox name="apartment.sun_heated_boiler" label="דוד שמש" rowClassName="checkbox-inline" />
            <FRC.Checkbox name="apartment.pets" label='מותר בע"ח' rowClassName="checkbox-inline" />
            <FRC.Checkbox name="apartment.air_conditioning" label="מזגן" rowClassName="checkbox-inline" />
            <FRC.Checkbox name="apartment.balcony" label="מרפסת" rowClassName="checkbox-inline" />
            <FRC.Checkbox name="apartment.security_bars" label="סורגים" rowClassName="checkbox-inline" />
            <FRC.Checkbox name="apartment.parquet_floor" label="פרקט" rowClassName="checkbox-inline" />
            <FRC.Checkbox name="roommates" label='מתאימה לשותפים' rowClassName="checkbox-inline" />
            <FRC.Checkbox name="roommate_needed" label='דרוש שותף/ה' rowClassName="checkbox-inline" />
          </Row>
        </Row>

        <Row className="form-section">
          <div className="form-section-headline">חוזה ותשלומים</div>
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label>תאריך כניסה לדירה</label>
                <DatePicker name="apartment.entrance-date" value={editedListingStore.formValues.lease_start} onChange={value => this.updateStore({ lease_start: value })} />
              </div>
            </Col>
            <Col md={6}>
              <FRC.Input value="" name="monthly_rent" label="שכר דירה לחודש" type="number" required />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FRC.Input name="property_tax" label="ארנונה לחודשיים" type="number" />
            </Col>
            <Col md={6}>
              <FRC.Input name="board_fee" label="ועד בית לחודש" type="number" />
            </Col>
          </Row>
        </Row>

      </FormWrapper.Wrapper>
    );
  }
}

ListingDetailsForm.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  editedListingStore: React.PropTypes.object.isRequired
};
