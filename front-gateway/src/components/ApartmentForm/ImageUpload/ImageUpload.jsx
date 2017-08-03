import React from 'react';
import autobind from 'react-autobind';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Row, Checkbox } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';

import './ImageUpload.scss';

@inject('appProviders') @observer
export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.uploadImagePromises = [];
  }

  onChooseFile(acceptedFiles) {
    const { appProviders, editedListingStore } = this.props;

    let uploadPromises = acceptedFiles.map(file => appProviders.listingImageProvider.uploadImage(file, editedListingStore));
    this.uploadImagePromises = this.uploadImagePromises.concat(uploadPromises);
    Promise.all(this.uploadImagePromises);
  }

  renderImage(image, index) {
    const { editedListingStore, appProviders } = this.props;
    const { images } = editedListingStore.formValues;
    const { listingImageProvider } = appProviders;
    const progressPct = image.progress * 100;

    const progressBar = (
      <ProgressBar now={progressPct} />
    );

    const deleteButton = (
      <a href="#"
        className="image-action remove-image pull-left"
        onClick={() => {
          listingImageProvider.deleteImage(image, editedListingStore);
          if (images.length == 1 || (image.display_order == 0 && !images.find(img => img.display_order == 0))) {
            images[0].display_order = 0;
          }
        }}>
        <i className="fa fa-trash" />
        הסרת תמונה
      </a>

    );

    const setDefaultButton = (
      <Checkbox
        inline
        className="image-action"
        checked={image.display_order == 0}
        onChange={() => {
          images.map(img => img.display_order = 99);
          image.display_order = 0;
        }}>
        תמונה ראשית
      </Checkbox>
    );

    return (
      <div key={index} className="image col-md-4 thumb">
        <div className="thumb-inner">
          <label className="uploaded-image">
            <CloudinaryImage className="img-full" src={image.src} width={180} />
            {image.complete ? setDefaultButton : undefined}
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
              <span className="add-photo">
                <p><b>הוספת תמונות&nbsp;<i className="fa fa-plus"></i></b></p>
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
