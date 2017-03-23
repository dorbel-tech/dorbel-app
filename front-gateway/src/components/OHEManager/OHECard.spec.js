'use strict';
import { shallow } from 'enzyme';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import OHECard from './OHECard';

describe('OHECard', () => {
  let props;
  let shallowOHECard;

  const oheCard = () => {
    if (!shallowOHECard) {
      shallowOHECard = shallow(
        <OHECard {...props} />
      );
    }
    return shallowOHECard;
  };

  beforeEach(() => {
    props = {
      ohe: {}
    };
    shallowOHECard = undefined;
  });

  it('should render correctly given default values', () => {
    const result = oheCard();
    const registrationsTextWrapper = result.find('.ohe-card-row-reg-num-col > span.ohe-no-visits');
    const registrations = result.find('.ohe-card-user-table-row');

    expect(registrationsTextWrapper.text()).toEqual('נרשמים לביקור (0)');
    expect(registrations.length).toEqual(0);
    //expect(shallowOHECard).toMatchSnapshot();
  });

  it('should render with an ohe menu', () => {
    props.editable = true;
    props.ohe.id = 'fakeId';

    const result = oheCard();
    const dropdownWrapper = result.find(Dropdown);

    expect(dropdownWrapper.props().id).toEqual('fakeId_ohe_action');
    expect(shallowOHECard).toMatchSnapshot();
  });

  it('should render with a single registration', () => {
    const fakeUser = {picture: 'pic', first_name: 'fn', last_name: 'ln'};
    props.ohe.registrations = [
      {id: 'fakeId1', is_active: true, user: fakeUser}
    ];

    const result = oheCard();
    const registrationsTextWrapper = result.find('.ohe-card-row-reg-num-col > span');
    const registrations = result.find('.ohe-card-user-table-row');

    expect(registrationsTextWrapper.text()).toEqual('נרשמים לביקור (1)');
    expect(registrations.length).toEqual(1);
    expect(shallowOHECard).toMatchSnapshot();
  });

  it('should render with multiple registrations', () => {
    const fakeUser1 = {picture: 'pic1', first_name: 'fn1', last_name: 'ln1'};
    const fakeUser2 = {picture: 'pic2', first_name: 'fn2', last_name: 'ln2', phone: '123', facebook_link: 'fbLink2'};
    const fakeUser3 = {picture: 'pic3', first_name: 'fn3', last_name: 'ln3', phone: '456', facebook_link: 'fbLink3'};
    props.ohe.registrations = [
      {id: 'fakeId1', is_active: true, user: fakeUser1},
      {id: 'fakeId2', is_active: true, user: fakeUser2},
      {id: 'fakeId3', is_active: true, user: fakeUser3}
    ];

    const result = oheCard();
    const registrationsTextWrapper = result.find('.ohe-card-row-reg-num-col > span');
    const registrations = result.find('.ohe-card-user-table-row');

    expect(registrationsTextWrapper.text()).toEqual('נרשמים לביקור (3)');
    expect(registrations.length).toEqual(3);
    expect(shallowOHECard).toMatchSnapshot();
  });
});
