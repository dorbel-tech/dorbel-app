import React, { Component } from 'react';
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

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
  appStore: React.PropTypes.object.isRequired
};

export default Search;
