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
  }

  handleChange(e) {
    this[e.target.id].setValue(e.target.checked);
  }

  render() {
    const settings = Object.assign({
      receive_newsletter: true,
      receive_like_related_notifications: true
    }, this.props.profile.settings || {});

    return (
      <div>
        <Row className="my-settings-input">
          <FRC.Input value="settings" name="section" type="hidden" />
          <Toggle defaultChecked={settings.receive_like_related_notifications}
                  onChange={this.handleChange}
                  id="receive_like_related_notifications"
                  icons={false}></Toggle>
          <FRC.Checkbox
            ref={(el) => { this.receive_like_related_notifications = el; }}
            name="data.receive_like_related_notifications"
            value={settings.receive_like_related_notifications}
            label="אפשר עדכונים על מועדי ביקור חדשים או פרסום מחדש של דירות שאהבתי" />
        </Row>
        <Row className="my-settings-input">
          <Toggle defaultChecked={settings.receive_newsletter}
                  onChange={this.handleChange}
                  id="receive_newsletter"
                  icons={false}></Toggle>
          <FRC.Checkbox
            ref={(el) => { this.receive_newsletter = el; }}
            name="data.receive_newsletter"
            value={settings.receive_newsletter}
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
