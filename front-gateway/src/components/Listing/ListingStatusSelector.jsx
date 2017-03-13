import React from 'react';
import { MenuItem, Nav, NavDropdown } from 'react-bootstrap';
import utils from '../../providers/utils';

const listingStatusLabels = utils.getListingStatusLabels();

class ListingStatusSelector extends React.Component {
  render() {
    const { listing } = this.props;
    const currentStatus = listingStatusLabels[listing.status].label;
    const options = _.get(listing, 'meta.possibleStatuses') || [];

    return (
      <Nav bsStyle="tabs" className="listing-menu-status-selector" onSelect={this.changeStatus} pullLeft>
        <NavDropdown title={currentStatus} id="nav-dropdown" disabled={options.length === 0}>
          {options.map(status => <MenuItem id={status} key={status} eventKey={status}>{listingStatusLabels[status].actionLabel}</MenuItem>)}
        </NavDropdown>
      </Nav>
    );
  }
}

ListingStatusSelector.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingStatusSelector;
