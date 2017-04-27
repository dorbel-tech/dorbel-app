import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import DatePicker from '~/components/DatePicker/DatePicker';
import autobind from 'react-autobind';

class ManageLeaseModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  leaseStartChange(leaseStart) {
    this.newLeaseStart = leaseStart;
  }

  leaseEndChange(leaseEnd) {
    this.newLeaseEnd = leaseEnd;
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose(this.newLeaseStart, this.newLeaseEnd);
    }
  }

  render() {
    const { listing } = this.props;
    const modalBody = <div className="property-manage-modal-body">
        <div className="property-manage-modal-section-header">
          עדכנו את מועדי תחילת ותום השכירות
        </div>
        <div>
          <div className="property-manage-modal-picker-label">תחילת השכירות</div>
          <div className="property-manage-modal-picker-label">תום השכירות</div>
        </div>
        <div className="property-manage-modal-picker-container">
          <div className="property-manage-modal-start-picker-wrapper">
            <DatePicker value={listing.lease_start}
                        onChange={this.leaseStartChange}
                        calendarPlacement="bottom" />
          </div>
          <div className="property-manage-modal-end-picker-separator">-</div>
          <div className="property-manage-modal-end-picker-wrapper">
            <DatePicker value={listing.lease_end}
                        onChange={this.leaseEndChange}
                        calendarPlacement="bottom" />
          </div>
        </div>
      </div>;

    return (
      <DorbelModal
        show={this.props.show}
        onClose={this.close}
        title="עדכון תקופת שכירות"
        body={modalBody}
        confirmButton="עדכן פרטים"
        confirmStyle="success"
      />
    );
  }
}

ManageLeaseModal.propTypes = {
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  listing: React.PropTypes.object.isRequired
};

export default ManageLeaseModal;
