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
        receive_newsletter: true,
        receive_notifications: true
      }
    };

    Object.assign(this.state, this.state.settings);
  }

  handleChange(name, val) {
    this.setState({[name.substr(5)]: val});
  }

  render() {
    const settings = this.state.settings;

    return (
      <div>
        <Row className="my-settings-input">
          <FRC.Input value="settings" name="section" type="hidden" />
          <Toggle checked={this.state.receive_notifications} icons={false} readOnly></Toggle>
          <FRC.Checkbox
            name="data.receive_notifications"
            value={settings.receive_notifications}
            onChange={this.handleChange}
            label="אפשר עדכונים על מועדי ביקור חדשים או פרסום מחדש של דירות שאהבתי" />
        </Row>
        <Row className="my-settings-input">
          <Toggle checked={this.state.receive_newsletter} icons={false} readOnly></Toggle>
          <FRC.Checkbox
            name="data.receive_newsletter"
            value={settings.receive_newsletter}
            onChange={this.handleChange}
            label="שלחו לי עדכונים בנוגע לשירותים חדשים" />
        </Row>
      </div>
    );
  }
}

MySettingsFields.propTypes = {
  profile: React.PropTypes.object.isRequired
};

export default MySettingsFields;
