import React from 'react';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';

@observer(['appProviders', 'appStore'])
class UploadApartmentStep1 extends UploadApartmentBaseStep {
  onChooseFile(acceptedFiles) {
    this.props.appProviders.apartmentsProvider.uploadImage(acceptedFiles[0]); // expecting only one file each time      
  }

  renderImage(image, index) {
    const progressPct = Math.round(image.progress * 100) + '%';  
    const progressBarStyle = { width: progressPct };

    const progressBar = (
      <div className="progress">
        <div className="progress-bar" style={ progressBarStyle }>
          {progressPct}
        </div>
      </div>
    );

    return (
      <div key={index} className="image col-md-4 thumb">
        <div className="thumb-inner">
          <label className="uploaded-image">
            <img className="img-full" height="190" width="340" src={image.src} />
            {image.complete ? null : progressBar}
          </label>
        </div>
      </div>);
  }

  render() {
    const images = this.props.appStore.newListingStore.images;

    return (
      <div className="container-fluid upload-apt-wrapper">
        <div className="col-md-7 upload-apt-right-container">
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
            <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-photos.svg" alt="Upload photos" />
          </div>
        </div>
        <div className="col-md-5 upload-apt-left-container">
          <div className="photos-upload" >
            <form>
              <div className="row thumbs">
                <Dropzone className="col-md-4 thumb" multiple={false} onDrop={this.onChooseFile.bind(this)}>
                  <div className="thumb-inner add">
                    <span className="add-photo">הוסף תמונה</span>
                  </div>
                </Dropzone>
                {images.map(this.renderImage)}
              </div>
            </form>
            <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
              <span></span>
              <span>1/3</span>
              <span onClick={this.clickNext.bind(this)}>שלב הבא &nbsp;<i className="fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UploadApartmentStep1.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default UploadApartmentStep1;
