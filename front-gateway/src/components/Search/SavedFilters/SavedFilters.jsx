import React from 'react';
import autobind from 'react-autobind';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Row, Col, Checkbox } from 'react-bootstrap';
import { isMobile } from '~/providers/utils';

import './SavedFilters.scss';

@inject('appStore', 'appProviders') @observer
export default class SavedFilters extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    appStore: React.PropTypes.any,
    appProviders: React.PropTypes.any,
    onFilterChange: React.PropTypes.func
  }

  componentDidMount() {
    this.props.appProviders.searchProvider.loadSavedFilters();
  }

  selectFilter(filter) {
    const { searchStore } = this.props.appStore;
    
    if (filter.id === searchStore.activeFilterId) { // toggle off
      this.props.appStore.searchStore.activeFilterId = null;
    } else { // select filter
      this.props.appStore.searchStore.activeFilterId = filter.id;
      const currentFilter = _.omit(filter, ['dorbel_user_id', 'id']);
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

  renderFilter(filter, index) {
    const { appStore } = this.props;
    const city = appStore.cityStore.cities.find(city => city.id === filter.city);
    const cityName = city && city.city_name;
    const rangeLabel = this.getRangeLabel(filter.minRooms, filter.maxRooms);

    return (
      <Col key={filter.id} sm={2} xs={12} className="saved-filter-wrapper">
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
    const { appStore } = this.props;
    const filters = appStore.searchStore.filters.values();

    if (filters.length === 0) {
      return null;
    }

    return (
      <Row className="saved-filters-row">
        <Col sm={2} smOffset={2} xs={12}>
          <span className="saved-filters-title">חיפושים אחרונים</span>
        </Col>
        {filters.map(this.renderFilter)}
      </Row>
    );
  }
}

