import React from 'react';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { observer } from 'mobx-react';
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
      <Grid fluid className="upload-apt-wrapper">
        <Col md={6} className="upload-apt-right-container">
          <div className="upload-apt-right-container-text-wrapper">
            <div className="upload-apt-right-container-text-container">
              <h1>תמונות של הדירה</h1>
              <p>אנא השקיעו בתמונות (צלמו לרוחב) וחסכו לעצמכם שאלות מיותרות</p>
              <ul>
                <li>וודאו שהחדר מסודר</li>
                <li>טיפ: צלמו כל חדר מ-2 זויות (כולל מטבח, מרפסת וכו׳)</li>
              </ul>
            </div>
          </div>
          <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-photos.svg" alt="Upload photos" />
        </Col>

        <Col md={6} className="upload-apt-left-container apartment-pictures-step">
          <div className="photos-upload">
            <form>
              <Row className="thumbs">
                <Dropzone className="col-md-4 thumb" multiple={false} onDrop={this.onChooseFile.bind(this)}>
                  <div className="thumb-inner add">
                    <span className="add-photo">הוסף תמונה +</span>
                  </div>
                </Dropzone>
                {images.map(this.renderImage.bind(this))}
              </Row>
            </form>
            <Col xs={12} md={7} className="form-nav bottom">
              <span></span>
              <span>1/3</span>
              <span className="next-step" onClick={this.clickNext.bind(this)}>
                <Button bsStyle="success" className="step-btn">
                  שלב הבא &nbsp;
                  <i className="apartment-pictures-next-step fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i>
                </Button>
              </span>
            </Col>
          </div>
        </Col>
      </Grid>
    );
  }
}

UploadApartmentStep1.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default UploadApartmentStep1;
