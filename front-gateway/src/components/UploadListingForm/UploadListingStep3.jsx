import React from 'react';
import { observer } from 'mobx-react';
import UploadListingBaseStep from './UploadListingBaseStep';
import DatePicker from '~/components/DatePicker/DatePicker';
import FormWrapper from '~/components/FormWrapper/FormWrapper';


@observer(['appStore', 'appProviders'])
class UploadApartmentStep3 extends UploadListingBaseStep.wrappedComponent {

  componentDidMount() {
    // load form with existing values
    this.refs.form.refs.formsy.reset(this.props.appStore.newListingStore.formValues);
  }

  getHourOptions(hoursArray) {
    return hoursArray.map((hour) => ({ label:hour }));
  }


  clickNext() {
    const formsy = this.refs.form.refs.formsy; 
    if (formsy.state.isValid) {
      super.clickNext();
    } else {
      formsy.submit(); // will trigger validation messages
    }
  }  

  renderUserDetails() {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;
    const FRC = FormWrapper.FRC;

    if (authStore.isLoggedIn) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <FRC.Input name="user.firstname" label="שם פרטי" required/>
            </div>
            <div className="col-md-6">
              <FRC.Input name="user.lastname" label="שם משפחה" required/>
            </div>                
          </div>
          <div className="row">
            <div className="col-md-6">
              <FRC.Input name="user.email" label="מייל" type="email" validations="isEmail" validationError="כתובת מייל לא תקינה" required/>
            </div>
            <div className="col-md-6">
              <FRC.Input name="user.phone" label="טלפון" validationError="מספר טלפון לא תקין" required/>
            </div>                
          </div>
          <div className="row">
            <div className="col-md-12">
              <FRC.RadioGroup name="publishing_user_type" type="inline" label="הגדר אותי במודעה כ:"
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
    const FRC = FormWrapper.FRC;

    return (
      <div className="container-fluid upload-apt-wrapper">
        <div className="col-md-7 upload-apt-right-container">
          <div className="text">
            <h1>מועדי ביקור ופרטי קשר</h1>
            <ul>
              <li>בחרו מועד אליו דיירים יוכלו להירשם ולהגיע לביקור בדירה</li>
              <li>מומלץ לבחור בשעות הבוקר/ערב או בסופ״ש - אז דיירים יותר פנויים</li>
              <li>פרטיכם ישמשו לעדכון לגבי כמות המבקרים שנרשמו ועדכונים הנוגעים לתהליך בלבד!</li>
            </ul>
          </div>
          <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-card.svg" alt="" />
        </div>
        <div className="col-md-5 upload-apt-left-container open-house-event-step">
          <FormWrapper.Wrapper layout="vertical" onChange={this.handleChanges} ref="form">
            <div className="row form-section">
              <div className="form-section-headline">מועדי ביקור בדירה</div>
              <div className="form-group">
                <label>תאריך</label>
                <DatePicker name="ohe-date" value={this.props.appStore.newListingStore.formValues.open_house_event_date} onChange={this.handleChange.bind(this, 'open_house_event_date')} />              
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FRC.Select name="open_house_event_start_time" label="שעת התחלת ביקור" required options={this.getHourOptions(newListingStore.hours)} />
                </div>
                <div className="col-md-6">
                  <FRC.Select name="open_house_event_end_time" label="שעת סיום ביקור" required options={this.getHourOptions(newListingStore.endHours)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FRC.Textarea name="open_house_event_comments" rows={3} label="הכוונה לדירה בבניין (אם צריך)" />
                </div>
              </div>
            </div>

            <div className="row form-section">
              <div className="form-section-headline">פרטי משתמש</div>              
              {this.renderUserDetails()}                            
            </div>
          </FormWrapper.Wrapper>

        <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <span onClick={this.clickBack.bind(this)}><i className="open-house-event-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; שלב קודם</span>
          <span>3/3</span>
          <button onClick={this.clickNext.bind(this)} disabled={!authStore.isLoggedIn} className="btn btn-lg btn-default btn-submit dorbel-btn">שליחה וסיום</button>
        </div>
      </div>
    </div>      
    );
  }
}

export default UploadApartmentStep3;
