import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import NavLink from '~/components/NavLink';
import SearchResults from '~/components/Search/SearchResults';
import { SEARCH_PREFIX } from '~/routesHelper';

import './MyLikes.scss';

// TODO: Add infinite scrolling support as introduced in Search.jsx to load more items.
@inject('appStore', 'appProviders') @observer
class MyLikes extends Component {
  constructor(props) {
    super(props);

    this.props.appProviders.searchProvider.search({
      'city': '*',
      'liked': true
    });
  }

  render() {
    return (
      <div className="my-likes-container">
        <SearchResults
          title={ <p className="my-likes-title">דירות שאהבתי</p> }
          thumbnailProps={ { openInNewWindow: true } }
          noResultsContent={
            <div className="my-likes-empty">
              <div className="my-likes-text"><b>טרם שמרתם דירות שאהבתם. </b><br/><br/>
                היכנסו <NavLink to={SEARCH_PREFIX}>לעמוד החיפוש</NavLink> וסמנו את הדירות שאהבתם בכדי לחזור אליהן בקלות בהמשך.</div>
            </div>
          }
        />
      </div>
    );
  }
}

MyLikes.wrappedComponent.propTypes = {
  appStore: PropTypes.object.isRequired,
  appProviders: PropTypes.object.isRequired
};

export default MyLikes;
