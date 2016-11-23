'use strict';
import React from 'react';
import FRC from 'formsy-react-components';
import Formsy from 'formsy-react';
import _ from 'lodash';

const FormWrapper = React.createClass({
  mixins: [FRC.ParentContextMixin],
  propTypes: {
    children: React.PropTypes.node
  },
  render() {
    const props = _.omit(this.props, ['layout', 'validatePristine']);

    return (
      <Formsy.Form
        className={this.getLayoutClassName()}
        {...props}
        ref="formsy"
      >
        {this.props.children}
      </Formsy.Form>
    );
  }
});

module.exports = {
  FormWrapper
};
