import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import Toggle from 'react-toggle';

import './MySettingsFields.scss';

class MySettingsFields extends Component {
  static showPicture = false;

  render() {
    const settings = Object.assign({
      allow_publisher_messages: true,
      receive_like_related_notifications: true,
      receive_newsletter: true
    }, this.props.section || {});

    return (
      <div>
        <Row className="my-settings-input">
          אפשר למתעניינים לפנות אלי בהודעות דרך מודעת הדירה שלי באתר
          <Toggle defaultChecked={settings.allow_publisher_messages}
            onChange={this.props.onChange}
            name="allow_publisher_messages"
            icons={false}></Toggle>
        </Row>
        <Row className="my-settings-input">
          שלחו לי עדכונים על מועדי ביקור חדשים של דירות שאהבתי
          <Toggle defaultChecked={settings.receive_like_related_notifications}
            onChange={this.props.onChange}
            name="receive_like_related_notifications"
            icons={false}></Toggle>
        </Row>
        <Row className="my-settings-input">
          שלחו לי עדכונים בנוגע לשירותים חדשים
          <Toggle defaultChecked={settings.receive_newsletter}
            onChange={this.props.onChange}
            name="receive_newsletter"
            icons={false}></Toggle>
        </Row>
      </div>
    );
  }
}

MySettingsFields.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  section: React.PropTypes.object.isRequired
};

export default MySettingsFields;
