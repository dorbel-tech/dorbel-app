import React from 'react';
import { shallow, mount } from 'enzyme';
import { flushPromises } from '~/providers/utils';

import ListingDetailsForm from './ListingDetailsForm';

describe('Listing Details Form', () => {
  let props;

  beforeEach(() => {
    props = {
      editedListingStore: {
        updateFormValues: jest.fn(),
        formValues: {},
        roomOptions: []
      },
      data: {
        cities: [ { id: 1, city_name: 'Gotham' } ]
      },
      client: {
        query: jest.fn().mockReturnValue(Promise.resolve())
      }
    };
  });

  const form = () => <ListingDetailsForm.WrappedComponent {...props} />;

  const listingDetailsForm = () => shallow(form());

  it('should match snapshot in empty state', () => {
    props.editedListingStore.formValues.lease_start = (new Date(0)).toISOString(); // make this static for constant snapshot
    const wrapper = mount(form());
    expect(wrapper).toMatchSnapshot();
  });

  it('should cities as loading until they are loaded', () => {
    props.data.loading = true;
    const wrapper = listingDetailsForm();
    const cityOptions = wrapper.find({ label: 'עיר' }).props().options;
    expect(cityOptions).toHaveLength(1);
    expect(cityOptions).toContainEqual({ value: 0, label: 'טוען...' });
  });

  it('should get city options from city store', () => {
    const city = props.data.cities[0];

    const wrapper = listingDetailsForm();
    const cityOptions = wrapper.find({ label: 'עיר' }).props().options;

    expect(cityOptions).toHaveLength(1);
    expect(cityOptions).toContainEqual({ value: city.id, label: city.city_name });
  });

  it('should display selected city according to value in the store', () => {
    const expectedValue = 2;
    props.data.cities = [
      { id: 1, city_name: 'dont choose me' },
      { id: 2, city_name: 'choose me !' }
    ];
    props.editedListingStore.formValues['apartment.building.city.id'] = expectedValue;

    const wrapper = listingDetailsForm();
    expect(wrapper.find({ label: 'עיר' }).props().value).toBe(expectedValue);
  });

  it('should call GQL client to load neighborhoods and display loading', () => {
    const cityId = 1;
    props.editedListingStore.formValues['apartment.building.city.id'] = cityId;
    props.client.query.mockReturnValue(Promise.resolve());

    const wrapper = listingDetailsForm();

    expect(props.client.query.mock.calls[0][0].variables.city_id).toBe(cityId);
    expect(wrapper.find({ label: 'שכונה' }).props().options).toContainEqual({ value: 0, label: 'טוען...' });
  });

  it('should load neighborhood options from GQL client response', () => {
    const neighborhood = { id: 1, neighborhood_name: 'The Hope' };
    props.editedListingStore.formValues['apartment.building.city.id'] = 2;
    props.client.query.mockReturnValue(Promise.resolve({ data: { neighborhoods: [ neighborhood ] } }));

    const wrapper = listingDetailsForm();

    return flushPromises()
    .then(() => {
      expect(wrapper.find({ label: 'שכונה' }).props().options).toContainEqual({ value: neighborhood.id, label: neighborhood.neighborhood_name });
    });
  });
});
