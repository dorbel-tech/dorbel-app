import React from 'react';
import { Button, Col, Grid } from 'react-bootstrap';
import autobind from 'react-autobind';
import { inject, observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import ListingDetailsForm from './ListingDetailsForm/ListingDetailsForm';

@inject('appProviders', 'appStore') @observer
export default class UploadApartmentStep2 extends UploadApartmentBaseStep.wrappedComponent {
  constructor(props) {
    super(props);
    autobind(this);
  }

  clickNext() {
    const validationErrors = this.refs.listingDetailsForm.wrappedInstance.getValidationErrors();
    if (validationErrors) {
      this.props.onValidationError(validationErrors);
    } else {
      super.clickNext();
    }
  }

  render() {
    return (
      <Grid fluid className="upload-apt-wrapper">
        <Col md={5} className="upload-apt-right-container">
          <div className="upload-apt-right-container-text-wrapper">
            <div className="upload-apt-right-container-text-container">
              <h1>מלאו את פרטי הדירה</h1>
              <ul>
                <li>הקפידו למלא את כל הפרטים</li>
                <li>תיאור מלא יעזור למנוע ביקורים מיותרים</li>
              </ul>
            </div>
          </div>
          <img src="https://static.dorbel.com/images/upload-apt-form/icon-signup-folder.svg" alt="" />
        </Col>
        <Col md={7} className="upload-apt-left-container apartment-details-step">
          <ListingDetailsForm
            editedListingStore={this.props.appStore.newListingStore}
            ref="listingDetailsForm"
          />
          <Col xs={12} md={7} className="form-nav bottom">
            <span className="prev-step" onClick={this.clickBack}>
              <i className="apartment-details-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>
              &nbsp; שלב קודם
            </span>
            <span>2/3</span>
            <span className="next-step" onClick={this.clickNext}>
              <Button bsStyle="success" className="step-btn">
                שלב הבא &nbsp;
                <i className="apartment-details-next-step fa fa-arrow-circle-o-left fa-2x" aria-hidden="true"></i>
              </Button>
            </span>
          </Col>
        </Col>
      </Grid>
    );
  }
}

UploadApartmentStep2.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};
