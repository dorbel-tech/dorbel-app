import React from 'react';
import { Button } from 'react-bootstrap';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import DatePicker from '~/components/DatePicker/DatePicker';
import autobind from 'react-autobind';
import moment from 'moment';

class ManageLeaseModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { listing, show } = nextProps;

    if (show && !this.props.show) {
      this.setState({
        leaseStart: moment(listing.lease_start),
        leaseEnd: moment(listing.lease_end)
      });
    }
  }

  leaseStartChange(newLeaseStart) {
    this.setState({
      leaseStart: moment.utc(newLeaseStart),
      leaseEnd: moment.utc(newLeaseStart).add(1, 'year')
    });
  }

  leaseEndChange(newLeaseEnd) {
    this.setState({ leaseEnd: moment.utc(newLeaseEnd) });
  }

  confirmClickHandler() {
    this.close(true);
  }

  close(confirm) {
    if (this.props.onClose) {
      this.props.onClose(confirm, this.state.leaseStart, this.state.leaseEnd);
    }
  }

  render() {
    const leaseStartValue = moment(this.state.leaseStart).format();
    const leaseEndValue = moment(this.state.leaseEnd).format();

    const periodValid = this.state.leaseStart < this.state.leaseEnd;
    const invalidTitle = periodValid ? '' : 'תאריך תום השכירות חייב להיות מאוחר מתאריך תחילת השכירות';

    const modalBody = <div className="property-manage-modal-body">
      <div className="property-manage-modal-section-header">
        עדכנו את מועדי תחילת ותום השכירות
      </div>
      <div>
        <div className="property-manage-modal-picker-label">תחילת השכירות</div>
        <div className="property-manage-modal-picker-label">תום השכירות</div>
      </div>
      <div className="property-manage-modal-picker-container">
        <div className="property-manage-modal-start-picker-fake-container"
          ref={(el) => { this.leaseStartContainer = el; }} />
        <div className="property-manage-modal-start-picker-wrapper">
          <DatePicker value={leaseStartValue}
            onChange={this.leaseStartChange}
            calendarContainer={this.leaseStartContainer} />
        </div>
        <div className="property-manage-modal-end-picker-separator">-</div>
        <div className="property-manage-modal-end-picker-wrapper">
          <DatePicker value={leaseEndValue}
            onChange={this.leaseEndChange} />
        </div>
      </div>
      <Button onClick={this.confirmClickHandler} bsStyle={'success'}
        block disabled={!periodValid}
        title={invalidTitle}>
        עדכן פרטים
      </Button>
    </div>;

    return (
      <DorbelModal
        show={this.props.show}
        onClose={this.close}
        title="עדכון תקופת שכירות"
        body={modalBody}
        modalSize="small"
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
