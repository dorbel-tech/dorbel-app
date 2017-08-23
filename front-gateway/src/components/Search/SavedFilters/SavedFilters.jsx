import React from 'react';
import autobind from 'react-autobind';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Row, Col, Checkbox, Radio } from 'react-bootstrap';
import { Collapse } from 'react-collapse';
import { gql, graphql } from 'react-apollo';
import { isMobile } from '~/providers/utils';
import queries from '~/graphql/queries';

import './SavedFilters.scss';

@graphql(queries.getFilters)
@inject('appStore', 'appProviders') @observer
export default class SavedFilters extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    appStore: React.PropTypes.any,
    appProviders: React.PropTypes.any,
    onFilterChange: React.PropTypes.func,
    animateEmailRow: React.PropTypes.bool
  }

  selectFilter(filter) {
    const { searchStore } = this.props.appStore;

    if (filter.id === searchStore.activeFilterId) { // toggle off
      this.props.appStore.searchStore.activeFilterId = null;
      this.props.onFilterChange && this.props.onFilterChange({});
    } else { // select filter
      this.props.appStore.searchStore.activeFilterId = filter.id;
      const currentFilter = _.omit(filter, ['dorbel_user_id', 'id', 'email_notification']);
      this.props.onFilterChange && this.props.onFilterChange(currentFilter);
    }
  }

  getRangeLabel(min, max) {
    // expecting either min, max, or both
    if (min && max) {
      return min + '\xa0-\xa0' + max;
    } else if (min && !max) {
      return `${min}+`;
    } else {
      return `עד\xa0${max}`;
    }
  }

  emailNotificationChange() {
    const { appProviders, data } = this.props;
    const user_email_notification = data.filters[0].email_notification;

    appProviders.searchProvider.toggleEmailNotification(!user_email_notification);
  }

  renderFilter(filter, index) {
    const { appStore } = this.props;
    const city = appStore.cityStore.cities.find(city => city.id === filter.city);
    const cityName = city && city.city_name;
    const rangeLabel = this.getRangeLabel(filter.minRooms, filter.maxRooms);

    return (
      <Col key={filter.id} sm={4} lg={2} xs={12} className="saved-filter-wrapper">
        <Radio checked={appStore.searchStore.activeFilterId === filter.id}
                  onClick={() => this.selectFilter(filter)}>
          <span>
            {cityName}, {rangeLabel}&nbsp;חד'
            { isMobile() ? ', ' : <br/> }
            {this.getRangeLabel(filter.mrs, filter.mre)}&nbsp;ש"ח
          </span>
        </Radio>
      </Col>
    );
  }

  renderEmailNotificationBox() {
    // we assume that email_notification is the same on all filter objects.
    const user_email_notification = this.props.data.filters[0].email_notification;

    return (
      <Col className="email-notification-box" sm={4} xs={12}>
        <Checkbox name="emailNotification" className="saved-filter-email-notification-checkbox"
          checked={user_email_notification} onChange={this.emailNotificationChange}>
          עדכנו אותי במייל על דירות חדשות
        </Checkbox>
      </Col>
    );
  }

  render() {
    const { appStore, data } = this.props;

    if (data.loading || data.filters.length === 0) {
      return null;
    }

    return (
      <div>
        <Row className="saved-filters-row">
          <Col smOffset={0} sm={2} mdOffset={1} xs={12}>
            <span className="saved-filters-title">חיפושים שמורים:</span>
          </Col>
          {data.filters.map(this.renderFilter)}
          {this.renderEmailNotificationBox()}
        </Row>
      </div>
    );
  }
}

