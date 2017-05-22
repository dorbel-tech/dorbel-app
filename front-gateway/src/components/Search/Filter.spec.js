'use strict';
import { mount } from 'enzyme';
import React from 'react';
import { MenuItem } from 'react-bootstrap';
import Filter from './Filter';

describe('Filter', () => {
  let props;
  let mountedFilter;

  const filter = () => {
    if (!mountedFilter) {
      mountedFilter = mount(
        <Filter {...props} />
      );
    }
    return mountedFilter;
  };

  beforeEach(() => {
    spyOn(history, 'pushState');

    props = {
      appStore: {
        authStore: {},
        cityStore: {
          cities: []
        }
      },
      appProviders: {
        cityProvider: {loadCities: jest.fn()},
        searchProvider: {
          search: jest.fn().mockReturnValue(Promise.resolve([]))
        },
        oheProvider: {
          loadListingEvents: jest.fn()
        }
      }
    };
    mountedFilter = undefined;
  });

  it('should initialize correctly', () => {
    const expectedFilterObj = {city: '*'};

    const cityDropdownButton = filter().find('#cityDropdown');

    expect(props.appProviders.cityProvider.loadCities).toHaveBeenCalledWith();
    expect(history.pushState).toHaveBeenCalledWith(expectedFilterObj, '', jasmine.any(String));
    expect(history.pushState.calls.count()).toEqual(1);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(props.appProviders.searchProvider.search.mock.calls.length).toEqual(1);
    expect(cityDropdownButton.text()).toEqual('עיר: כל הערים ');

    expect(mountedFilter).toMatchSnapshot();
  });

  it('should parse city from location', () => {
    const expectedFilterObj = {city: 2};
    props.appStore.cityStore.cities = [{id: 2, city_name: 'test2'}];
    spyOn(JSON, 'parse').and.returnValue(expectedFilterObj);

    const cityDropdownButton = filter().find('#cityDropdown');

    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(cityDropdownButton.text()).toEqual('עיר: test2 ');
  });

  it('should render cities correctly', () => {
    props.appStore.cityStore.cities = [{id: 2, city_name: 'test2'}];

    const cityDropdownMenuItems = filter().find('.filter-city-wrapper').find(MenuItem);

    expect(cityDropdownMenuItems.length).toEqual(2);
    expect(cityDropdownMenuItems.at(0).props().eventKey).toEqual('*');
    expect(cityDropdownMenuItems.at(0).text()).toEqual('כל הערים');
    expect(cityDropdownMenuItems.at(1).props().eventKey).toEqual(2);
    expect(cityDropdownMenuItems.at(1).text()).toEqual('test2');
  });

  const checkboxTests = (name, results) => {
    results = results || [[{ city: '*', [name]: true }], [{ city: 1 }]];

    describe(name + ' checkbox', () => {
      it('should render the ' + name + ' checkbox according to the parsed location', () => {
        const expectedFilterObj = {[name]: true};
        spyOn(JSON, 'parse').and.returnValue(expectedFilterObj);

        const check = filter().find('[name="' + name + '"]');

        expect(check.props().checked).toEqual(true);
      });

      it('should call search on ' + name + ' checkbox change', () => {
        const wrapper = filter();
        const trigger = wrapper.find('.filter-trigger-container').filterWhere(n => n.text() === 'פילטרים נוספים');
        trigger.simulate('click');
        const check = wrapper.find('[name="' + name + '"]');

        check.simulate('change', {target: {name: name, checked: true}});
        expect(props.appProviders.searchProvider.search.mock.calls[1]).toEqual(results[0]);

        check.simulate('change', {target: {name: name, checked: false}});
        expect(props.appProviders.searchProvider.search.mock.calls[2]).toEqual(results[1]);
        expect(props.appProviders.searchProvider.search.mock.calls.length).toEqual(3);
      });
    });
  };

//  checkboxTests('roommate', [[{city: '*', room: 0}], [{city: '*', room: 0}]]);
//  checkboxTests('room', [[{city: '*', room: 0}], [{city: '*', room: 0}]]);
//  checkboxTests('empty', [[{city: '*', room: 1}], [{city: '*', room: 1}]]);
//
//  checkboxTests('park');
//  checkboxTests('balc');
//  checkboxTests('ac');
//  checkboxTests('ele');
//  checkboxTests('pet');
//  checkboxTests('sb');
});
