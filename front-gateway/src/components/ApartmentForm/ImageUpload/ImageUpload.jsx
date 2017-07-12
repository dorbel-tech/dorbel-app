import React from 'react';
import autobind from 'react-autobind';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';

@inject('appProviders') @observer
export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.uploadImagePromises = [];
    this.shouldDisableSave();
  }

  onChooseFile(acceptedFiles) {
    const { appProviders, editedListingStore } = this.props;
    editedListingStore.disableSave = true;

    let uploadPromises = acceptedFiles.map(file => appProviders.listingImageProvider.uploadImage(file, editedListingStore));
    this.uploadImagePromises = this.uploadImagePromises.concat(uploadPromises);
    Promise.all(this.uploadImagePromises)
      .then(this.shouldDisableSave);
  }

  shouldDisableSave() {
    const { editedListingStore } = this.props;
    if (editedListingStore.uploadMode == 'manage') {
      editedListingStore.disableSave = false;
    }
    else {
      editedListingStore.disableSave = (editedListingStore.formValues.images.length <= 0);
    }

    editedListingStore.uploadedImagesCount = editedListingStore.formValues.images.length;
  }

  renderImage(image, index) {
    const { editedListingStore, appProviders } = this.props;
    const { listingImageProvider } = appProviders;
    const progressPct = image.progress * 100;

    const progressBar = (
      <ProgressBar now={progressPct} />
    );

    const deleteButton = (
      <div>
        <a href="#"
          className="remove-image"
          onClick={() => {
            this.props.editedListingStore.disableSave = true;
            listingImageProvider.deleteImage(image, editedListingStore);
            this.shouldDisableSave();
          }}>
          הסרת תמונה
          </a>
      </div>
    );

    const setDefaultButton = (
      <div>
        <a href="#"
          className="remove-image"
          onClick={() => {
            this.props.editedListingStore.formValues.images.move(index, 0);
          }}>
          הגדר כתמונה ראשית
          </a>
      </div>
    );

    return (
      <div key={index} className="image col-md-4 thumb">
        <div className="thumb-inner">
          <label className="uploaded-image">
            <CloudinaryImage className="img-full" src={image.src} width={180} />
            {image.complete ? deleteButton : progressBar}
            {image.complete && index > 0 ? setDefaultButton : undefined}            
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
              <span className="add-photo">
              <p><b>הוספת תמונות +</b></p>
              </span>
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
  editedListingStore: React.PropTypes.object.isRequired
};
