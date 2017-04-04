import React from 'react';
import { observer } from 'mobx-react';
import { Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';

@observer(['appProviders', 'appStore'])
export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.uploadImagePromises = [];
  }

  onChooseFile(acceptedFiles) {
    const { appProviders, onUploadComplete, onUploadStart} = this.props;

    if (onUploadStart) {
      onUploadStart();
    }

    let uploadPromises = acceptedFiles.map(file => appProviders.listingsProvider.uploadImage(file));
    this.uploadImagePromises = this.uploadImagePromises.concat(uploadPromises);
    Promise.all(this.uploadImagePromises)
    .then(() => {
      if (onUploadComplete) {
        onUploadComplete();
      }
    });
  }

  renderImage(image, index) {
    const { listingsProvider } = this.props.appProviders;
    const progressPct = Math.round(image.progress * 100) + '%';
    const progressBarStyle = { width: progressPct };

    const progressBar = (
      <div className="progress">
        <div className="progress-bar" style={ progressBarStyle }>
          {progressPct}
        </div>
      </div>
    );

    const deleteButton = (<div><a href="#" className="remove-image" onClick={() => listingsProvider.deleteImage(image)} >הסרה</a></div>);

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
      <form>
        <Row className="thumbs">
          <Dropzone className="col-md-4 thumb" multiple={true} onDrop={this.onChooseFile.bind(this)}>
            <div className="thumb-inner add">
              <span className="add-photo">הוסף תמונה +</span>
            </div>
          </Dropzone>
          {images.map(this.renderImage.bind(this))}
        </Row>
      </form>
    );
  }
}

ImageUpload.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  onUploadStart: React.PropTypes.func,
  onUploadComplete: React.PropTypes.func
};
