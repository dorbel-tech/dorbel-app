import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';

import './ListingStats.scss';

@observer(['appStore', 'appProviders', 'router'])
class ListingStats extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const { appStore, appProviders } = this.props;
    const listingId = this.props.listingId;

    if (!appStore.listingStore.listingViewsById.has(listingId)) {
      appProviders.listingsProvider.loadListingPageViews(listingId);
    }
  }
  render() {
    const { appStore, listingId } = this.props;

    if (!appStore.listingStore.listingViewsById.has(listingId)) {
      return null;
    }

    const views = appStore.listingStore.listingViewsById.get(listingId);

    return  <Grid fluid={true} className="dashboard-my-propery-stats">
                <Row className="rent-title">
                  <Col xs={12}>
                    תהליך ההשכרה:                 
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="numbers-row">
                      <div className="number">{views}</div>
                      <div className="empty"></div>
                      <div className="number">0</div>
                      <div className="empty"></div>
                      <div className="number">
                        <i className="fa fa-check rented-check" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div>
                      <div className="bubble">
                        <div className="bubble-text">צפיות במודעה</div>
                      </div>
                      <div className="line"></div>
                      <div className="bubble">
                        <div className="bubble-text">הרשמות לביקורים</div>
                      </div>
                      <div className="line"></div>
                      <div className="bubble">
                        <div className="bubble-text">חתימת חוזה</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="services-title">
                  <Col xs={12}>
                    שירותים בתשלום:                 
                  </Col>
                </Row>
                <Row className="services">
                  <Col md={4}>
                    <div className="service">
                      <div className="title">פרסום הדירה</div>
                      <div>רוצים להשכיר מהר? הגדילו את חשיפת הדירה ע״י פרסום ממומן. הגיעו ליותר דיירים בפחות זמן</div>
                      <a className="button btn btn-success" href="https://www.dorbel.com/pages/services/social-advertising" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="service">
                      <div className="title">דו״ח נתוני אשראי</div>
                      <div>רוצים להיות בטוחים? לפני חתימה על חוזה חשוב לוודא שהדייר החדש והערבים יעמדו בתשלומים</div>
                      <a className="button btn btn-success" href="https://www.dorbel.com/pages/services/credit-report" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="service">
                      <div className="title">צילום והצגת הדירה</div>
                      <div>אנו נצלם ונציג עבורכם את הדירה בפני הדיירים הפוטנציאליים כדי לחסוך לכם את ההגעה לכל ביקור</div>
                      <a className="button btn btn-success" href="https://www.dorbel.com/pages/services/hosted-viewings" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                </Row>
              </Grid>;
  }
}

ListingStats.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default ListingStats;
