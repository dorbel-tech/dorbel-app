import React from 'react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import DatePicker from '~/components/DatePicker/DatePicker';
import signupCard from '~/assets/images/icon-signup-card.svg';

const hours = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'
];

function getHourOptions(hoursArray) {
  return hoursArray.map((hour, index) => (<option key={index}>{hour}</option>));
}

class UploadApartmentStep3 extends UploadApartmentBaseStep {
  constructor(props) {
    super(props);    
    this.state.formValues.ohe_start_time = hours[0];
  }
  
  // ohe_start_time needs to be in state because ohe_end_time dependes on it
  onStartTimeChange(changeEvent) {
    this.handleChange('ohe_start_time', changeEvent.target.value);
  }

  render() {
    const endHours = hours.slice(hours.indexOf(this.state.formValues.ohe_start_time) + 1);

    return (
      <div className="container-fluid upload-apt-wrapper">
        <div className="col-md-7 upload-apt-right-container">
          <div className="text">
            <h1>מועדי ביקור ופרטי קשר</h1>
            <ul>
              <li>בחרו מועד ביקור אליו דיירים יוכלו להירשם ולהגיע לביקור בדירה</li>
              <li>אנו ממליצים לבחור מועדים בשעות העקב או בסופ״שׁ, אז דיירים יותר פנויים</li>
              <li>מלאו את פרטיכם על מנת שתוכלו לקבל עדכונים לגבי כמות המבקרים שנרשמו</li>
              <li>פרטיותכם יקרה לנו. פרטיכם ישמשו ליצירת קשר ולעדכונים הנוגעים לתהליך בלבד</li>
            </ul>
          </div>
          <img src={signupCard} alt="" />
        </div>
        <div className="col-md-5 upload-apt-left-container">
          <form>
            <div className="row form-section">
            <div className="form-section-headline">
              מועדי ביקור בדירה
            </div>
            <div className="form-group">
              <label>תאריך 1</label>
              <DatePicker onChange={this.handleChange.bind(this, 'ohe_date')} />              
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>שעת התחלת ביקור</label>
                  <select className="form-control" onChange={this.onStartTimeChange.bind(this)} value={this.state.formValues.ohe_start_time}>
                    {getHourOptions(hours)}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>שעת סיום ביקור</label>
                  <select className="form-control" ref="ohe_end_time">
                    {getHourOptions(endHours)}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>הכוונה לדירה בבניין (אם צריך)</label>
              <textarea ref="ohe_comments" className="form-control" rows="3"></textarea>
            </div>
            </div>
              <div className="row form-section">
                <div className="form-section-headline">
                  מועדי ביקור בדירה
                </div>
              <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>שם פרטי</label>
                <input type="text" className="form-control" placeholder="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>שם משפחה</label>
                <input type="text" className="form-control" placeholder="" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>מייל</label>
                <input type="text" className="form-control" placeholder="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>טלפון</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>
              </div>
            </div>
            <strong>הגדר אותי במודעה כ:</strong>
            <label className="radio-inline">
              <input type="radio" ref="publishing_user_type_landlord" name="publishing_user_type" value="landlord" /> בעל הדירה
            </label>
            <label className="radio-inline">
              <input type="radio" ref="publishing_user_type_tenant" name="publishing_user_type" value="tenant" /> הדייר הנוכחי
            </label>
          </div>
        </form>
        <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <span onClick={this.clickBack.bind(this)}><i className="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; שלב קודם</span>
          <span>3/3</span>
          <button onClick={this.clickNext.bind(this)} className="btn btn-lg btn-default btn-submit dorbel-btn">שליחה וסיום</button>
        </div>
      </div>
    </div>      
    );
  }
}

export default UploadApartmentStep3;
