import React from 'react';
import { Button, Col, Grid } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import ImageUpload from './ImageUpload/ImageUpload.jsx';

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
    const { modalProvider, navProvider } = this.props.appProviders;
    if (validationResp) {
      switch (validationResp.status) {
        case 'belongsToOtherUser':
          modalProvider.show({
            bodyClass: 'upload-apartment-validation-popup',
            title: 'דירה זו כבר קיימת באתר!',
            body: (
              <div>
                <div>
                  אנא וודאו שפרטי הדירה נכונים.
                </div>
                <div>
                  אם דירה זו שייכת לכם צרו עמנו קשר או
                  &nbsp;<a className="upload-apartment-validation-popup-link" href="mailto:contact@dorbel.com">שלחו לנו מייל</a>
                </div>
              </div>
            ),
            closeHandler: this.clickBack
          });
          break;
        case 'alreadyListed':
          modalProvider.show({
            bodyClass: 'upload-apartment-validation-popup',
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
                    href={`/dashboard/my-properties/${validationResp.listing_id}/edit`}
                    onClick={navProvider.handleHrefClick}
                    className="upload-apartment-validation-popup-button"
                    bsStyle="info">
                    עריכת פרטי דירה
                  </Button>
                  <Button
                    href={`/dashboard/my-properties/${validationResp.listing_id}/ohe`}
                    onClick={navProvider.handleHrefClick}
                    className="upload-apartment-validation-popup-button"
                    bsStyle="info">
                    <i className="fa fa-plus" />&nbsp;
                    הוספת מועד ביקור
                  </Button>
                </div>
              </div>
            ),
            closeHandler: this.clickBack
          });
          break;
        case 'alreadyExists':
          modalProvider.show({
            bodyClass: 'upload-apartment-validation-popup',
            title: 'דירה זו כבר קיימת בחשבונכם!',
            body: (
              <div>
                <div>
                  שימו לב - שליחת הטופס תעדכן את פרטי הדירה הקיימת.
                  <div>
                    באפשרותכם גם&nbsp;
                    <a
                      className="upload-apartment-validation-popup-link"
                      href={`/dashboard/my-properties/${validationResp.listing_id}`}>
                      להכנס לחשבון הדירה
                    </a>
                  </div>
                  ולנהל אותה משם
                </div>
              </div>
            )
          });
          break;
        default:
          break;
      }
    }
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
            <li>וודאו שהחדר מסודר</li>
            <li>השתדלו לצלם כל חדר לרוחב ומ-2 זויות</li>
            <li>תמונות טובות יחסכו לכם שאלות מיותרות</li>
          </ul>
        </div>
      );
  }

  render() {
    const { newListingStore } = this.props.appStore;

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
              <span className="next-step" onClick={this.clickNext.bind(this)}>
                <Button bsStyle="success" className="step-btn step2" disabled={newListingStore.disableSave}>
                  שמור והמשך &nbsp;
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

UploadApartmentStep2.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default UploadApartmentStep2;
