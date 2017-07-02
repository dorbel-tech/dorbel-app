import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Row } from 'react-bootstrap';
import Toggle from 'react-toggle';
import { FRC } from '~/components/FormWrapper/FormWrapper';

import './MySettingsFields.scss';

class MySettingsFields extends Component {
  static showPicture = false;

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      settings: props.profile.settings || {
        receive_newsletter: true
      }
    }

    Object.assign(this.state, this.state.settings);
  }

  handleChange(name, val) {
    this.state.receive_newsletter = val;
  }

  render() {
    const settings = this.state.settings;

    return (
      <Row className="my-settings-input">
        <FRC.Input value="settings" name="section" type="hidden" />
        <div>
          <Toggle ref="data.receive_newsletter" checked={this.state.receive_newsletter} readOnly></Toggle>
          <FRC.Checkbox
            name="data.receive_newsletter"
            value={settings.receive_newsletter}
            onChange={this.handleChange}
            label="שלחו לי עדכונים בנוגע לשירותים חדשים" />
        </div>
      </Row>
    );
  }
}

MySettingsFields.propTypes = {
  profile: React.PropTypes.object.isRequired
};

export default MySettingsFields;
