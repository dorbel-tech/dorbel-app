import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './UploadApartmentForm.scss';

@observer(['appStore', 'appProviders'])
class UploadApartmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = { stepNumber: 0 };
  }

  render() {
    const steps = [
      {
        rightSide: (
          <div>
            <div className="text">
              <h1>מועדי ביקור ופרטי קשר</h1>
              <ul>
                <li>בחרו מועד ביקור אליו דיירים יוכלו להירשם ולהגיע לביקור בדירה</li>
                <li>אנו ממליצים לבחור מועדים בשעות העקב או בסופ״שׁ, אז דיירים יותר פנויים</li>
                <li>מלאו את פרטיכם על מנת שתוכלו לקבל עדכונים לגבי כמות המבקרים שנרשמו</li>
                <li>פרטיותכם יקרה לנו. פרטיכם ישמשו ליצירת קשר ולעדכונים הנוגעים לתהליך בלבד</li>
              </ul>
            </div>
            <img src="assets/images/icon-signup-photos.svg" alt="" />
          </div>
        ),
        leftSide: (
          <div className="photos-upload" >
            <form>
              <div className="row thumbs">
                <div className="col-md-4 thumb"><div className="thumb-inner"><span className="plus">+</span><span className="upload-photo">תמונה 1</span></div></div>
                <div className="col-md-4 thumb"><div className="thumb-inner"><span className="plus">+</span><span className="upload-photo">תמונה 2</span></div></div>
                <div className="col-md-4 thumb"><div className="thumb-inner add"><span className="add-photo">הוסף תמונה</span></div></div>
              </div>
            </form>
            <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
              <span><i className="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i> &nbspשלב קודם</span>
              <span>1/3</span>
              <span>שלב הבא &nbsp<i className="fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i></span>
            </div>
          </div>
        )
      }
    ];

    var currentStep = steps[this.state.stepNumber];

    return (
      <div className="container-fluid upload-apt-wrapper">
        <div className="col-md-7 upload-apt-right-container">
          {currentStep.rightSide}
        </div>
        <div className="col-md-5 upload-apt-left-container">
          {currentStep.leftSide}
        </div>
      </div>
    );
  }
}

export default UploadApartmentForm;
