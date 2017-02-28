import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Button, Checkbox, Radio, Col, DropdownButton, Grid, MenuItem, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import Nouislider from 'react-nouislider';
import { range } from 'lodash';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './Search.scss';

const DEFAULT_FILTER_PARAMS = {
  // Admin filter default values.
  listed: true,
  pending: false,
  rented: false,
  unlisted: false,

  city: 1, // City selector default value.
  roommate: true, // Roommate search checkbox default value.
  empty: true, // Empty apartment for roommates checkbox default value.
  room: true, // Roommate looking for roommate/s checkbox default value.
  mrs: 1000, // Monthly rent slider start default value.
  mre: 7000, // Monthly rent slider end default value.
  minRooms: 1, // Rooms number slider start default value.
  maxRooms: 5, // Rooms number slider end default value.
  minSize: 26, // Apartment size slider start default value.
  maxSize: 120, // Apartment size slider end default value.
  ac: false, // Apartment with air conditioning checkbox default value.
  balc: false, // Apartment with balcony checkbox default value.
  elev: false, // Apartment with elevator checkbox default value.
  park: false, // Apartment with parking checkbox default value.
  pet: false // Apartment allowing pets checkbox default value.
};

@observer(['appStore', 'appProviders'])
class Search extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);
    autobind(this);
    this.state = { isLoading: false };
    // TODO: Switch to regex test instead of try-catch.
    try {
      this.filterObj = JSON.parse(decodeURIComponent(location.search.replace(/^\?q=|.*&q=([^&#]*)&.*/, '$1')));
    } catch (e) {
      this.filterObj = {};
    }

    this.filterChanged = false;
    this.state = Object.assign({ hideFilter: true }, DEFAULT_FILTER_PARAMS, this.filterObj);

    // Adjust roommates checkboxes state when provided with roommates data from
    // the query params (location.search).
    if (this.filterObj.room) {
      this.setState({ empty: false });
    }

    this.props.appStore.metaData.title = 'dorbel - דירות שתשמחו לגור בהן. ללא תיווך';
  }

  componentDidMount() {
    this.props.appProviders.cityProvider.loadCities();
    this.reloadListings();
  }

  citySelectHandler(cityId) {
    this.filterChanged = true;
    this.filterObj.city = cityId;

    this.reloadListings();
  }

  mrSliderChangeHandler(mrStringArray, unused, monthly_rent) {
    this.sliderChangeHandler(monthly_rent, 'mrs', 'mre');
  }

  roomsSliderChangeHandler(roomsStringArray, unused, rooms) {
    this.sliderChangeHandler(rooms, 'minRooms', 'maxRooms');
  }

  sizeSliderChangeHandler(sizeStringArray, unused, sizes) {
    this.sliderChangeHandler(sizes, 'minSize', 'maxSize');
  }

  sliderChangeHandler(range, minProp, maxProp) {
    this.filterChanged = true;
    this.setState({
      [minProp]: range[0],
      [maxProp]: range[1]
    });

    if (range[0] !== DEFAULT_FILTER_PARAMS[minProp] ||
      range[1] !== DEFAULT_FILTER_PARAMS[maxProp]) {
      this.filterObj[minProp] = range[0] === DEFAULT_FILTER_PARAMS[minProp] ?
        undefined : range[0];
      this.filterObj[maxProp] = range[1] === DEFAULT_FILTER_PARAMS[maxProp] ?
        undefined : range[1];
    } else {
      delete this.filterObj[minProp];
      delete this.filterObj[maxProp];
    }

    this.reloadListings();
  }

  adminFilterChangeHandler(e) {
    this.checkboxChangeHandler(e, false);
  }

  checkboxChangeHandler(e, falseOption) {
    this.filterChanged = true;
    this.setState({ [e.target.name]: e.target.checked });

    this.filterObj[e.target.name] = e.target.checked ? true : falseOption;
    this.reloadListings();
  }

  roommateChangeHandler(e) {
    this.filterChanged = true;
    this.setState({ [e.target.name]: e.target.checked });

    delete this.filterObj.room;
    // We can't check the newly set state to be false directly,
    // so we do a positive check.
    if (e.target.name === 'roommate' && this.state.roommate) {
      this.filterObj.room = 0;
    } else if (e.target.name === 'room' && this.state.room) {
      this.filterObj.room = 0;
    } else if (e.target.name === 'empty' && this.state.empty) {
      this.filterObj.room = 1;
    }

    this.reloadListings();
  }

  sortChangeHandler(e) {
    this.filterChanged = true;
    this.filterObj.sort = e.target.value;

    this.reloadListings();
  }

  reloadListings() {
    this.setState({ isLoading: true });

    if (!this.filterObj.city) {
      this.filterObj.city = DEFAULT_FILTER_PARAMS.city;
    }

    const search = '?q=' + encodeURIComponent(JSON.stringify(this.filterObj));
    const title = document ? document.title : '';

    history.pushState(this.filterObj, title, search);

    this.props.appProviders.searchProvider.search(this.filterObj)
      .then(() => { this.setState({ isLoading: false }); });
  }

  toggleHideFilter() {
    this.setState({ hideFilter: !this.state.hideFilter });
  }

  renderAdminFilter() {
    const { authStore } = this.props.appStore;
    const profile = authStore.profile;
    const userIsAdmin = profile && profile.role === 'admin';

    if (userIsAdmin) {
      return <div className="search-filter-group-container">
        <h5><b>הצג דירות בסטטוס</b></h5>
        <Checkbox name="pending"
          checked={this.state.pending}
          className="search-filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          ממתינה לאישור
        </Checkbox>
        <Checkbox name="listed"
          checked={this.state.listed}
          className="search-filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          מפורסמת
        </Checkbox>
        <Checkbox name="rented"
          checked={this.state.rented}
          className="search-filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          הושכרה
        </Checkbox>
        <Checkbox name="unlisted"
          checked={this.state.unlisted}
          className="search-filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          לא פעילה
        </Checkbox>
      </div>;
    }
  }

  renderSort() {
    return (
      <div className="sort-container search-filter-group-container">
        <div className="search-filter-switch-group-headersort-header">
          <b>סדר לפי</b>
        </div>
        <div className="sort-options">
          <div className="search-filter-input-wrapper">
            <Radio value="lease_start" checked={this.filterObj.sort === 'lease_start' || !this.filterObj.sort} onChange={this.sortChangeHandler}>
              תאריך כניסה
            </Radio>
          </div>
          <div className="search-filter-input-wrapper">
            <Radio value="publish_date" checked={this.filterObj.sort === 'publish_date'} onChange={this.sortChangeHandler}>
              תאריך פרסום
              </Radio>
          </div>
        </div>
      </div>
    );
  }

  renderFilter() {
    const { cityStore } = this.props.appStore;
    const cities = cityStore.cities.length ? cityStore.cities : [];
    const cityId = this.filterObj.city || DEFAULT_FILTER_PARAMS.city;

    let cityTitle;
    if (cityId === '*') {
      cityTitle = 'כל הערים';
    } else {
      const city = cities.find(c => c.id == cityId);
      cityTitle = city ? city.city_name : 'טוען...';
    }

    return <div className="search-container">
      <div className="search-filter-toggle-container">
        <Button onClick={this.toggleHideFilter}>
          סנן תוצאות
        </Button>
      </div>
      <div className={'search-filter-wrapper' + (this.state.hideFilter ? ' hideFilter' : '')}>
        <div className="search-filter-city-container">
          <DropdownButton id="cityDropdown" bsSize="large"
            className="search-filter-city-dropdown"
            title={'עיר: ' + cityTitle}
            onSelect={this.citySelectHandler}>
            <MenuItem eventKey={'*'}>כל הערים</MenuItem>
            {cities.map(city => <MenuItem key={city.id} eventKey={city.id}>{city.city_name}</MenuItem>)}
          </DropdownButton>
        </div>
        {this.renderAdminFilter()}
        {this.renderSort()}
        <div className="search-filter-group-container">
          <Checkbox name="roommate"
            checked={this.state.roommate}
            className="search-filter-switch-group-header"
            onChange={this.roommateChangeHandler}>
            <b>הציגו לי דירות לשותפים</b>
          </Checkbox>
          <div className="search-filter-input-wrapper">
            <Checkbox name="empty"
              checked={this.state.empty}
              disabled={!this.state.roommate || !this.state.room}
              onChange={this.roommateChangeHandler}>
              דירות ריקות לשותפים
              </Checkbox>
          </div>
          <div className="search-filter-input-wrapper">
            <Checkbox name="room"
              checked={this.state.room}
              disabled={!this.state.roommate || !this.state.empty}
              onChange={this.roommateChangeHandler}>
              חדר בדירת שותפים
              </Checkbox>
          </div>
        </div>
        <div className="search-filter-sliders-container">
          <div className="cost-slider">
            <h5 className="text-center">טווח מחירים</h5>
            <Nouislider onChange={this.mrSliderChangeHandler}
              range={{
                min: DEFAULT_FILTER_PARAMS.mrs,
                max: DEFAULT_FILTER_PARAMS.mre
              }}
              start={[this.state.mrs, this.state.mre]}
              step={DEFAULT_FILTER_PARAMS.mrs}
              pips={{ mode: 'steps', density: 30 }}
              connect={true}
              direction={'ltr'} />
          </div>
          <div className="roomsnum-slider">
            <h5 className="text-center">מספר חדרים</h5>
            <Nouislider onChange={this.roomsSliderChangeHandler}
              range={{
                min: DEFAULT_FILTER_PARAMS.minRooms,
                '12.5%': 1.5,
                '25%': 2,
                '37.5%': 2.5,
                '50%': 3,
                '62.5%': 3.5,
                '75%': 4,
                '87.5%': 4.5,
                max: DEFAULT_FILTER_PARAMS.maxRooms
              }}
              start={[this.state.minRooms, this.state.maxRooms]}
              snap={true}
              pips={{
                mode: 'values',
                values: range(DEFAULT_FILTER_PARAMS.minRooms,
                  DEFAULT_FILTER_PARAMS.maxRooms + 1),
                density: 30
              }}
              connect={true}
              direction={'ltr'} />
          </div>
          <div className="size-slider">
            <h5 className="text-center">גודל נכס (במ"ר)</h5>
            <Nouislider onChange={this.sizeSliderChangeHandler}
              range={{
                min: DEFAULT_FILTER_PARAMS.minSize,
                '20%': 40,
                '40%': 60,
                '60%': 80,
                '80%': 100,
                max: DEFAULT_FILTER_PARAMS.maxSize
              }}
              start={[this.state.minSize, this.state.maxSize]}
              snap={true}
              pips={{ mode: 'steps', density: 30 }}
              connect={true}
              direction={'ltr'} />
          </div>
        </div>
        <Grid fluid>
          <Row className="search-filter-amenities-container">
            <h5><b>צמצמו את החיפוש</b></h5>
            <Col xs={4}>
              <Checkbox name="park" checked={this.state.park} onChange={this.checkboxChangeHandler}>
                חניה
                </Checkbox>
              <Checkbox name="balc" checked={this.state.balc} onChange={this.checkboxChangeHandler}>
                מרפסת
                </Checkbox>
            </Col>
            <Col xs={4}>
              <Checkbox name="ac" checked={this.state.ac} onChange={this.checkboxChangeHandler}>
                מזגן
                </Checkbox>
              <Checkbox name="ele" checked={this.state.ele} onChange={this.checkboxChangeHandler}>
                מעלית
                </Checkbox>
            </Col>
            <Col xs={4}>
              <Checkbox name="pet" checked={this.state.pet} onChange={this.checkboxChangeHandler}>
                מותר בע״ח
                </Checkbox>
              <Checkbox name="sb" checked={this.state.sb} onChange={this.checkboxChangeHandler}>
                סורגים
                </Checkbox>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>;
  }

  renderResults() {
    const { searchStore } = this.props.appStore;
    const results = searchStore.searchResults.length ? searchStore.searchResults : [];

    if (!this.state.isLoading && results.length > 0) {
      return (<Grid fluid>
        <Row>
          {results.map(listing => <ListingThumbnail listing={listing} key={listing.id} />)}
        </Row>
      </Grid>);
    } else if (!this.filterChanged || this.state.isLoading) {
      return (
        <div className="loaderContainer">
          <LoadingSpinner />
        </div>
      );
    } else {
      return (<div className="search-results-not-found">
        <b className="search-results-not-found-title">הלוואי והייתה לנו דירה בדיוק כזו.</b><br />
        כנראה שהייתם ספציפיים מדי - לא נמצאו דירות לחיפוש זה.<br />
        נסו לשנות את הגדרות החיפוש</div>);
    }
  }

  render() {
    return (
      <div className="search-wrapper">
        {this.renderFilter()}
        <div className="search-results-wrapper">
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

Search.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Search;
