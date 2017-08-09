'use strict';
import { shallow } from 'enzyme';
import React from 'react';
import { FRC } from '~/components/FormWrapper/FormWrapper';
import MySettingsFields from './MySettingsFields';
import faker from 'faker';

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
    expect(checkboxes.length).toEqual(3);
    checkboxes.forEach(checkbox => {
      expect(checkbox.prop('value')).toEqual(true);
    });
  });

  it('should set checkboxes values when profile settings is empty', () => {
    props.profile.settings = {};

    mySettingsFields();

    const checkboxes = comp.find(FRC.Checkbox);
    checkboxes.forEach(checkbox => {
      expect(checkbox.prop('value')).toEqual(true);
    });
  });

  it('should set checkboxes values according to the given profile settings', () => {
    const allowPublisherMessagesMock = faker.random.boolean();
    const receiveLikeNotificationsMock = faker.random.boolean();
    const receiveNewsletterMock = faker.random.boolean();
    const expectedCheckboxValues = [allowPublisherMessagesMock, receiveLikeNotificationsMock, receiveNewsletterMock];
    props.profile.settings = {
      allow_publisher_messages: allowPublisherMessagesMock,
      receive_like_related_notifications: receiveLikeNotificationsMock,
      receive_newsletter: receiveNewsletterMock
    };

    mySettingsFields();

    const checkboxes = comp.find(FRC.Checkbox);
    checkboxes.forEach((checkbox, i) => {
      expect(checkbox.prop('value')).toEqual(expectedCheckboxValues[i]);
    });
  });
});
