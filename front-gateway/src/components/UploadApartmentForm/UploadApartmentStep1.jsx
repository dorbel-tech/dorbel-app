import React from 'react';
import { inject } from 'mobx-react';
import Dropzone from 'react-dropzone';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';

@inject('appProviders')
class UploadApartmentStep1 extends UploadApartmentBaseStep {
  constructor(props) {
    super(props);
    this.state.formValues.images = [];
  }

  onChooseFile(acceptedFiles) {
    this.props.appProviders.cloudinaryProvider.upload(acceptedFiles[0]) // expecting only one file each time      
    .then(uploadedImage => {
      this.handleChange('images', this.state.formValues.images.concat([uploadedImage]));
    });
  }

  render() {
    const images = this.state.formValues.images;

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
            <img src="assets/images/icon-signup-photos.svg" alt="" />
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
                {images.map(image =>
                  <div key={image.public_id} className="image col-md-4 thumb">
                    <div className="thumb-inner">
                      <label className="uploaded-image">
                        <img className="img-full" height="190" width="340"
                          src={`http://res.cloudinary.com/dorbel/${image.resource_type}/${image.type}/c_fill,h_190,w_340/v${image.version}/${image.public_id}.${image.format}`} />
                      </label>
                    </div>
                  </div>
                )}
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
  appProviders: React.PropTypes.object
};

export default UploadApartmentStep1;
