import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import { SEARCH_PREFIX } from '~/routesHelper';
import { PROPERTY_SUBMIT_PREFIX } from '~/routesHelper';

import './Footer.scss';

export default class Footer extends React.Component {
  render() {
    const externalURL = 'https://www.dorbel.com/pages/';

    return (
      <Grid className="footer-container" fluid>
        <Row>
          <Col sm={6} md={6} className="footer-section-title">
            מפת האתר
          </Col>
          <Col sm={4} md={4} className="footer-section-title">
            עקבו אחרינו
          </Col>
        </Row>
        <Row>
          <Col sm={2} md={2} className="footer-links-col">
            <NavLink to="/">דף הבית</NavLink>
            <a href={externalURL + 'services'}>שירותי פרימיום</a>
            <a href={externalURL + 'owner'}>בעלי דירות</a>
            <NavLink to={PROPERTY_SUBMIT_PREFIX}>פרסמו דירה – חינם</NavLink>
          </Col>
          <Col sm={2} md={2} className="footer-links-col">
            <a href={externalURL + 'about_us'}>מי אנחנו</a>
            <a href={externalURL + 'career'}>בואו לעבוד איתנו</a>
            <a href="https://www.dorbel.com/blog">הבלוג שלנו</a>
            <NavLink to={SEARCH_PREFIX}>מצאו דירה – ללא תיווך</NavLink>
          </Col>
          <Col sm={2} md={2} className="footer-links-col">
            <a href={externalURL + 'faq'}>שאלות נפוצות</a>
            <a href={externalURL + 'terms'}>תנאי שימוש</a>
            <a href={externalURL + 'privacy_policy'}>מדיניות פרטיות</a>
          </Col>
          <Col sm={4} md={4} className="footer-social-icons">
            <div>
              <a href="https://www.facebook.com/dorbel.home">
                <i className="footer-links-facebook fa fa-facebook" aria-hidden="true"></i></a>
              <a href="https://www.linkedin.com/company/dorbel">
                <i className="footer-links-linkedin fa fa-linkedin" aria-hidden="true"></i></a>
            </div>
          </Col>        </Row>
        <Row>
          <Col className="text-center footer-copyright">
            dorbel Ltd 2017. All rights reserved.
          </Col>
        </Row>
      </Grid>
    );
  }
}
