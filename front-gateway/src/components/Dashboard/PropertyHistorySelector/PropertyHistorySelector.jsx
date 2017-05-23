import React from 'react';
import { inject, observer } from 'mobx-react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

@inject('appStore', 'appProviders', 'router') @observer
export default class PropertyHistorySelector extends React.Component {
  componentDidMount() {
    // this.props.appProviders.listingsProvider.loadListingsForApartment(this.props.apartment_id);
  }

  render() {
    // const disabled = false;
    // const title = 'טוען...';
    const title = 'תקופה נוכחית';

    return (
      <DropdownButton bsSize="small" block bsStyle="default" id="property-history-selector" title={title}>
        <MenuItem eventKey="1">Action</MenuItem>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3" active>Active Item</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Separated link</MenuItem>
      </DropdownButton>
    );
  }
}
