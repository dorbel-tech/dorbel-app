'use strict';
import React from 'react';
import { shallow } from 'enzyme';

import SavedFilters from './SavedFilters';

describe('Saved Filters', () => {
  let props;

  beforeEach(() => {
    props = {
      appStore: {
        searchStore: {
          filters: {
            values: jest.fn()
          }
        },
        cityStore: {
          cities: [ { id: 1, city_name: 'TA'} ]
        }
      },
      appProviders: {},
      onFilterChange: jest.fn()
    };
  });

  const savedFilters = () => shallow(<SavedFilters.wrappedComponent {...props} />);

  it('should render nothing when there are no saved filters', () => {
    props.appStore.searchStore.filters.values.mockReturnValue([]);
    const wrapper = savedFilters();
    expect(wrapper.node).toBeNull();
  });

  it('should render a saved filter', () => {
    const mockFilter = {
      id: 1,
      city: 1,
      minRooms: 7,
      mre: 6000
    };
    props.appStore.searchStore.filters.values.mockReturnValue([mockFilter]);
    
    const wrapper = savedFilters();    
    const renderedFilters = wrapper.find('Checkbox');
    const filterLabel = renderedFilters.first().find('span').text();

    expect(renderedFilters).toHaveLength(1);
    expect(filterLabel).toContain(props.appStore.cityStore.cities[0].city_name);
    expect(filterLabel).toContain('7+ חד');
    expect(filterLabel).toContain('עד 6000 ש"ח');
  });

});