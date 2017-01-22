import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';

import './Footer.scss';

export default class Footer extends React.Component {
  render() {
    return (
      <Grid className="footer-container" fluid>
        <Row>
          <Col smHidden md={3} className="footer-logo-col">
            <NavLink to="/">
              <img className="footer-logo-image" alt="Dorbel"
                src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg" />
            </NavLink>
            <div>
              מערכת לניהול והשכרת דירות ונכסים, המאפשרת לנהל את כל התהליכים בקלות ואונליין.
            </div>
          </Col>
          <Col sm={3} md={2} mdOffset={1} className="footer-links-col">
            <NavLink to="/">
              דף הבית
            </NavLink>
            <NavLink to="/">
              מי אנחנו
            </NavLink>
            <NavLink to="/">
              בעלי דירות
            </NavLink>
            <NavLink to="/">
              שירותים לבעלי דירות
            </NavLink>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <NavLink to="/">
              שאלות נפוצות
            </NavLink>
            <NavLink to="/">
              הבלוג שלנו
            </NavLink>
            <NavLink to="/">
              מדיניות פרטיות
            </NavLink>
            <NavLink to="/">
              תנאי שימוש
            </NavLink>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <NavLink to="/">
              בואו לעבוד איתנו
            </NavLink>
            <NavLink to="/">
              צור קשר
            </NavLink>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <NavLink to="/">
              עקבו אחרינו :)
            </NavLink>
          </Col>
        </Row>
      </Grid>
    );
  }
}
