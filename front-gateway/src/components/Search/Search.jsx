import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Filter from './Filter.jsx';
import SearchResults from '~/components/Search/SearchResults';

import './Search.scss';

@inject('appStore') @observer
class Search extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);

    this.props.appStore.metaData.title = 'dorbel - דירות להשכרה שתשמחו לגור בהן. ללא תיווך';
  }

  render() {
    const { cityStore } = this.props.appStore;
    const isLoadingCities = cityStore.cities.length === 0;

    return <div className="search-container">
      <Filter />
      <SearchResults
        isReady={!isLoadingCities}
        retryLink={<span></span>}
        noResultsContent={
          <div className="search-results-not-found">
            <b className="search-results-not-found-title">רוצים לקבל עדכון כשתעלה הדירה שחיפשתם?</b><br />
             לא נמצאו דירות פנויות שתואמות את החיפוש שלכם.<br />
             באפשרותכם לשמור את החיפוש ולקבל הודעה למייל על דירות חדשות, ברגע שהן יעלו לאתר.
          </div>
        }
      />
    </div>;
  }
}

Search.wrappedComponent.propTypes = {
  appStore: PropTypes.object.isRequired
};

export default Search;
