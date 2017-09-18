import React from 'react';
import { Button, Col, Grid } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import ImageUpload from './ImageUpload/ImageUpload.jsx';
import ReactTooltip from 'react-tooltip';

@inject('appStore', 'appProviders') @observer
class UploadApartmentStep2 extends UploadApartmentBaseStep.wrappedComponent {
  componentDidMount() {
    const { authProvider, listingsProvider } = this.props.appProviders;
    if (!authProvider.shouldLogin({ onHideCallback: this.clickBack })) {
      const { newListingStore } = this.props.appStore;
      listingsProvider.validateApartment(newListingStore.toListingObject())
        .then(this.handleValidationResponse);
    }
  }

  handleValidationResponse(validationResp) {
    if (!validationResp) {
      return
    }

    const { modalProvider, navProvider } = this.props.appProviders;
    const { newListingStore } = this.props.appStore;
    const listingId = validationResp.listing_id;
    const modalOptions = {
      bodyClass: 'upload-apartment-validation-popup',
      closeButton: true,
      closeHandler: this.clickBack // Modal will only be fired on the next step, so after we close it we want to go one step back
    };

    switch (validationResp.status) {
      case 'belongsToOtherUser':
        Object.assign(modalOptions, {
          title: 'דירה זו כבר קיימת באתר!',
          body: (
            <div>
              <div>
                אנא וודאו שפרטי הדירה שהכנסתם נכונים
              </div>
              <div>
                <Button className="upload-apartment-validation-popup-back-button" onClick={() => modalProvider.close()}>חזור לפרטי הדירה</Button>
              </div>
              <div className="upload-apartment-validation-popup-contact-us">
                אם דירה זו שייכת לכם צרו עמנו קשר
                <div> או&nbsp;
                <a className="upload-apartment-validation-popup-link" href="mailto:contact@dorbel.com">שלחו לנו מייל</a>
                </div>
              </div>
            </div>
          )
        });
        break;
      case 'alreadyListed':
        Object.assign(modalOptions, {
          title: 'דירה זו כבר קיימת בחשבונכם!',
          body: (
            <div>
              <div>
                רוצים לעדכן את המודעה?
              </div>
              <div>
                בחרו מה ברצונכם לעשות:
              </div>
              <div className="upload-apartment-validation-popup-button-wrapper">
                <Button
                  href={`/dashboard/my-properties/${listingId}/edit`}
                  onClick={navProvider.handleHrefClick}
                  className="upload-apartment-validation-popup-button"
                  bsStyle="info">
                  עריכת פרטי דירה
                </Button>
              </div>
            </div>
          )
        });
        break;
      default:
        return;
    }

    modalProvider.show(modalOptions);
  }

  renderSidePanelText() {
    return (this.props.appStore.newListingStore.uploadMode == 'manage') ?
      (
        <div className="upload-apt-right-container-text-container">
          <h1>תמונות של הנכס</h1>
          <div>הוסיפו תמונות של הנכס.</div>
          <div>בהמשך תוכלו להוסיף או לעדכן תמונות בלחצית כפתור.</div>
        </div>
      )
      :
      (
        <div className="upload-apt-right-container-text-container">
          <h1>תמונות של הדירה</h1>
          <ul>
            <li>תמונות טובות זה ממש חשוב כדי שדיירים יבינו איך נראית הדירה</li>
            <li>תמונות שישקפו את הדירה היטב ימשכו יותר דיירים רציניים</li>
          </ul>
        </div>
      );
  }

  render() {
    const { newListingStore } = this.props.appStore;
    const disableSave = newListingStore.shouldDisableSave;
    const isManageMode = this.props.appStore.newListingStore.uploadMode == 'manage';
    const isHideTooltip = isManageMode || newListingStore.formValues.images.length > 0;

    return (
      <Grid fluid className="upload-apt-wrapper">
        <Col md={5} className="upload-apt-right-container">
          <div className="upload-apt-right-container-text-wrapper">
            {this.renderSidePanelText()}
          </div>
          <img src="https://static.dorbel.com/images/upload-apt-form/icon-signup-photos.svg" alt="Upload photos" />
        </Col>
        <Col md={7} className="upload-apt-left-container apartment-pictures-step">
          <div className="photos-upload">
            <ImageUpload editedListingStore={newListingStore} />
            <Col xs={12} md={7} className="form-nav bottom">
              <span className="prev-step step2" onClick={this.clickBack}>
                <i className="apartment-pictures-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>
                &nbsp; חזור
              </span>
              <span>2/3</span>
              <span className="next-step" data-tip="נא להוסיף תמונות">
                <Button bsStyle="success" className="step-btn step2" onClick={this.clickNext.bind(this)} disabled={disableSave}>
                  שמור והמשך &nbsp;
                  <i className="apartment-pictures-next-step fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i>
                </Button>
              </span>
              <ReactTooltip type="dark" effect="solid" place="top" disable={isHideTooltip} />
            </Col>
          </div>
        </Col>
      </Grid>
    );
  }
}

UploadApartmentStep2.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default UploadApartmentStep2;
