'use strict';
import { shallow } from 'enzyme';
import React from 'react';
import { MenuItem } from 'react-bootstrap';
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

  it('should initialize correctly', () => {
    const result = oheCard().find('.ohe-card-row-reg-num-col span.ohe-no-visits');

    expect(result.text()).toEqual('נרשמים לביקור (0)');
    //expect(shallowOHECard).toMatchSnapshot();
  });
});
