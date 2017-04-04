import React from 'react';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import ImageUpload from '~/components/ImageUpload/ImageUpload';

@observer(['appProviders', 'appStore'])
class UploadApartmentStep1 extends UploadApartmentBaseStep.wrappedComponent {

  constructor(props) {
    super(props);
    this.state = { isReadyForNextStep: true };
  }

  render() {
    return (
      <Grid fluid className="upload-apt-wrapper">
        <Col md={5} className="upload-apt-right-container">
          <div className="upload-apt-right-container-text-wrapper">
            <div className="upload-apt-right-container-text-container">
              <h1>תמונות של הדירה</h1>
              <ul>
                <li>וודאו שהחדר מסודר</li>
                <li>השתדלו לצלם כל חדר לרוחב ומ-2 זויות</li>
                <li>תמונות טובות יחסכו לכם שאלות מיותרות</li>
              </ul>
            </div>
          </div>
          <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-photos.svg" alt="Upload photos" />
        </Col>

        <Col md={7} className="upload-apt-left-container apartment-pictures-step">
          <div className="photos-upload">
            <ImageUpload
              onUploadStart={() => this.setState({ isReadyForNextStep: false })}
              onUploadComplete = {() => this.setState({ isReadyForNextStep: true })}
            />
            <Col xs={12} md={7} className="form-nav bottom">
              <span>1/3</span>
              <span className="next-step" onClick={this.clickNext.bind(this)}>
                <Button bsStyle="success" className="step-btn" disabled={!this.state.isReadyForNextStep}>
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
