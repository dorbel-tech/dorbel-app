import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';

import './Footer.scss';

export default class Footer extends React.Component {
  render() {
    return (
      <Grid className="footer-container" fluid>
        <Row>
          <Col xsHidden smHidden md={3} className="footer-logo-col">
            <NavLink to="/">
              <img className="footer-logo-image" alt="Dorbel"
                  src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg" />
            </NavLink>
            <div>
            AMOS
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
