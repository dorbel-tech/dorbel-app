import React from 'react';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';

@observer(['appProviders', 'appStore'])
class UploadApartmentStep1 extends UploadApartmentBaseStep.wrappedComponent {
  onChooseFile(acceptedFiles) {
    this.props.appProviders.apartmentsProvider.uploadImage(acceptedFiles[0]); // expecting only one file each time      
  }

  renderImage(image, index) {
    const { apartmentsProvider } = this.props.appProviders;
    const progressPct = Math.round(image.progress * 100) + '%';  
    const progressBarStyle = { width: progressPct };

    const progressBar = (
      <div className="progress">
        <div className="progress-bar" style={ progressBarStyle }>
          {progressPct}
        </div>
      </div>
    );

    const deleteButton = (<div><a href="#" className="remove-image" onClick={() => apartmentsProvider.deleteImage(image)} >הסרה</a></div>);

    return (
      <div key={index} className="image col-md-4 thumb">
        <div className="thumb-inner">
          <label className="uploaded-image">
            <CloudinaryImage className="img-full" src={image.src} width={180} />
            {image.complete ? deleteButton : progressBar}
          </label>
        </div>
      </div>);
  }

  render() {
    const images = this.props.appStore.newListingStore.formValues.images;

    return (
      <div className="container-fluid upload-apt-wrapper">
        <div className="col-md-7 upload-apt-right-container">
          <div>
            <div className="text">
              <h1>תמונות של הדירה</h1>
              <p>אנא השקיעו בתמונות (צלמו לרוחב) וחסכו לעצמכם שאלות מיותרות</p>
              <ul>
                <li>וודאו שהחדר מסודר</li>
                <li>טיפ: צלמו כל חדר מ-2 זויות (כולל מטבח, מרפסת וכו׳)</li>
              </ul>
            </div>
            <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-photos.svg" alt="Upload photos" />
          </div>
        </div>
        <div className="col-md-5 upload-apt-left-container apartment-pictures-step">
          <div className="photos-upload" >
            <form>
              <div className="row thumbs">
                <Dropzone className="col-md-4 thumb" multiple={false} onDrop={this.onChooseFile.bind(this)}>
                  <div className="thumb-inner add">
                    <span className="add-photo">הוסף תמונה +</span>
                  </div>
                </Dropzone>
                {images.map(this.renderImage.bind(this))}
              </div>
            </form>
            <div className="form-nav bottom col-lg-5 col-md-5 col-sm-12 col-xs-12">
              <span></span>
              <span>1/3</span>
              <span className="next-step" onClick={this.clickNext.bind(this)}>
                <div className="btn step-btn">
                  שלב הבא &nbsp;
                  <i className="apartment-pictures-next-step fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i>
                </div>
              </span>
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
