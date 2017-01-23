import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';

import './Footer.scss';

export default class Footer extends React.Component {
  render() {
    const externalURL = 'https://www.dorbel.com/pages/';

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
            <NavLink to="/">דף הבית</NavLink>
            <NavLink to={externalURL + 'about_us'}>מי אנחנו</NavLink>
            <NavLink to={externalURL + 'owner'}>בעלי דירות</NavLink>
            <NavLink to={externalURL + 'שירותים-לבעלי-דירות'}>
              שירותים לבעלי דירות
            </NavLink>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <NavLink to={externalURL + 'faq'}>שאלות נפוצות</NavLink>
            <NavLink to="https://www.dorbel.com/blog">הבלוג שלנו</NavLink>
            <NavLink to={externalURL + 'privacy_policy'}>מדיניות פרטיות</NavLink>
            <NavLink to={externalURL + 'terms'}>תנאי שימוש</NavLink>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <NavLink to={externalURL + 'career'}>בואו לעבוד איתנו</NavLink>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <NavLink to="/">עקבו אחרינו :)</NavLink>
          </Col>
        </Row>
      </Grid>
    );
  }
}
