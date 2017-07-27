import React from 'react';
import { shallow, mount } from 'enzyme';

import ListingDetailsForm from './ListingDetailsForm';

describe('Listing Details Form', () => {
  let appStoreMock, appProvidersMock, editedListingStoreMock, dataMock;

  beforeEach(() => {
    editedListingStoreMock = {
      updateFormValues: jest.fn(),
      formValues: {},
      roomOptions: []
    };
    appStoreMock = {
      neighborhoodStore: {
        neighborhoodsByCityId: {
          get: jest.fn()
        }
      }
    };
    appProvidersMock = {
      neighborhoodProvider : {
        loadNeighborhoodByCityId: jest.fn()
      }
    };
    dataMock = {
      cities: [ { id: 1, city_name: 'Gotham' } ]
    };
  });

  const listingDetailsForm = () => shallow(<ListingDetailsForm.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} editedListingStore={editedListingStoreMock} data={dataMock} />);

  it('should match snapshot in empty state', () => {
    editedListingStoreMock.formValues.lease_start = (new Date(0)).toISOString(); // make this static for constant snapshot
    const wrapper = mount(<ListingDetailsForm.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} editedListingStore={editedListingStoreMock}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call provider to load cities and display loading option', () => {
    dataMock.cities = [];
    const wrapper = listingDetailsForm();
    const cityOptions = wrapper.find({ label: 'עיר' }).props().options;

    expect(cityOptions).toHaveLength(1);
    expect(cityOptions).toContainEqual({ value: 0, label: 'טוען...' });
  });

  it('should get city options from city store', () => {
    const city = dataMock.cities[0];

    const wrapper = listingDetailsForm();
    const cityOptions = wrapper.find({ label: 'עיר' }).props().options;

    expect(cityOptions).toHaveLength(1);
    expect(cityOptions).toContainEqual({ value: city.id, label: city.city_name });
  });

  it('should display selected city according to value in the store', () => {
    const expectedValue = 2;
    dataMock.cities = [
      { id: 1, city_name: 'dont choose me' },
      { id: 2, city_name: 'choose me !' }
    ];
    editedListingStoreMock.formValues['apartment.building.city.id'] = expectedValue;

    const wrapper = listingDetailsForm();
    expect(wrapper.find({ label: 'עיר' }).props().value).toBe(expectedValue);
  });

  it('should load neighborhood options from store according to city id', () => {
    const cityId = 1;
    const neighborhood = { id: 1, neighborhood_name: 'The Hope' };
    editedListingStoreMock.formValues['apartment.building.city.id'] = cityId;
    appStoreMock.neighborhoodStore.neighborhoodsByCityId.get.mockReturnValue([ neighborhood ]);

    const wrapper = listingDetailsForm();

    expect(appStoreMock.neighborhoodStore.neighborhoodsByCityId.get).toHaveBeenCalledWith(cityId);
    expect(wrapper.find({ label: 'שכונה' }).props().options).toContainEqual({ value: neighborhood.id, label: neighborhood.neighborhood_name });
  });

  it('should call provider to load neighborhoods and display loading', () => {
    const cityId = 1;
    editedListingStoreMock.formValues['apartment.building.city.id'] = cityId;
    appStoreMock.neighborhoodStore.neighborhoodsByCityId.get.mockReturnValue(null);

    const wrapper = listingDetailsForm();

    expect(appProvidersMock.neighborhoodProvider.loadNeighborhoodByCityId).toHaveBeenCalledWith(cityId);
    expect(wrapper.find({ label: 'שכונה' }).props().options).toContainEqual({ value: 0, label: 'טוען...' });
  });

  // TODO : add many many tests - all the interaction with formsy should be tested (loading values from store, validation) ...

});
