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
          <Col sm={3} md={2} className="footer-logo-col">
            <NavLink to="/">
              <img className="footer-logo-image" alt="Dorbel"
                src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg" />
            </NavLink>
            <div className="footer-logo-col-text">
              מערכת לניהול והשכרת דירות ונכסים, המאפשרת לנהל את כל התהליכים בקלות ואונליין.
            </div>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <NavLink to="/">דף הבית</NavLink>
            <a href={externalURL + 'about_us'}>מי אנחנו</a>
            <a href={externalURL + 'owner'}>בעלי דירות</a>
            <a href={externalURL + 'services'}>שירותי פרימיום</a>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <a href={externalURL + 'faq'}>שאלות נפוצות</a>
            <a href="https://www.dorbel.com/blog">הבלוג שלנו</a>
            <a href={externalURL + 'privacy_policy'}>מדיניות פרטיות</a>
            <a href={externalURL + 'terms'}>תנאי שימוש</a>
          </Col>
          <Col sm={3} md={2} className="footer-links-col">
            <a href={externalURL + 'career'}>בואו לעבוד איתנו</a>
            <a className="footer-links-follow-text">עקבו אחרינו :)</a>
            <div>
              <a href="https://www.facebook.com/dorbel.home">
                <i className="footer-links-follow-i fa fa-facebook-square" aria-hidden="true"></i></a>
              <a href="https://www.linkedin.com/company/dorbel">
                <i className="footer-links-follow-i fa fa-linkedin-square" aria-hidden="true"></i></a>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
