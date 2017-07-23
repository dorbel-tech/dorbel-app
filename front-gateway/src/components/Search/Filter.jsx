import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Collapse, Button, Checkbox, OverlayTrigger, Popover, Col, DropdownButton, Grid, MenuItem, Row } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import Nouislider from 'react-nouislider';
import { range } from 'lodash';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';

import './Filter.scss';
import SavedFilters from './SavedFilters/SavedFilters';
import { hideIntercom, isMobile } from '~/providers/utils';
import DatePicker from '~/components/DatePicker/DatePicker';

const NEW_TIP_OFFSET = {top: -10, left: -17};

const CITY_ALL_OPTION = { value: '*', label: 'כל הערים' };
const NEIGHBORHOOD_ALL_OPTION = { value: '*', label: 'כל השכונות' };
const SAVE_FILTER_ACTION = 'save-filter';

const DEFAULT_FILTER_PARAMS = {
  // Admin filter default values.
  listed: true,
  pending: false,
  rented: false,
  unlisted: false,

  city: '*', // City selector default value.
  neighborhood: '*', // Neighborhood selector default value.
  roommate: true, // Roommate search checkbox default value.
  empty: true, // Empty apartment for roommates checkbox default value.
  room: true, // Roommate looking for roommate/s checkbox default value.
  mrs: 1000, // Monthly rent slider start default value.
  mre: 7000, // Monthly rent slider end default value.
  minRooms: 1, // Rooms number slider start default value.
  maxRooms: 5, // Rooms number slider end default value.
  ac: false, // Apartment with air conditioning checkbox default value.
  balc: false, // Apartment with balcony checkbox default value.
  elev: false, // Apartment with elevator checkbox default value.
  park: false, // Apartment with parking checkbox default value.
  pet: false, // Apartment allowing pets checkbox default value.
  sb: false, // Apartment with security bars checkbox default value.
  futureBooking: true, // Future booking apartments checkbox default value.
  minLease: undefined,
  maxLease: undefined
};

