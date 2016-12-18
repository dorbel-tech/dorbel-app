import React from 'react';
import { Modal } from 'react-bootstrap';

class OHERegisterModal extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const ohe = this.props.ohe;
    if (!ohe) { return null; }

    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>אנו שמחים שבחרתם להגיע לביקור בנכס :)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row ">
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 modal-date ">
              <svg className="pull-left">
                <use xlinkHref="assets/svg/images.svg#dorbel_icon_calendar"></use>
              </svg>
              <div className="pull-left">
                <span>&nbsp</span>
                <span className="hidden-xs">תאריך:</span>
                <span>16/5/15</span>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 modal-time">
              <svg className="pull-left">
                <use xlinkHref="assets/svg/images.svg#dorbel_icon_clock"></use>
              </svg>
              <div className="pull-left">
                <span>&nbsp</span>
                <span className="hidden-xs">שעה:</span>
                <span>18:00 - 19:30</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 ">
              <p>
                  לאישור ההגעה לדירה ולקבלת הכתובת המדויקת אנא התחברו על מנת שנדע למי לצפות.
              </p>
            </div>
            <div className="col-md-6 modal-reassurance">
              <p>
                פרטיותכם יקרה לנו! לא יעשה כל שימוש אחר בפרטיכם. אנו מבקשים פרטי קשר על מנת שנוכל לעדכן על שינויים במידת הצורך.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <a className="btn btn-block dorbel-rtl btn-social btn-facebook" data-toggle="modal" data-target="#modal-signup-facebook">
                <i className="fa fa-facebook"></i> הרשמו עם פייסבוק
              </a>
            </div>
            <div className="col-md-6">
              <a className="btn btn-block btn-default dorbel-rtl" data-toggle="modal" data-target="#modal-signup-email">
                <i className="fa fa-envelope-o">&nbsp</i> הרשם באמצעות מייל
              </a>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            לשאלות נוספות ויצירת קשר בנוגע לדירה שלחו לנו מייל: <a href="mailto:homesupport@dorbel.com?Subject=Hello%20again" target="_top">homesupport@dorbel.com</a>
          </div>
          <div className="text-center">
            בהרשמה לביקור בנכס, אני מסכים/ה <a href="#" target="_blank">לתנאי השירות</a>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

OHERegisterModal.propTypes = {
  ohe: React.PropTypes.object,
  onClose: React.PropTypes.func
};

export default OHERegisterModal;
