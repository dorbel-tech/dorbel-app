'use strict';
import { shallow } from 'enzyme';
import React from 'react';
import Toggle from 'react-toggle';
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
      section: {}
    };
    comp = undefined;
  });

  it('should initialize correctly', () => {
    mySettingsFields();

    const checkboxes = comp.find(Toggle);
    expect(checkboxes.length).toEqual(3);
    checkboxes.forEach(checkbox => {
      expect(checkbox.prop('defaultChecked')).toEqual(true);
    });
  });

  it('should set checkboxes values when section settings is empty', () => {
    props.section = {};

    mySettingsFields();

    const checkboxes = comp.find(Toggle);
    checkboxes.forEach(checkbox => {
      expect(checkbox.prop('defaultChecked')).toEqual(true);
    });
  });

  it('should set checkboxes values according to the given section settings', () => {
    const allowPublisherMessagesMock = faker.random.boolean();
    const receiveLikeNotificationsMock = faker.random.boolean();
    const receiveNewsletterMock = faker.random.boolean();
    const expectedCheckboxValues = [allowPublisherMessagesMock, receiveLikeNotificationsMock, receiveNewsletterMock];
    props.section = {
      allow_publisher_messages: allowPublisherMessagesMock,
      receive_like_related_notifications: receiveLikeNotificationsMock,
      receive_newsletter: receiveNewsletterMock
    };

    mySettingsFields();

    const checkboxes = comp.find(Toggle);
    checkboxes.forEach((checkbox, i) => {
      expect(checkbox.prop('defaultChecked')).toEqual(expectedCheckboxValues[i]);
    });
  });
});
