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
  }

  componentWillMount() {
    const { listing } = this.props;

    this.state = {
      leaseStart: moment(listing.lease_start),
      leaseEnd: moment(listing.lease_end)
    };
  }

  leaseStartChange(newLeaseStart) {
    this.setState({
      leaseStart: newLeaseStart,
      leaseEnd: moment(newLeaseStart).add(1, 'year')
    });
  }

  leaseEndChange(newLeaseEnd) {
    this.setState({leaseEnd: newLeaseEnd});
  }

  submit() {
    this.close(true);
  }

  close(submit) {
    if (this.props.onClose) {
      if (submit) {
        this.props.onClose(this.state.leaseStart, this.state.leaseEnd);
      } else {
        this.props.onClose();
      }
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
          <div className="property-manage-modal-start-picker-wrapper">
            <DatePicker value={leaseStartValue}
                        onChange={this.leaseStartChange}
                        calendarPlacement="bottom" />
          </div>
          <div className="property-manage-modal-end-picker-separator">-</div>
          <div className="property-manage-modal-end-picker-wrapper">
            <DatePicker value={leaseEndValue}
                        onChange={this.leaseEndChange}
                        calendarPlacement="bottom" />
          </div>
        </div>
        <Button onClick={this.submit} bsStyle={'success'}
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
