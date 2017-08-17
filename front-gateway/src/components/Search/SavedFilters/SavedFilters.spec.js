'use strict';
import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';

import SavedFilters from './SavedFilters';

describe('Saved Filters', () => {
  let props;

  beforeEach(() => {
    props = {
      appStore: {
        searchStore: {},
        cityStore: {
          cities: [ { id: 1, city_name: 'TA'} ]
        }
      },
      appProviders: {
        searchProvider: {
          saveFilter: jest.fn()
        }
      },
      onFilterChange: jest.fn(),
      data: {
        loading: false
      }
    };
  });

  const savedFilters = () => shallow(<SavedFilters.wrappedComponent {...props} />);

  const mockFilter = (filter, isActive) => {
    filter.id = faker.random.number({ min: 1, max:1000 });
    props.data = {
      filters: [filter],
      loading: false
    };
    if (isActive) {
      props.appStore.searchStore.activeFilterId = filter.id;
    }
    return filter;
  };

  it('should render nothing when there are no saved filters', () => {
    props.data.filters = [];
    const wrapper = savedFilters();
    expect(wrapper.node).toBeNull();
  });

  it('should render nothing while loading saved filters', () => {
    props.data = {
      loading: true, filters: [ 123 ]
    };
    const wrapper = savedFilters();
    expect(wrapper.node).toBeNull();
  });

  it('should render a saved filter', () => {
    mockFilter({
      city: 1,
      minRooms: 7,
      mre: 6000
    });

    const wrapper = savedFilters();
    const renderedFilters = wrapper.find('Checkbox');
    const filterLabel = renderedFilters.first().find('span').text();

    expect(renderedFilters).toHaveLength(1);
    expect(filterLabel).toContain(props.appStore.cityStore.cities[0].city_name);
    expect(filterLabel).toContain('7+\xa0חד');
    expect(filterLabel).toMatch(/עד\s6000\sש"ח/);
  });

  it('should select a new active filter', () => {
    const mockedFilter = mockFilter({});

    const wrapper = savedFilters();
    wrapper.find('Checkbox').first().simulate('click');

    expect(props.appStore.searchStore.activeFilterId).toBe(mockedFilter.id);
  });

  it('should fire onFilterChange for selected filter without extra params', () => {
    mockFilter({ dorbel_user_id: 3, email_notification: true, city: 5 });

    const wrapper = savedFilters();
    wrapper.find('Checkbox').first().simulate('click');

    expect(props.onFilterChange).toHaveBeenCalledWith({ city: 5 });
  });

  it('should fire onFilterChange with empty filter when un-selecting filter', () => {
    mockFilter({ city: 7 }, true);

    const wrapper = savedFilters();
    wrapper.find('Checkbox').first().simulate('click');

    expect(props.onFilterChange).toHaveBeenCalledWith({});
  });

  it('should render email checkbox when filter is selected and email_notification is true', () => {
    const mockedFilter = mockFilter({ email_notification: true }, true);

    const wrapper = savedFilters();
    const emailCheckbox = wrapper.find('.saved-filter-email-notification-checkbox');

    expect(emailCheckbox).toHaveLength(1);
    expect(emailCheckbox.prop('checked')).toBe(true);
  });

  it('should not render email checkbox when no filter is selected', () => {
    mockFilter({});
    const wrapper = savedFilters();
    expect(wrapper.find('.saved-filter-email-notification-checkbox')).toHaveLength(0);
  });

  it('should call provider to save email-notification when it is clicked', () => {
    const mockedFilter = mockFilter({ email_notification: true }, true);

    const wrapper = savedFilters();
    const emailCheckbox = wrapper.find('.saved-filter-email-notification-checkbox');

    emailCheckbox.simulate('change');
    mockedFilter.email_notification = !mockedFilter.email_notification;
    expect(props.appProviders.searchProvider.saveFilter).toHaveBeenCalledWith(mockedFilter);
  });

});
