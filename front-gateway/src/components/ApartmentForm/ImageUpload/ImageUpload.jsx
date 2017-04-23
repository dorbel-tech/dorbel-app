import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';

@inject('appProviders') @observer
export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.uploadImagePromises = [];
  }

  onChooseFile(acceptedFiles) {
    const { appProviders, editedListingStore, onUploadComplete, onUploadStart } = this.props;

    if (onUploadStart) {
      onUploadStart();
    }

    let uploadPromises = acceptedFiles.map(file => appProviders.listingImageProvider.uploadImage(file, editedListingStore));
    this.uploadImagePromises = this.uploadImagePromises.concat(uploadPromises);
    Promise.all(this.uploadImagePromises)
    .then(() => {
      if (onUploadComplete) {
        onUploadComplete();
      }
    });
  }

  renderImage(image, index) {
    const { editedListingStore, appProviders } = this.props;
    const { listingImageProvider } = appProviders;
    const progressPct = Math.round(image.progress * 100) + '%';
    const progressBarStyle = { width: progressPct };

    const progressBar = (
      <ProgressBar now={progressPct}/>
    );

    const deleteButton = (<div><a href="#" className="remove-image" onClick={() => listingImageProvider.deleteImage(image, editedListingStore)} >הסרת תמונה</a></div>);

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
    const images = this.props.editedListingStore.formValues.images;

    return (
      <form>
        <Row className="thumbs">
          <Dropzone className="col-md-4 thumb" multiple={true} onDrop={this.onChooseFile.bind(this)}>
            <div className="thumb-inner add">
              <span className="add-photo">הוספת תמונה +</span>
            </div>
          </Dropzone>
          {images.map(this.renderImage.bind(this))}
        </Row>
      </form>
    );
  }
}

ImageUpload.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  editedListingStore: React.PropTypes.object.isRequired,
  onUploadStart: React.PropTypes.func,
  onUploadComplete: React.PropTypes.func
};
