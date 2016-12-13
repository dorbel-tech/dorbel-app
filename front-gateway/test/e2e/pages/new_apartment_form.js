

module.exports = {
  url: 'http://localhost:3001/apartments/new_form',
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
          selector: 'select[name="apartment.building.city.city_name"]'
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
        roomates: {
          selector: 'input[name="roomates"]'
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
          selector: 'select[name="open_house_event_start_time"]'
        },
        eventEndTime: {
          selector: 'select[name="open_house_event_end_time"]'
        },
        comments: {
          selector: 'textarea[name="open_house_event_comments"]'
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
        phoneNumber: {
          selector: 'input[name="user.phone"]'
        },
        submit: {
          selector: 'button.btn-submit'
        },
        previousStep: {
          selector: 'i.open-house-event-previous-step'
        }
      }
    }
  },
  elements: {
    addNewApartmentLink: {
      selector: 'a.add-apartment-button'
    }
  },
  commands: [{
    navigateToApartmentPictureSection: function () {
      this
        .navigate()
        .waitForElementVisible('body', 5000);
      this.expect.section('@apartmentPictures').to.be.visible;
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
      this.expect.section('@apartmentDetails').to.be.visible;
      return this;
    },
    goFromApartmentDetailsApartmentPictures: function () {
      this.section.apartmentDetails.click('@previousStep');
      this.expect.section('@apartmentPictures').to.be.visible;
      return this;
    },
    goFromApartmentDetailsToOpenHouseEvent: function () {
      this.section.apartmentDetails.click('@nextStep');
      this.expect.section('@openHouseEvent').to.be.visible;
      return this;
    },
    goFromApartmentDetailsToOpenHouseEventAndFail: function () {
      this.section.apartmentDetails.click('@nextStep');
      this.expect.section('@openHouseEvent').to.not.be.present;
      return this;
    },
    goFromOpenHouseEventToApartmentDetails: function () {
      this.section.openHouseEvent.click('@previousStep');
      this.expect.section('@apartmentDetails').to.be.visible;
      return this;
    },
    fillApartmentDetailsAllFields: function () {
      this.section.apartmentDetails
        .setValue('@city', 'הרצליה')
        .setValue('@street', 'רוטשילד')
        .setValue('@houseNumber', '129')
        .setValue('@apartmentNumber', '1')
        .setValue('@buildingEntrance', 'א')
        .setValue('@apartmentFloor', '1')
        .setValue('@buildingFloors', '3')
        .setValue('@apartmentSize', '50')
        .setValue('@apartmentRooms', '2')
        .setValue('@roomates', '2')
        .setValue('@description', 'דויד המלך עובד כאן')
        .click('@parking')
        .click('@elevator')
        .click('@sunHeaterBoiler')
        .click('@pets')
        .click('@airCondition')
        .click('@balcony')
        .click('@securityBars')
        .click('@parquetFloor')
        .setValue('@entranceDate', '')
        .setValue('@monthlyRent', '1000')
        .setValue('@propertyTax', '1000')
        .setValue('@boardFee', '1000');

      this.section.apartmentDetails.assert.visible('@entranceDateCalendar');
      return this;
    },
    fillApartmentDetailsRequiredFields: function () {
      this.section.apartmentDetails
        .setValue('@city', 'הרצליה')
        .setValue('@street', 'רוטשילד')
        .setValue('@houseNumber', '129')
        .setValue('@apartmentNumber', '1')
        .setValue('@apartmentFloor', '1')
        .setValue('@apartmentSize', '50')
        .setValue('@apartmentRooms', '2')
        .setValue('@monthlyRent', '1000');
      return this;
    },
    fillOpenHouseEventDetailsAllFields: function () {
      this.section.openHouseEvent
        .setValue('@eventDate', '')
        .setValue('@eventStartTime', '08:00')
        .setValue('@eventEndTime', '09:00')
        .setValue('@comments', 'דויד גם מגיע');

      this.section.openHouseEvent.assert.visible('@eventDateCalendar');
      return this;
    },
    fillUserDetailsFields: function () {
      this.section.openHouseEvent
        .setValue('@firstName', 'דויד')
        .setValue('@lastName', 'וירצר')
        .setValue('@email', 'poison77@gmail.com')
        .setValue('@phoneNumber', '9999999');

      this.section.openHouseEvent.assert.visible('@eventDateCalendar');
      return this;
    },
    submitNewApartmentForm: function () {
      this.section.openHouseEvent
        .click('@submit');
      return this;
    }
  }]
};


