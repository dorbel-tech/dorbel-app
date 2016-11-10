import React, { Component } from 'react';

class UploadApartmentStep2 extends Component {
  render() {
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
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>שם רחוב</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>מספר בניין</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>מספר דירה</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>כניסה</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>קומה</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>מספר קומות בבניין</label>
                    <input type="text" className="form-control" placeholder="" />
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
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>מספר חדרים</label>
                    <input type="text" className="form-control" placeholder="" />
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
                  <input type="checkbox" value="" />יש חנייה</label>
                <label className="checkbox-inline">
                  <input type="checkbox" value="" />יש מעלית</label>
                <label className="checkbox-inline">
                  <input type="checkbox" value="" />דוד-שמש</label>
                <label className="checkbox-inline">
                  <input type="checkbox" value="" />מותר בע״ח</label>
              </div>
              <div className="row checkbox-row">
                <label className="checkbox-inline">
                  <input type="checkbox" value="" />יש מזגן</label>
                <label className="checkbox-inline">
                  <input type="checkbox" value="" />יש מרפסת</label>
                <label className="checkbox-inline">
                  <input type="checkbox" value="" />יש סורגים</label>
                <label className="checkbox-inline">
                  <input type="checkbox" value="" />פרקט</label>
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
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>שכ״ד חודשי</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>ארנונה לחודשיים</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>ועד בית לחודש</label>
                    <input type="text" className="form-control" placeholder="" />
                  </div>
                </div>
              </div>

            </div>
          </form>
          <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <span><i className="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i> &nbspשלב קודם</span>
            <span>2/3</span>

            <span>שלב הבא &nbsp<i className="fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadApartmentStep2;
