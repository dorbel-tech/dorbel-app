import React from 'react';
import autobind from 'react-autobind';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Row, Col, Checkbox } from 'react-bootstrap';
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
    const { appStore, appProviders, data } = this.props;
    const activeFilter = data.filters.find(filter => filter.id === appStore.searchStore.activeFilterId);
    if (activeFilter) {
      appProviders.searchProvider.saveFilter(Object.assign({}, activeFilter, { email_notification: !activeFilter.email_notification }));
    }
  }

  renderFilter(filter, index) {
    const { appStore } = this.props;
    const city = appStore.cityStore.cities.find(city => city.id === filter.city);
    const cityName = city && city.city_name;
    const rangeLabel = this.getRangeLabel(filter.minRooms, filter.maxRooms);

    return (
      <Col key={filter.id} sm={3} md={3} lg={2} xs={12} className="saved-filter-wrapper">
        <Checkbox checked={appStore.searchStore.activeFilterId === filter.id}
                  onClick={() => this.selectFilter(filter)}>
          <svg className={'saved-filter-circle saved-filter-circle-' + index } xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="40%"/>
          </svg>
          <span>
            {cityName}, {rangeLabel}&nbsp;חד'
            { isMobile() ? ', ' : <br/> }
            {this.getRangeLabel(filter.mrs, filter.mre)}&nbsp;ש"ח
          </span>
        </Checkbox>
      </Col>
    );
  }

  render() {
    const { appStore, data } = this.props;

    if (data.loading || data.filters.length === 0) {
      return null;
    }

    const activeFilter = data.filters.find(filter => filter.id === appStore.searchStore.activeFilterId);

    const emailNotificationRow = (
      <Row>
        <Col smOffset={2} sm={10} xs={12}>
          <Checkbox name="emailNotification" className="saved-filter-email-notification-checkbox"
            checked={activeFilter && activeFilter.email_notification} onChange={this.emailNotificationChange}>
            עדכנו אותי במייל על דירות חדשות לחיפוש זה
          </Checkbox>
        </Col>
      </Row>
    );

    return (
      <div>
        <Row className="saved-filters-row">
          <Col smOffset={0} sm={2} mdOffset={1} md={1} lgOffset={2} lg={2} xs={12}>
            <span className="saved-filters-title">חיפושים שמורים</span>
          </Col>
          {data.filters.map(this.renderFilter)}
        </Row>
        {
          this.props.animateEmailRow ?
            <Collapse isOpened={!!activeFilter} fixedHeight={20}>
              {emailNotificationRow}
            </Collapse>
            :
            activeFilter && emailNotificationRow
        }
      </div>
    );
  }
}

