import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Filter from './Filter.jsx';
import SearchResults from '~/components/Search/SearchResults';
import { SEARCH_PREFIX } from '~/routesHelper';

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
          retryLink={<span>אנא <a href={SEARCH_PREFIX}>נסו שנית</a></span>}
          noResultsContent={
            <div className="search-results-not-found">
              <b className="search-results-not-found-title">הלוואי והייתה לנו דירה בדיוק כזו.</b><br />
              כנראה שהייתם ספציפיים מדי - לא נמצאו דירות לחיפוש זה.<br />
              נסו לשנות את הגדרות החיפוש
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
