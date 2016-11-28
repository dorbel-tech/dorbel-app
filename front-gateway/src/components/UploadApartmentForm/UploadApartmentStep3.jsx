import React from 'react';
import { observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import DatePicker from '~/components/DatePicker/DatePicker';
import formHelper from './formHelper';
import FRC from 'formsy-react-components';

@observer(['appStore', 'appProviders'])
class UploadApartmentStep3 extends UploadApartmentBaseStep.wrappedComponent {

  componentDidMount() {
    if (this.props.appStore.newListingStore.formValues) {
      // load form with existing values
      this.refs.form.refs.formsy.reset(this.props.appStore.newListingStore.formValues);
    }
  }

  getHourOptions(hoursArray) {
    return hoursArray.map((hour) => ({ label:hour }));
  }

  renderUserDetails() {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;

    if (authStore.isLoggedIn) {
      const profile = authStore.getProfile();
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <FRC.Input name="user_firstname" label="שם פרטי" value={profile.given_name} disabled={true} />
            </div>
            <div className="col-md-6">
              <FRC.Input name="user_lastname" label="שם משפחה" value={profile.family_name} disabled={true} />
            </div>                
          </div>
          <div className="row">
            <div className="col-md-6">
              <FRC.Input name="user_email" label="מייל" type="email" validations="isEmail" value={profile.email} disabled={true} />
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
      );
    } else {
      return (<button onClick={authProvider.showLoginModal}>הכנס למערכת על מנת להשלים את הטופס</button>);
    }
  }
  
  render() {
    let { newListingStore, authStore } = this.props.appStore;

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
          <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-card.svg" alt="" />
        </div>
        <div className="col-md-5 upload-apt-left-container">
          <formHelper.FormWrapper layout="vertical" onChange={this.handleChanges} ref="form">
            <div className="row form-section">
              <div className="form-section-headline">מועדי ביקור בדירה</div>
              <div className="form-group">
                <label>תאריך</label>
                <DatePicker value={this.props.appStore.newListingStore.formValues.ohe_date} onChange={this.handleChange.bind(this, 'ohe_date')} />              
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Select name="ohe_start_time" label="שעת התחלת ביקור" required options={this.getHourOptions(newListingStore.hours)} />
                </div>
                <div className="col-md-6">
                  <FRC.Select name="ohe_end_time" label="שעת סיום ביקור" required options={this.getHourOptions(newListingStore.endHours)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FRC.Textarea name="ohe_comments" rows={3} label="הכוונה לדירה בבניין (אם צריך)" />
                </div>
              </div>
            </div>

            <div className="row form-section">
              <div className="form-section-headline">פרטי משתמש</div>              
              {this.renderUserDetails()}                            
            </div>
          </formHelper.FormWrapper>

        <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <span onClick={this.clickBack.bind(this)}><i className="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; שלב קודם</span>
          <span>3/3</span>
          <button onClick={this.clickNext.bind(this)} disabled={!authStore.isLoggedIn} className="btn btn-lg btn-default btn-submit dorbel-btn">שליחה וסיום</button>
        </div>
      </div>
    </div>      
    );
  }
}

export default UploadApartmentStep3;
