'use strict';
import { shallow } from 'enzyme';
import React from 'react';
import { FRC } from '~/components/FormWrapper/FormWrapper';
import MySettingsFields from './MySettingsFields';

describe('MySettingsFields', () => {
  let props;
  let comp;

  const mySettingsFields = () => {
    if (!comp) {
      comp = shallow(
        <MySettingsFields {...props} />
      );
    }
    return comp;
  };

  beforeEach(() => {
    props = {
      profile: {}
    };
    comp = undefined;
  });

  it('should initialize correctly', () => {
    mySettingsFields();

    expect(comp.find(FRC.Input).prop('value')).toEqual('settings');

    const checkboxes = comp.find(FRC.Checkbox);
    expect(checkboxes.length).toEqual(2);
    checkboxes.forEach(checkbox => {
      expect(checkbox.prop('value')).toEqual(true);
    });
  });

  it('should set checkboxes values according to the given profile settings', () => {
    const receiveLikeNotificationsMock = jest.fn();
    const receiveNewsletterMock = jest.fn();
    const expectedCheckboxValues = [receiveLikeNotificationsMock, receiveNewsletterMock];
    props.profile.settings = {
      receive_like_related_notifications: receiveLikeNotificationsMock,
      receive_newsletter: receiveNewsletterMock
    }

    mySettingsFields();

    const checkboxes = comp.find(FRC.Checkbox);
    checkboxes.forEach((checkbox, i) => {
      expect(checkbox.prop('value')).toEqual(expectedCheckboxValues[i]);
    });
  });
});