@inject('appStore', 'appProviders') @observer
class Filter extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);
    autobind(this);

    // TODO: Switch to regex test instead of try-catch.
    // TODO: The active filter should be managed in the search store and not in the component
    props.appProviders.searchProvider.resetActiveFilter();
    try {
      this.filterObj = JSON.parse(decodeURIComponent(location.search.replace(/^\?q=|.*&q=([^&#]*)&.*/, '$1')) || '{}');
    } catch (e) {
      this.filterObj = {};
    }

    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return Object.assign({
      hideFilter: true,
      expandFilter: false,
      subFilterOpen: false,
      cityFilterClass: this.getCityFilterClass(),
      neighborhoodFilterClass: this.getNeighborhoodFilterClass(),
      extraFilterClass: this.getExtraFilterClass(),
      mrFilterClass: this.getMRFilterClass(),
      roomsFilterClass: this.getRoomsFilterClass(),
      leaseStartFilterClass: this.getLeaseStartFilterClass(),
      empty: !this.filterObj.room
    }, DEFAULT_FILTER_PARAMS, this.filterObj);
  }

  componentDidMount() {
    const { appProviders, appStore } = this.props;
    if (appStore.authStore.actionBeforeLogin === SAVE_FILTER_ACTION) {
      appStore.authStore.actionBeforeLogin = undefined;
      this.saveFilter();
    }
    appProviders.cityProvider.loadCities();
    this.loadNeighborhoods(this.state.city);
    this.reloadResults();
  }

  loadNeighborhoods(cityId) {
    if (cityId !== CITY_ALL_OPTION.value) {
      this.props.appProviders.neighborhoodProvider.loadNeighborhoodByCityId(cityId);
    }
  }

  getCityFilterClass() {
    const areaFilterActive = this.filterObj.city && (this.filterObj.city !== DEFAULT_FILTER_PARAMS.city);
    return areaFilterActive ? 'filter-trigger-active' : '';
  }

  getNeighborhoodFilterClass() {
    const areaFilterActive = this.filterObj.neighborhood && (this.filterObj.neighborhood !== DEFAULT_FILTER_PARAMS.neighborhood);
    return areaFilterActive ? 'filter-trigger-active' : '';
  }

  getRoomsFilterClass() {
    const roomsFilterActive = this.filterObj.minRooms || this.filterObj.maxRooms;
    return roomsFilterActive ? 'filter-trigger-active' : '';
  }

  getMRFilterClass() {
    const mrFilterActive = this.filterObj.mrs || this.filterObj.mre;
    return mrFilterActive ? 'filter-trigger-active' : '';
  }

  getLeaseStartFilterClass() {
    const leaseStartFilterActive = this.filterObj.minLease || this.filterObj.maxLease;
    return leaseStartFilterActive ? 'filter-trigger-active' : '';
  }

  getExtraFilterClass() {
    const extraFilterActive = this.filterObj.ac || this.filterObj.balc ||
      this.filterObj.elev || this.filterObj.park ||
      this.filterObj.pet || this.filterObj.sb;
    return extraFilterActive ? 'filter-trigger-active' : '';
  }

  citySelectHandler(cityId) {
    this.filterObj.city = cityId;
    this.setState({cityFilterClass: this.getCityFilterClass()});

    this.filterObj.neighborhood = NEIGHBORHOOD_ALL_OPTION.value;
    this.loadNeighborhoods(cityId);
    this.reloadResults();
  }

  neighborhoodSelectHandler(neighborhoodId) {
    this.filterObj.neighborhood = neighborhoodId;
    this.setState({neighborhoodFilterClass: this.getNeighborhoodFilterClass()});

    this.reloadResults();
  }

  mrSliderChangeHandler(mrStringArray, unused, monthly_rent) {
    this.sliderChangeHandler(monthly_rent.map(Math.round), 'mrs', 'mre');
    this.setState({mrFilterClass: this.getMRFilterClass()});
  }

  roomsSliderChangeHandler(roomsStringArray, unused, rooms) {
    this.sliderChangeHandler(rooms, 'minRooms', 'maxRooms');
    this.setState({roomsFilterClass: this.getRoomsFilterClass()});
  }

  leaseStartDateChange(field, date) {
    if (this.state[field] !== date) {
      this.filterObj[field] = date;
      this.setState({
        [field]: date,
        leaseStartFilterClass: this.getLeaseStartFilterClass()
      });
      this.reloadResults();
    }
  }

  sliderChangeHandler(range, minProp, maxProp) {
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

    this.reloadResults();
  }

  adminFilterChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.checked });
    this.filterObj[e.target.name] = e.target.checked;

    this.reloadResults();
  }

  checkboxChangeHandler(e, isReversed) {
    const shouldAssignFilterValue = (!isReversed && e.target.checked) || (isReversed && !e.target.checked);
    shouldAssignFilterValue ? this.filterObj[e.target.name] = !isReversed : delete this.filterObj[e.target.name];
    this.setState({
      [e.target.name]: e.target.checked,
      extraFilterClass: this.getExtraFilterClass()
    });
    this.reloadResults();
  }

  roommateChangeHandler(e) {
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

    this.reloadResults();
  }

  reloadResults() {
    const search = '?q=' + encodeURIComponent(JSON.stringify(this.filterObj));
    const title = document ? document.title : '';

    history.pushState(this.filterObj, title, search);

    this.props.appProviders.searchProvider.search(this.filterObj);
  }

  getAreaTitle(areaId, allOption, areas, nameProp) {
    if (areaId === allOption.value) {
      return allOption.label;
    } else {
      const area = areas.find(a => a.id == areaId);
      return area ? area[nameProp] : 'טוען...';
    }
  }

  toggleHideFilter() {
    hideIntercom(this.state.hideFilter);
    this.setState({ hideFilter: !this.state.hideFilter });
  }

  saveFilter() {
    const { appProviders } = this.props;
    if (!appProviders.authProvider.shouldLogin({ actionBeforeLogin: SAVE_FILTER_ACTION })) {
      appProviders.searchProvider.saveFilter(this.filterObj)
      .then(() => appProviders.notificationProvider.success('החיפוש נשמר בהצלחה'))
      .catch(err => {
        let heading = err.message || _.get(err, 'response.data');
        appProviders.modalProvider.showInfoModal({ title: 'אופס...', heading });
      });
    }
  }

  loadFilter(filterObj) {
    Object.keys(filterObj).filter(key => filterObj[key] === null).forEach(key => delete filterObj[key]);
    this.filterObj = filterObj;
    this.setState(this.getDefaultState());
    if (filterObj.city) {
      this.loadNeighborhoods(filterObj.city); // make sure neighborhoods are loaded for this city
    }
    this.reloadResults();
  }

  renderAdminFilter() {
    const { appStore } = this.props;
    const isUserAdmin = appStore.authStore.isUserAdmin();

    if (isUserAdmin) {
      return <div className="filter-group-container">
        <h5><b className="filter-show-listing-status">הצג דירות בסטטוס</b></h5>
        <Checkbox name="pending"
          checked={this.state.pending}
          className="filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          ממתינה לאישור
        </Checkbox>
        <Checkbox name="listed"
          checked={this.state.listed}
          className="filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          מפורסמת
        </Checkbox>
        <Checkbox name="rented"
          checked={this.state.rented}
          className="filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          הושכרה
        </Checkbox>
        <Checkbox name="unlisted"
          checked={this.state.unlisted}
          className="filter-admin-switch"
          onChange={this.adminFilterChangeHandler}>
          לא פעילה
        </Checkbox>
      </div>;
    }
  }

  roomsPopup() {
    return <Popover className="filter-rooms-popup" id="popup-rooms">
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
           </Popover>;
  }

  mrPopup() {
    return <Popover className="filter-mr-popup" id="popup-mr">
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
           </Popover>;
  }

  leaseStartPopup() {
    return <Popover className="filter-lease-start-popup" id="popup-lease-start">
             <h5><b>מתאריך:</b></h5>
             <DatePicker placeholder="בחרו תאריך התחלה" value={this.state.minLease} id="min-lease-date-picker"
                showClearButton={true} onChange={this.leaseStartDateChange.bind(this, 'minLease')}/>
             <h5><b>עד תאריך:</b></h5>
             <DatePicker placeholder="בחרו תאריך סיום" value={this.state.maxLease} id="max-lease-date-picker"
                showClearButton={true} onChange={this.leaseStartDateChange.bind(this, 'maxLease')}/>
           </Popover>;
  }

  extraPopup() {
    return <Popover className="filter-extra-popup" id="popup-extra">
              {this.renderAdminFilter()}
              <div className="filter-group-container">
                <Checkbox name="roommate"
                  checked={this.state.roommate}
                  className="filter-switch-group-header"
                  onChange={this.roommateChangeHandler}>
                  <b>הציגו לי דירות לשותפים</b>
                </Checkbox>
                <div className="filter-input-wrapper">
                  <Checkbox name="empty"
                    checked={this.state.empty}
                    disabled={!this.state.roommate || !this.state.room}
                    onChange={this.roommateChangeHandler}>
                    דירות ריקות לשותפים
                  </Checkbox>
                </div>
                <div className="filter-input-wrapper">
                  <Checkbox name="room"
                    checked={this.state.room}
                    disabled={!this.state.roommate || !this.state.empty}
                    onChange={this.roommateChangeHandler}>
                    חדר בדירת שותפים
                  </Checkbox>
                </div>
              </div>
              <div className="filter-amenities-container">
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
              </div>
           </Popover>;
  }

  renderCollapseContent() {
    const { authStore, searchStore } = this.props.appStore;

    const saveFilterButtonText = searchStore.activeFilterId ? 'עדכן חיפוש' : 'שמור חיפוש';

    return (
      <div>
        <Row>
          <Col sm={2} smOffset={0} mdOffset={1}>
            <OverlayTrigger placement="bottom" trigger="click" rootClose
                            overlay={this.roomsPopup()}
                            onEntered={this.subFilterEntered}
                            onExit={this.subFilterExit}>
              <div className={'filter-trigger-container ' + this.state.roomsFilterClass}>חדרים</div>
            </OverlayTrigger>
          </Col>
          <Col sm={2}>
            <OverlayTrigger placement="bottom" trigger="click" rootClose
                            overlay={this.mrPopup()}
                            onEntered={this.subFilterEntered}
                            onExit={this.subFilterExit}>
              <div className={'filter-trigger-container ' + this.state.mrFilterClass}>מחיר</div>
            </OverlayTrigger>
          </Col>
          <Col sm={3} md={2}>
            <OverlayTrigger placement={isMobile() ? 'top' : 'bottom'}
                            trigger="click" rootClose
                            overlay={this.leaseStartPopup()}
                            onEntered={this.subFilterEntered}
                            onExit={this.subFilterExit}>
              <div className={'filter-trigger-container ' + this.state.leaseStartFilterClass}>תאריך כניסה</div>
            </OverlayTrigger>
          </Col>
          <Col sm={3} md={2}>
            <OverlayTrigger placement={isMobile() ? 'top' : 'bottom'}
                            trigger="click" rootClose
                            overlay={this.extraPopup()}
                            onEntered={this.subFilterEntered}
                            onExit={this.subFilterExit}>
              <div className={'filter-trigger-more filter-trigger-container ' + this.state.extraFilterClass}>פילטרים נוספים</div>
            </OverlayTrigger>
          </Col>
          <Col lgHidden mdHidden smHidden className="filter-future-booking-switch-mobile-wrapper">
            <Checkbox name="futureBooking" className="filter-future-booking-switch"
                      checked={this.state.futureBooking} onChange={this.checkboxChangeHandler}>
              הראו לי דירות שטרם פורסמו
            </Checkbox>
            <span className="filter-future-booking-new"
                  data-tip="חדש! תכננו את מעבר הדירה הבא! מעכשיו תוכלו לגלות דירות מושכרות, לעקוב אחריהן ולהיות הראשונים לדעת כשהן מתפנות">חדש!</span>
            <ReactTooltip type="dark" effect="solid" place="bottom"
                          offset={NEW_TIP_OFFSET} className="filter-future-booking-tooltip"/>
          </Col>
          <Col sm={2} className="filter-actions-container">
            <Button id="saveFilterButton" className="filter-save"
                    block bsStyle="info" onClick={this.saveFilter}>
              {saveFilterButtonText}
            </Button>
            <Button className="filter-close" bsStyle="primary"
                    onClick={this.toggleHideFilter}>
              סנן
            </Button>
          </Col>
        </Row>
        {
          !isMobile() && authStore.isLoggedIn && <SavedFilters onFilterChange={this.loadFilter} animateEmailRow />
        }
      </div>
    );
  }

  subFilterEntered() {
    this.setState({subFilterOpen: true});
  }

  subFilterExit() {
    this.setState({subFilterOpen: false});
  }

  mouseEnterHandler() {
    this.setState({expandFilter: true});
  }

  mouseLeaveHandler() {
    this.setState({expandFilter: false});
  }

  render() {
    const { cityStore, neighborhoodStore, authStore } = this.props.appStore;
    const cities = cityStore.cities.length ? cityStore.cities : [];
    const cityId = this.filterObj.city || DEFAULT_FILTER_PARAMS.city;
    const cityTitle = this.getAreaTitle(cityId, CITY_ALL_OPTION, cities, 'city_name');
    const neighborhoodId = this.filterObj.neighborhood || DEFAULT_FILTER_PARAMS.neighborhood;
    const neighborhoods = neighborhoodStore.neighborhoodsByCityId.get(cityId) || [];
    const neighborhoodTitle = this.getAreaTitle(neighborhoodId, NEIGHBORHOOD_ALL_OPTION, neighborhoods, 'neighborhood_name');

    const filterButtonText = this.state.hideFilter ? 'סנן תוצאות' : 'סגור';
    const filterExpanded = this.state.expandFilter || this.state.subFilterOpen;

    return <div onMouseEnter={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
                className={this.state.hideFilter ? '' : 'filter-component'}>
      <div className="filter-toggle-container">
        <Button onClick={this.toggleHideFilter}>
          {filterButtonText}
        </Button>
      </div>
      <Grid fluid className={'filter-wrapper' + (this.state.hideFilter ? ' hide-mobile-filter' : '') + (filterExpanded ? '' : ' filter-wrapper-collapse')}>
        {
          isMobile() && authStore.isLoggedIn && <SavedFilters onFilterChange={this.loadFilter}/>
        }
        <Row>
          <Col smOffset={0} sm={4} mdOffset={1} md={4} className="filter-dropdown-wrapper">
            <DropdownButton id="cityDropdown" bsSize="large" noCaret
              className={'filter-dropdown ' + this.state.cityFilterClass}
              title={'עיר: ' + cityTitle}
              onSelect={this.citySelectHandler}>
              <MenuItem eventKey={'*'}>כל הערים</MenuItem>
              {cities.map(city => <MenuItem key={city.id} eventKey={city.id}>{city.city_name}</MenuItem>)}
            </DropdownButton>
          </Col>
          <Col sm={3} className="filter-dropdown-wrapper">
            <DropdownButton id="neighborhoodDropdown" bsSize="large" noCaret
              className={'filter-dropdown ' + this.state.neighborhoodFilterClass}
              title={'שכונה: ' + neighborhoodTitle}
              onSelect={this.neighborhoodSelectHandler}>
              <MenuItem eventKey={NEIGHBORHOOD_ALL_OPTION.value}>{NEIGHBORHOOD_ALL_OPTION.label}</MenuItem>
              {neighborhoods.map(neighborhood => <MenuItem key={neighborhood.id} eventKey={neighborhood.id}>{neighborhood.neighborhood_name}</MenuItem>)}
            </DropdownButton>
          </Col>
          <Col sm={5} md={4} xsHidden>
            <span data-tip="חדש! תכננו את מעבר הדירה הבא! מעכשיו תוכלו לגלות דירות מושכרות, לעקוב אחריהן ולהיות הראשונים לדעת כשהן מתפנות">
              <Checkbox name="futureBooking" className="filter-future-booking-switch"
                        checked={this.state.futureBooking} onChange={e => this.checkboxChangeHandler(e, true)}>
                הראו לי דירות שטרם פורסמו
              </Checkbox>
              <span className="filter-future-booking-new">חדש!</span>
            </span>
            <ReactTooltip type="dark" effect="solid" place="bottom"
                          offset={NEW_TIP_OFFSET} className="filter-future-booking-tooltip"/>
          </Col>
        </Row>
        {!isMobile() && <div className={'filter-collapse-handle' + (filterExpanded ? ' filter-collapse-handle-hidden' : '')}></div>}
        {
          isMobile() ?
            this.renderCollapseContent() :
            <Collapse in={filterExpanded}>
              {this.renderCollapseContent()}
            </Collapse>
        }
      </Grid>
    </div>;
  }
}

Filter.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Filter;
