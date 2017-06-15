import React from 'react';
import autobind from 'react-autobind';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Row, Col, Checkbox } from 'react-bootstrap';

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

  state = {
    selectedFilterId: null
  }

  componentDidMount() {
    this.props.appProviders.searchProvider.loadSavedFilters();
  }

  selectFilter(filter) {
    this.setState({ selectedFilterId: filter.id });
    if (this.props.onFilterChange) {
      this.props.onFilterChange(_.cloneDeep(filter));
    }
  }

  getRangeLabel(min, max) {
    // expecting either min, max, or both
    if (min && max) {
      return `${min} - ${max}`;
    } else if (min && !max) {
      return `${min}+`;
    } else {
      return `עד ${max}`;
    }
  }

  renderFilter(filter) {
    const city = this.props.appStore.cityStore.cities.find(city => city.id === filter.city);
    const cityName = city && city.city_name;


    return (
      <Col key={filter.id} md={2}>
        <Checkbox
          checked={this.state.selectedFilterId === filter.id}
          onClick={() => this.selectFilter(filter)}>
          <svg width="40" height="50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20"/>
          </svg>
          <span>
            {cityName},
            {this.getRangeLabel(filter.minRooms, filter.maxRooms)} חד'
            <br/>
            {this.getRangeLabel(filter.mrs, filter.mre)} ש"ח
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
      <Row>
        <Col md={2} mdOffset={2}>
          חיפושים אחרונים
        </Col>
        {filters.map(this.renderFilter)}
      </Row>
    );
  }
}

