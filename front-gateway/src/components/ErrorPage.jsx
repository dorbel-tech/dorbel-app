import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('router') @observer
class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.error400 = props.errorId < 500;
  }

  getErrorTitle() {
    return  this.error400 ? 'שגיאה ' + this.props.errorId + ' - העמוד לא נמצא' :
      'שגיאה ' + this.props.errorId + ' (שם לא רע לשגיאה)';
  }
  getErrorImage() {
    let errImageUrl = 'https://static.dorbel.com/images/errors/';
    let errImageFile =  this.error400 ? '400-error.png' : '500-error.png';
    return errImageUrl + errImageFile;
  }
  render() {
    return (
      <div className="error-page">
        <h2>{this.getErrorTitle()}</h2>

        {this.error400 ? (
          <p>אופס.. לעמוד שחיפשתם אין בית. נסו לחזור <a href="/"> לעמוד הראשי</a> ולנסות שוב.</p>
        ) : (
          <p>אופס- היתה טעות כלשהי, אך אין באפשרותנו להיות יותר ספציפיים עד שנבין מה היתה הבעיה.<br/>
          בינתיים, אתם יכולים לחזור <a href="/">לעמוד הראשי</a> או ליצור איתנו קשר בכפתור למעלה.</p>
        )}

        <br />
        <img src={this.getErrorImage()} />
      </div>
    );
  }
}

ErrorPage.wrappedComponent.propTypes = {
  errorId: PropTypes.number
};

export default ErrorPage;
