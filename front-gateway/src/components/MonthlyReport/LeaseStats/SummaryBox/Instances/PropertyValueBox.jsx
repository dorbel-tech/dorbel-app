import React, { Component } from 'react';
import { inject } from 'mobx-react';
import autobind from 'react-autobind';
import { Button } from 'react-bootstrap';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';
import SummaryBox from '../SummaryBox';

@inject('appProviders')
class PropertyValueBox extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.modalProvider = this.props.appProviders.modalProvider;
    this.listingsProvider = this.props.appProviders.listingsProvider;
  }
  showUpdatePropertyValuePopup(propertyValue, listingId) {
    this.modalProvider.show({
      closeButton: true,
      title: 'עדכון שווי נכס',
      body: (
        <div>
          <FormWrapper.Wrapper ref={ref => this.form = ref} layout="vertical">
            <span>עדכנו את שווי הנכס לקבלת חישוב תשואה מדוייקת עבור הנכס שלכם</span>
            <FRC.Input
              value={propertyValue.toLocaleString()}
              name="property_value"
              onChange={(inputName, inputVal) => {
                const formsy = this.form.refs.formsy;
                const currentModel = formsy.getModel();
                inputVal = parseInt(inputVal.replace(/[^0-9.]+/g, '')) || '';
                currentModel[inputName] = inputVal.toLocaleString();
                formsy.reset(currentModel);
              }} />
            <Button
              bsStyle="success"
              onClick={() => {
                const formsy = this.form.refs.formsy;
                let { property_value } = formsy.getModel();
                property_value = parseInt(property_value.replace(/[^0-9.]+/g, ''));
                if (property_value) {
                  this.listingsProvider.updateListing(listingId, { property_value })
                    .then(() => {
                      this.props.appProviders.notificationProvider.success('שווי הנכס עודכן בהצלחה');
                      this.modalProvider.close();
                    });
                }
              }}>
              עדכן
            </Button>
          </FormWrapper.Wrapper>
        </div>
      ),
      modalSize: 'small'
    });
  }

  render() {
    const { propertyValueFormatted, propertyValue, listing } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={propertyValueFormatted}
        text="שווי הנכס (מוערך)"
        linkText="עדכן שווי נכס"
        linkOnClick={() => this.showUpdatePropertyValuePopup(propertyValue, listing.id)}
      />
    );
  }
}

PropertyValueBox.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default PropertyValueBox;

