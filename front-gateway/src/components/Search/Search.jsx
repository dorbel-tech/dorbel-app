import React, { Component } from 'react';
import { inject } from 'mobx-react';

import Filter from './Filter.jsx';
import SearchResults from '~/components/Search/SearchResults';
import { graphql, getCities } from '~/queries';

import './Search.scss';

@graphql(getCities)
@inject('appStore')
class Search extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);

    this.props.appStore.metaData.title = 'dorbel - דירות להשכרה שתשמחו לגור בהן. ללא תיווך';
  }

  render() {
    const isLoadingCities = this.props.data.loading;

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
  appStore: React.PropTypes.object.isRequired,
  data: React.PropTypes.object.isRequired
};

export default Search;
