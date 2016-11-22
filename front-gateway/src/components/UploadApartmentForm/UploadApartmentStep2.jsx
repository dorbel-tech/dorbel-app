import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import DatePicker from '~/components/DatePicker/DatePicker';
import formHelper from './formHelper';
import FRC from 'formsy-react-components';
 
// TODO:
// --- A LOT of refactoring ---
// Entire form should be dynamic and based on schema from backend
// All the form controls should be components

const roomOptions = _.range(1,11,0.5).map(num => ({value:num, label:num}));

@observer(['appStore', 'appProviders'])
class UploadApartmentStep2 extends UploadApartmentBaseStep {

  componentDidMount() {
    if (this.props.appStore.cityStore.cities.length === 0) {
      this.props.appProviders.cityProvider.loadCities();
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
    const cities = this.props.appStore.cityStore.cities;
    const citySelectorOptions = cities.length ? cities.map(city => ({ label: city.city_name })) : [ { label: 'טוען...' } ];

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

        <div className="col-md-5 upload-apt-left-container">
          <formHelper.FormWrapper layout="vertical" onChange={this.handleChanges} ref="form">

            <div className="row form-section">
              <div className="form-section-headline">כתובת</div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Select name="city_name" label="עיר" options={citySelectorOptions} value={citySelectorOptions[0].label} required />
                </div>
                <div className="col-md-6">
                  <FRC.Input value="" name="street_name" label="שם רחוב" type="text" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input value="" name="house_number" label="מספר בניין" type="text" required />
                </div>
                <div className="col-md-6">
                  <FRC.Input value="" name="apt_number" label="מספר דירה" type="text" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <FRC.Input value="" name="entrance" label="כניסה" type="text" />
                </div>
                <div className="col-md-4">
                  <FRC.Input value="" name="floor" label="קומה" type="number" required />
                </div>
                <div className="col-md-4">
                  <FRC.Input value="" name="floors" label="מס' קומות בבניין" type="number" />
                </div>
              </div>
            </div>

            <div className="row form-section">
              <div className="form-section-headline">פרטי הדירה</div>
              <div className="row">
                <div className="col-md-4">
                  <FRC.Input value="" name="size" label="גודל הדירה" type="number" required />
                </div>
                <div className="col-md-4">
                  <FRC.Select name="rooms" label="מספר חדרים" required options={roomOptions} value={roomOptions[0].value} />
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
                <FRC.Checkbox name="parking" label="חנייה" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="elevator" label="מעלית" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="sun_heated_boiler" label="דוד שמש" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="pets" label='מותר בע"ח' rowClassName="checkbox-inline"/>
              </div>
              <div className="row">
                <FRC.Checkbox name="air_conditioning" label="מזגן" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="balcony" label="מרפסת" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="security_bars" label="סורגים" rowClassName="checkbox-inline"/>
                <FRC.Checkbox name="parquet_floor" label="פרקט" rowClassName="checkbox-inline"/>
              </div>
            </div>

            <div className="row form-section">
              <div className="form-section-headline">חוזה ותשלומים</div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>תאריך כניסה לדירה</label>
                    <DatePicker onChange={this.handleChange.bind(this, 'lease_start')} />                    
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
              <i className="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>
              &nbsp; שלב קודם
            </span>
            <span>2/3</span>
            <span onClick={this.clickNext}>
              שלב הבא &nbsp;
              <i className="fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i>
            </span>
          </div>

        </div>
      </div>
    );
  }
}

export default UploadApartmentStep2;
