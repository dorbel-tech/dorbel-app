'use stric';
const common = require('../common');

module.exports = {
  url: function(){
    return common.getBaseUrl() + '/apartments/new_form';
  },
  sections: {
    apartmentPictures: {
      selector: '.apartment-pictures-step',
      elements: {
        nextStep: {
          selector: 'i.apartment-pictures-next-step'
        }
      }
    },
    apartmentDetails: {
      selector: '.apartment-details-step',
      elements: {
        city: {
          selector: 'select[name="apartment.building.city.id"]'
        },
        neighbourhood: {
          selector: 'select[name="apartment.building.neighborhood.id"]'
        },
        street: {
          selector: 'input[name="apartment.building.street_name"]'
        },
        houseNumber: {
          selector: 'input[name="apartment.building.house_number"]'
        },
        apartmentNumber: {
          selector: 'input[name="apartment.apt_number"]'
        },
        buildingEntrance: {
          selector: 'input[name="apartment.building.entrance"]'
        },
        apartmentFloor: {
          selector: 'input[name="apartment.floor"]'
        },
        buildingFloors: {
          selector: 'input[name="apartment.building.floors"]'
        },
        apartmentSize: {
          selector: 'input[name="apartment.size"]'
        },
        apartmentRooms: {
          selector: 'select[name="apartment.rooms"]'
        },
        description: {
          selector: 'textarea[name="description"]'
        },
        parking: {
          selector: 'input[name="apartment.parking"]'
        },
        elevator: {
          selector: 'input[name="apartment.building.elevator"]'
        },
        sunHeaterBoiler: {
          selector: 'input[name="apartment.sun_heated_boiler"]'
        },
        pets: {
          selector: 'input[name="apartment.pets"]'
        },
        airCondition: {
          selector: 'input[name="apartment.air_conditioning"]'
        },
        balcony: {
          selector: 'input[name="apartment.balcony"]'
        },
        securityBars: {
          selector: 'input[name="apartment.security_bars"]'
        },
        parquetFloor: {
          selector: 'input[name="apartment.parquet_floor"]'
        },
        entranceDate: {
          selector: 'input[name="apartment.entrance-date"] + input'
        },
        entranceDateCalendar: {
          selector: '#calendar'
        },
        monthlyRent: {
          selector: 'input[name="monthly_rent"]'
        },
        propertyTax: {
          selector: 'input[name="property_tax"]'
        },
        boardFee: {
          selector: 'input[name="board_fee"]'
        },
        previousStep: {
          selector: 'i.apartment-details-previous-step'
        },
        nextStep: {
          selector: 'i.apartment-details-next-step'
        }
      }
    },
    openHouseEvent: {
      selector: '.open-house-event-step',
      elements: {
        eventDate: {
          selector: 'input[name="ohe-date"] + input'
        },
        eventDateCalendar: {
          selector: '#calendar'
        },
        eventStartTime: {
          selector: 'select[name="start_time"]'
        },
        eventEndTime: {
          selector: 'select[name="end_time"]'
        },
        firstName: {
          selector: 'input[name="user.firstname"]'
        },
        lastName: {
          selector: 'input[name="user.lastname"]'
        },
        email: {
          selector: 'input[name="user.email"]'
        },
        phone: {
          selector: 'input[name="user.phone"]'
        },
        submit: {
          selector: 'button.step-btn'
        },
        previousStep: {
          selector: 'i.open-house-event-previous-step'
        }
      }
    },
    successModal: {
      selector: '.modal-dialog',
      elements: {
        successTitle: {
          selector: '.modal-header > h4'
        },
        listingId: {
          selector: '.modal-body .text-center'
        }
      }
    }
  },
  commands: [{
    navigateToApartmentPictureSection: function () {
      this
        .navigate()
        .waitForElementVisible('body');      
      return this;
    },
    navigateToApartmentDetailsSection: function () {
      this
        .navigateToApartmentPictureSection()
        .goFromApartmentPicturesToApartmentDetails();
      return this;
    },
    navigateToOpenHouseEventSection: function () {
      this
        .navigateToApartmentDetailsSection()
        .fillApartmentDetailsAllFields()
        .goFromApartmentDetailsToOpenHouseEvent();
      return this;
    },
    goFromApartmentPicturesToApartmentDetails: function () {
      this.section.apartmentPictures.click('@nextStep');
      return this;
    },
    goFromApartmentDetailsToApartmentPictures: function () {
      this.section.apartmentDetails.click('@previousStep');
      return this;
    },
    goFromApartmentDetailsToOpenHouseEvent: function () {
      this.section.apartmentDetails.click('@nextStep');      
      return this;
    },
    goFromOpenHouseEventToApartmentDetails: function () {
      this.section.openHouseEvent.click('@previousStep');      
      return this;
    },
    fillApartmentDetailsAllFields: function () {
      this.section.apartmentDetails
        .setValue('@street', 'כצנלסון')
        .setValue('@houseNumber', common.getMediumRandomNumber())
        .setValue('@apartmentNumber', common.getMediumRandomNumber())
        .setValue('@buildingEntrance', 'א')
        .setValue('@apartmentFloor', common.getSmallRandomNumber())
        .setValue('@buildingFloors', common.getSmallRandomNumber())
        .setValue('@apartmentSize', common.getMediumRandomNumber())
        .setValue('@apartmentRooms', common.getSmallRandomNumber())
        .setValue('@description', 'דירה יפה לבדיקה')
        .setValue('@city', 'הרצליה')
        .setValue('@neighbourhood', 'גורדון')
        .click('@parking')
        .click('@elevator')
        .click('@sunHeaterBoiler')
        .click('@pets')
        .click('@airCondition')
        .click('@balcony')
        .click('@securityBars')
        .click('@parquetFloor')
        .setValue('@entranceDate', '')
        .setValue('@monthlyRent', common.getBigRandomNumber())
        .setValue('@propertyTax', common.getBigRandomNumber())
        .setValue('@boardFee', common.getBigRandomNumber());
      return this;
    },
    fillOpenHouseEventDetailsAllFields: function () {
      this.section.openHouseEvent
        .setValue('@eventDate', '')
        .setValue('@eventStartTime', '08:00')
        .setValue('@eventEndTime', '09:00');
      return this;
    },
    clearUserDetailsFields: function () {      
      this.section.openHouseEvent        
        .clearValue('@firstName')
        .clearValue('@lastName')
        .clearValue('@email')
        .clearValue('@phone');
      return this;
    },
    fillUserDetailsFields: function () {
      this.section.openHouseEvent
        .setValue('@firstName', 'Test')
        .setValue('@lastName', 'Tester')
        .setValue('@email', 'teser@test.com')
        .setValue('@phone', '9999999');
      return this;
    },
    submitApartment: function () {
      this.section.openHouseEvent.click('@submit');
      return this;
    },
    fillAndSubmitApartment: function () {
      this
        // TODO: Add upload image functionality.
        .navigateToOpenHouseEventSection()
        .fillOpenHouseEventDetailsAllFields()
        .submitApartment();
      return this;
    }    
  }]
};
