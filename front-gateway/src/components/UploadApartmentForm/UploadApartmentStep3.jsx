import React, { Component } from 'react';
import formHelper from './formHelper';

class UploadApartmentStep3 extends Component {
  clickSend() {
    if (this.props.onClickNext) {
      const formValues = formHelper.getValuesFromInputRefs(this.refs);
      this.props.onClickNext(formValues);
    }
  }

  render() {
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
          <img src="assets/images/icon-signup-card.svg" alt="" />
        </div>
        <div className="col-md-5 upload-apt-left-container">
          <form>
            <div className="row form-section">
            <div className="form-section-headline">
              מועדי ביקור בדירה
            </div>
            <div className="form-group">
              <label>תאריך 1</label>
              <input ref="ohe_date" type="date" className="form-control" placeholder="" />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>שעת התחלת ביקור</label>
                  <input ref="ohe_start_time" type="time" className="form-control" placeholder="" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>שעת סיום ביקור</label>
                  <input ref="ohe_end_time" type="time" className="form-control" placeholder="" />
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
          <span><i className="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; שלב קודם</span>
          <span>3/3</span>
          <button onClick={this.clickSend.bind(this)} className="btn btn-lg btn-default btn-submit dorbel-btn">שליחה וסיום</button>
        </div>
      </div>
    </div>      
    );
  }
}

UploadApartmentStep3.propTypes = {
  onClickNext: React.PropTypes.func
};

export default UploadApartmentStep3;
