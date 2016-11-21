import React from 'react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import DatePicker from '~/components/DatePicker/DatePicker';
import signupCard from '~/assets/images/icon-signup-card.svg';

import formHelper from './formHelper';
import FRC from 'formsy-react-components';

const hours = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'
];

function getHourOptions(hoursArray) {
  return hoursArray.map((hour) => ({ label:hour }));
}

class UploadApartmentStep3 extends UploadApartmentBaseStep {
  constructor(props) {
    super(props);    
    this.state.formValues.ohe_start_time = hours[0];
    this.state.formValues.ohe_end_time = hours[1];
  }
  
  render() {
    const endHours = hours.slice(hours.indexOf(this.state.formValues.ohe_start_time) + 1); // start end_hours after start_hours

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
          <formHelper.FormWrapper layout="vertical" onChange={this.handleChanges}>
            <div className="row form-section">
              <div className="form-section-headline">מועדי ביקור בדירה</div>
              <div className="form-group">
                <label>תאריך</label>
                <DatePicker onChange={this.handleChange.bind(this, 'ohe_date')} />              
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Select name="ohe_start_time" label="שעת התחלת ביקור" required options={getHourOptions(hours)} />
                </div>
                <div className="col-md-6">
                  <FRC.Select name="ohe_end_time" label="שעת סיום ביקור" required options={getHourOptions(endHours)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FRC.Textarea name="ohe_comments" rows={3} label="הכוונה לדירה בבניין (אם צריך)" />
                </div>
              </div>
            </div>

            <div className="row form-section">
              <div className="form-section-headline">מועדי ביקור בדירה</div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input name="user_firstname" label="שם פרטי" />
                </div>
                <div className="col-md-6">
                  <FRC.Input name="user_lastname" label="שם משפחה" />
                </div>                
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Input name="user_email" label="מייל" type="email" validations="isEmail" />
                </div>
                <div className="col-md-6">
                  <FRC.Input name="user_phone" label="טלפון" />
                </div>                
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FRC.RadioGroup name="publishing_user_type" type="inline" label="הגדר אותי במודעה כ:" value="landlord"              
                    options={[{label:'בעל הדירה', value:'landlord'},{label:'הדייר הנוכחי',value:'tenant'}]} />
                </div>
              </div>              
            </div>
          </formHelper.FormWrapper>

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
