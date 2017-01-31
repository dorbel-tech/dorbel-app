import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import DatePicker from '~/components/DatePicker/DatePicker';
import FormWrapper from '~/components/FormWrapper/FormWrapper';

@observer(['appStore', 'appProviders'])
class UploadApartmentStep2 extends UploadApartmentBaseStep.wrappedComponent {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    // load form with existing values from store
    this.refs.form.refs.formsy.reset(this.props.appStore.newListingStore.formValues);
  }

  clickNext() {
    const formsy = this.refs.form.refs.formsy;
    if (formsy.state.isValid) {
      this.props.appStore.newListingStore.updateFormValues(this.refs.form.refs.formsy.getCurrentValues());
      super.clickNext();
    } else {
      this.props.onValidationError(formsy);
    }
  }

  getCityOptions() {
    const cities = this.props.appStore.cityStore.cities;
    if (cities.length) {
      return cities.map(city => ({ value: city.id, label: city.city_name }));
    } else {
      this.props.appProviders.cityProvider.loadCities();
      return [ { value: 0, label: 'טוען...' } ];
    }
  }

  getNeighborhoodOptions(cityId) {
    const neighborhoodsByCityId = this.props.appStore.neighborhoodStore.neighborhoodsByCityId;
    const neighborhoods = neighborhoodsByCityId.get(cityId);
    if (neighborhoods) {
      return neighborhoods.map(neighborhood => ({ value: neighborhood.id, label: neighborhood.neighborhood_name }));
    } else {
      this.props.appProviders.neighborhoodProvider.loadNeighborhoodByCityId(cityId);
      return [ { label: 'טוען...' } ];
    }
  }

  getNeighborhoodValue(options) {
    var storedValue = this.props.appStore.newListingStore.formValues['apartment.building.neighborhood.id'];
    if (storedValue && options.find(option => option.value === storedValue)) {
      return storedValue;
    } else {
      return options[0].value;
    }
  }

  render() {
    const { newListingStore } = this.props.appStore;
    const citySelectorOptions = this.getCityOptions();
    const citySelectorValue = newListingStore.formValues['apartment.building.city.id'] || citySelectorOptions[0].value;
    const neighborhoodSelectorOptions = this.getNeighborhoodOptions(citySelectorValue);
    const neighborhoodSelectorValue = this.getNeighborhoodValue(neighborhoodSelectorOptions);
    const FRC = FormWrapper.FRC;

    const roomOptions = newListingStore.roomOptions.slice(0);
    if (!newListingStore.formValues.rooms) { roomOptions.unshift({ label: 'בחר'}); }

    return (
      <div className="container-fluid upload-apt-wrapper">

        <div className="col-md-7 upload-apt-right-container">
          <div className="text">
            <h1>מלאו את הפרטים של הדירה שלכם!</h1>
            <ul>
              <li>הקפידו למלא את כל הפרטים</li>
              <li>דייקו בפרטים בכדי למנוע ביקורים מיותרים</li>
            </ul>
          </div>
          <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-folder.svg" alt="" />
        </div>

        <div className="col-md-5 upload-apt-left-container apartment-details-step">
          <FormWrapper.Wrapper layout="vertical" onChange={this.handleChanges} ref="form">

            <div className="row form-section">
              <div className="form-section-headline">כתובת</div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Select name="apartment.building.city.id" label="עיר" options={citySelectorOptions} value={citySelectorValue} required/>
                </div>
                <div className="col-md-6">
                  <FRC.Select name="apartment.building.neighborhood.id" label="שכונה" options={neighborhoodSelectorOptions} value={neighborhoodSelectorValue} required/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input value="" name="apartment.building.street_name" label="שם רחוב" type="text" required />
                </div>
                <div className="col-md-3">
                  <FRC.Input value="" name="apartment.building.house_number" label="מספר בניין" type="text" required />
                </div>
                <div className="col-md-3">
                  <FRC.Input value="" name="apartment.apt_number" label="מספר דירה" type="text" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <FRC.Input value="" name="apartment.building.entrance" label="כניסה" type="text" />
                </div>
                <div className="col-md-4">
                  <FRC.Input value="" name="apartment.floor" label="קומה" type="number" required />
                </div>
                <div className="col-md-4">
                  <FRC.Input value="" name="apartment.building.floors" label="מס' קומות בבניין" type="number" />
                </div>
              </div>
            </div>

            <div className="row form-section">
              <div className="form-section-headline">פרטי הדירה</div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input value="" name="apartment.size" label="גודל הדירה" type="number" required />
                </div>
                <div className="col-md-6">
                  <FRC.Select name="apartment.rooms" label="מספר חדרים" required options={roomOptions} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FRC.Textarea name="description" rows={3} label="מידע נוסף ותיאור הדירה" />
                </div>
              </div>
              <div className="row">
                <FRC.Checkbox name="apartment.parking" label="חנייה" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.building.elevator" label="מעלית" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.sun_heated_boiler" label="דוד שמש" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.pets" label='מותר בע"ח' rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.air_conditioning" label="מזגן" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.balcony" label="מרפסת" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.security_bars" label="סורגים" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.parquet_floor" label="פרקט" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="roommates" label='אפשר שותפים' rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="roommate_needed" label='דרוש שותף/ה' rowClassName="checkbox-inline"/>
              </div>
            </div>

            <div className="row form-section">
              <div className="form-section-headline">חוזה ותשלומים</div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>תאריך כניסה לדירה</label>
                    <DatePicker name="apartment.entrance-date" value={this.props.appStore.newListingStore.formValues.lease_start} onChange={this.handleChange.bind(this, 'lease_start')} />
                  </div>
                </div>
                <div className="col-md-6">
                  <FRC.Input name="monthly_rent" label='שכ"ד לחודש' type="number" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input name="property_tax" label="ארנונה לחודשיים" type="number" />
                </div>
                <div className="col-md-6">
                  <FRC.Input name="board_fee" label="ועד בית לחודש" type="number" />
                </div>
              </div>
            </div>

          </FormWrapper.Wrapper>

          <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <span onClick={this.clickBack}>
              <i className="apartment-details-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>
              &nbsp; שלב קודם
            </span>
            <span>2/3</span>
            <span className="next-step" onClick={this.clickNext}>
              <Button bsStyle="success" className="step-btn">
                שלב הבא &nbsp;
                <i className="apartment-details-next-step fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i>
              </Button>
            </span>
          </div>

        </div>
      </div>
    );
  }
}

export default UploadApartmentStep2;
