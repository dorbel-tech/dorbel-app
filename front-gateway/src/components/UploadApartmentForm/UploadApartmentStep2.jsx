import React from 'react';
import { observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import DatePicker from '~/components/DatePicker/DatePicker';
import formHelper from './formHelper';
import FRC from 'formsy-react-components';
 
@observer(['appStore', 'appProviders'])
class UploadApartmentStep2 extends UploadApartmentBaseStep.wrappedComponent {

  componentDidMount() {
    if (this.props.appStore.cityStore.cities.length === 0) {
      this.props.appProviders.cityProvider.loadCities();
    }
    if (this.props.appStore.newListingStore.formValues) {
      // load form with existing values
      this.refs.form.refs.formsy.reset(this.props.appStore.newListingStore.formValues);
    }
  }

  clickNext() {
    const formsy = this.refs.form.refs.formsy; 
    if (formsy.state.isValid) {
      super.clickNext();
    } else {
      formsy.submit(); // will trigger validation messages
    }
  }

  render() {
    const { newListingStore } = this.props.appStore;
    const cities = this.props.appStore.cityStore.cities;
    const citySelectorOptions = cities.length ? cities.map(city => ({ label: city.city_name })) : [ { label: 'טוען...' } ];

    const roomOptions = newListingStore.roomOptions.slice(0);
    if (!newListingStore.formValues.rooms) { roomOptions.unshift({ label: 'בחר'}); }

    return (
      <div className="container-fluid upload-apt-wrapper">

        <div className="col-md-7 upload-apt-right-container">
          <div className="text">
            <h1>מלאו את הפרטים של הדירה <br/>המעיפה שלכם!</h1>
            <ul>
              <li>מלאו את פרטי הדירה</li>
              <li>הקפידו למלא את כל הפרטים</li>
              <li>שקפו את המציאות כמו שהיא, על מנת למנוע ביקורים מיותרים</li>
            </ul>
          </div>
          <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-folder.svg" alt="" />
        </div>

        <div className="col-md-5 upload-apt-left-container apartment-details-step">
          <formHelper.FormWrapper layout="vertical" onChange={this.handleChanges} ref="form">

            <div className="row form-section">
              <div className="form-section-headline">כתובת</div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Select name="apartment.building.city.city_name" label="עיר" options={citySelectorOptions} value={citySelectorOptions[0].label} required />
                </div>
                <div className="col-md-6">
                  <FRC.Input value="" name="apartment.building.street_name" label="שם רחוב" type="text" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input value="" name="apartment.building.house_number" label="מספר בניין" type="text" required />
                </div>
                <div className="col-md-6">
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
                <div className="col-md-4">
                  <FRC.Input value="" name="apartment.size" label="גודל הדירה" type="number" required />
                </div>
                <div className="col-md-4">
                  <FRC.Select name="apartment.rooms" label="מספר חדרים" required options={roomOptions} />
                </div>
                <div className="col-md-4">
                  <FRC.Input value="" name="roomates" label="שותפים" type="text" />
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
              </div>
              <div className="row">
                <FRC.Checkbox name="apartment.air_conditioning" label="מזגן" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.balcony" label="מרפסת" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.security_bars" label="סורגים" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="apartment.parquet_floor" label="פרקט" rowClassName="checkbox-inline"/>
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
                  <FRC.Input value="" name="monthly_rent" label='שכ"ד לחודש' type="number" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input value="" name="property_tax" label="ארנונה לחודשיים" type="number" /> 
                </div>
                <div className="col-md-6">
                  <FRC.Input value="" name="board_fee" label="ועד בית לחודש" type="number" /> 
                </div>
              </div>
            </div>

          </formHelper.FormWrapper>
          
          <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <span onClick={this.clickBack}>
              <i className=" apartment-details-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>
              &nbsp; שלב קודם
            </span>
            <span>2/3</span>
            <span onClick={this.clickNext}>
              שלב הבא &nbsp;
              <i className="apartment-details-next-step fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i>
            </span>
          </div> 

        </div>
      </div>
    );
  }
}

export default UploadApartmentStep2;
