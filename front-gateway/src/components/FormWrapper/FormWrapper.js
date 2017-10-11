'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import FRC from 'formsy-react-components';
import Formsy, { HOC } from 'formsy-react';
import _ from 'lodash';

const FormWrapper = createClass({
  mixins: [FRC.ParentContextMixin],
  propTypes: {
    children: PropTypes.node
  },
  render() {
    const props = _.omit(this.props, ['layout', 'validatePristine']);

    return (
      <Formsy.Form
        className={this.getLayoutClassName()}
        {...props}
        ref={el => this.formsy = el}
      >
        {this.props.children}
      </Formsy.Form>
    );
  }
});

module.exports = {
  Wrapper: FormWrapper,
  Formsy,
  FRC,
  HOC
};
