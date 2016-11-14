import React, { Component } from 'react';
import { observer } from 'mobx-react';
import formHelper from './formHelper';

// TODO:
// --- A LOT of refactoring ---
// Entire form should be dynamic and based on schema from backend
// All the form controls should be components

@observer(['appStore', 'appProviders'])
class UploadApartmentStep2 extends Component {
  componentDidMount() {
    if (this.props.appStore.cityStore.cities.length === 0) {
      this.props.appProviders.cityProvider.loadCities();
    }
  }

  clickNext() {
    if (this.props.onClickNext) {
      const formValues = formHelper.getValuesFromInputRefs(this.refs);
      this.props.onClickNext(formValues);
    }
  }

  render() {
    const cities = this.props.appStore.cityStore.cities;
    const citySelector = cities.length ?
      (<select className="form-control" ref="city_name">
        {cities.map(city => (<option key={city.id}>{city.city_name}</option>))}
      </select>) : 
      (<select className="form-control" disabled={true}><option>טוען...</option></select>);

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
          <img src="assets/images/icon-signup-folder.svg" alt="" />
        </div>
        <div className="col-md-5 upload-apt-left-container">
          <form>
            <div className="row form-section">
              <div className="form-section-headline">
                כתובת
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>עיר</label>
                    {citySelector}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>שם רחוב</label>
                    <input ref="street_name" type="text" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>מספר בניין</label>
                    <input ref="house_number" type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>מספר דירה</label>
                    <input ref="apt_number" type="text" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>כניסה</label>
                    <input ref="entrance" type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>קומה</label>
                    <input ref="floor" type="number" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>מספר קומות בבניין</label>
                    <input ref="floors" type="number" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row form-section">
              <div className="form-section-headline">
                פרטי הדירה
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>גודל הדירה</label>
                    <input ref="size" type="number" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>מספר חדרים</label>
                    <input ref="rooms" type="number" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>שותפים</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>מידע נוסף ותיאור הדירה</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>
              <div className="row checkbox-row">
                <label className="checkbox-inline">
                  <input ref="parking" type="checkbox" value="" />יש חנייה</label>
                <label className="checkbox-inline">
                  <input ref="elevator" type="checkbox" value="" />יש מעלית</label>
                <label className="checkbox-inline">
                  <input ref="sun_heated_boiler" type="checkbox" value="" />דוד-שמש</label>
                <label className="checkbox-inline">
                  <input ref="pets" type="checkbox" value="" />מותר בע״ח</label>
              </div>
              <div className="row checkbox-row">
                <label className="checkbox-inline">
                  <input ref="air_conditioning" type="checkbox" value="" />יש מזגן</label>
                <label className="checkbox-inline">
                  <input ref="balcony" type="checkbox" value="" />יש מרפסת</label>
                <label className="checkbox-inline">
                  <input ref="security_bars" type="checkbox" value="" />יש סורגים</label>
                <label className="checkbox-inline">
                  <input ref="parquet_floor" type="checkbox" value="" />פרקט</label>
              </div>
            </div>
            <div className="row form-section">
              <div className="form-section-headline">
                חוזה ותשלומים
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>תאריך כניסה לדירה</label>
                    <input ref="lease_start" type="date" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>שכ״ד חודשי</label>
                    <input ref="monthly_rent" type="number" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>ארנונה לחודשיים</label>
                    <input ref="property_tax" type="number" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>ועד בית לחודש</label>
                    <input ref="board_fee" type="number" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>

            </div>
          </form>
          <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <span><i className="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; שלב קודם</span>
            <span>2/3</span>
            <span onClick={this.clickNext.bind(this)}>שלב הבא &nbsp;<i className="fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
    );
  }
}

UploadApartmentStep2.wrappedComponent.propTypes = {
  onClickNext: React.PropTypes.func,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object
};

export default UploadApartmentStep2;
