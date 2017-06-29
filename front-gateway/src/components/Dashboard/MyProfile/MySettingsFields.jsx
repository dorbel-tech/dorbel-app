import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import { FRC } from '~/components/FormWrapper/FormWrapper';

import './MySettingsFields.scss';

class MySettingsFields extends Component {
  static showPicture = false;

  render() {
    const settings = this.props.profile.settings || {
      receive_newsletter: true
    };

    return (
      <Row className="my-settings-input">
        <FRC.Input value="settings" name="section" type="hidden" />
        <FRC.Checkbox
          name="data.receive_newsletter"
          value={settings.receive_newsletter}
          label="שלחו לי עדכונים בנוגע לשירותים חדשים" />
      </Row>
    );
  }
}

MySettingsFields.propTypes = {
  profile: React.PropTypes.object.isRequired
};

export default MySettingsFields;
