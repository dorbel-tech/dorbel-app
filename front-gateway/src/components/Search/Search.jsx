import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import Filter from './Filter.jsx';
import SearchResults from '~/components/Search/SearchResults';

import './Search.scss';

@inject('appStore', 'appProviders') @observer
class Search extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {showScrollUp: false};
    this.props.appStore.metaData.title = 'dorbel - דירות שתשמחו לגור בהן. ללא תיווך';
  }

  componentDidMount() {
    this.filterHeight = document.getElementsByClassName('filter-wrapper')[0].clientHeight;
  }

  handleScroll(e) {
    const target = e.target;

    if (target.scrollTop > this.filterHeight) {
      this.setState({showScrollUp: true});
    } else if (this.state.showScrollUp) {
      this.setState({showScrollUp: false});
    }
  }

  scrollUpClickHandler() {
    const scrollElement = document.getElementsByClassName('search-container')[0];
    let perTick;

    const scrollTo = (duration) => {
      if (duration <= 0) {
        return;
      }

      perTick = scrollElement.scrollTop / duration * 10;

      setTimeout(function() {
        scrollElement.scrollTop = scrollElement.scrollTop - perTick;
        scrollTo(duration - 10);
      }, 10);
    };

    scrollTo(600);
  }

  render() {
    const { cityStore } = this.props.appStore;
    const showScrollUpClass = this.state.showScrollUp ? 'search-scroll-up-show' : '';
    const isLoadingCities = cityStore.cities.length === 0;

    return <div className="search-container"
                onScroll={this.handleScroll}>
        <Button className={'search-scroll-up ' + showScrollUpClass}
          onClick={this.scrollUpClickHandler}>
          בחזרה למעלה
        </Button>
        <Filter />
        <div className="search-results-wrapper">
          <SearchResults
            isReady={!isLoadingCities}
            retryLink={<span>אנא <a href="/apartments">נסו שנית</a></span>}
            noResultsContent={
              <div className="search-results-not-found">
                <b className="search-results-not-found-title">הלוואי והייתה לנו דירה בדיוק כזו.</b><br />
                כנראה שהייתם ספציפיים מדי - לא נמצאו דירות לחיפוש זה.<br />
                נסו לשנות את הגדרות החיפוש
              </div>
            }
          />
        </div>
      </div>;
  }
}

Search.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Search;
