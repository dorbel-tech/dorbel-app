import React, { Component } from 'react';
import { observer } from 'mobx-react';
import style from './UploadApartmentForm.scss';

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
            <div className={style.uploadAptRightContainer}>
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
          <div class="photos-upload">
            <form>
              <div class="row thumbs">
                <div class="col-md-4 thumb"><div class="thumb-inner"><span class="plus">+</span><span class="upload-photo">תמונה 1</span></div></div>
                <div class="col-md-4 thumb"><div class="thumb-inner"><span class="plus">+</span><span class="upload-photo">תמונה 2</span></div></div>
                <div class="col-md-4 thumb"><div class="thumb-inner add"><span class="add-photo">הוסף תמונה</span></div></div>
              </div>
            </form>
            <div class="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
              <span><i class="fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i> &nbspשלב קודם</span>
              <span>1/3</span>
              <span>שלב הבא &nbsp<i class="fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i></span>
            </div>
          </div>
        )
      }
    ];

    var currentStep = steps[this.state.stepNumber];

    return (
      // <div class="container-fluid upload-apt-wrapper">
      <div className={style.uploadAptWrapper}>
        <div class="col-md-7 upload-apt-right-container">
          {currentStep.rightSide}
        </div>
        <div class="col-md-5 upload-apt-left-container">
          {currentStep.leftSide}
        </div>
      </div>
    );
  }
}

export default UploadApartmentForm;
