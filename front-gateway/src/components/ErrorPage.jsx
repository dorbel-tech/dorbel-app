import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer(['router'])
class ErrorPage extends Component {
  constructor(props) {
    super(props);
  }

  getErrorTitle() {
    if (this.props.errorId < 500) {
      return 'שגיאה ' + this.props.errorId + ' - העמוד לא נמצא';
    } else if (this.props.errorId >= 500) {
      return 'שגיאה ' + this.props.errorId + ' (שם לא רע לשגיאה)';
    }  
  }
  getErrorUrl() {
    if (this.props.errorId < 500) {
      return 'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/errors/400-error.png';
    } else if (this.props.errorId >= 500) {
      return 'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/errors/500-error.png';
    }
  }
  render() {
    return (
      <div className="error-page">
        <h2>{this.getErrorTitle()}</h2>

        {this.props.errorId < 500 &&
          <p>אופס.. לעמוד שחיפשתם אין בית. נסו לחזור <a href="/"> לעמוד הראשי</a> ולנסות שוב.</p>
        }
        {this.props.errorId >= 500 &&
          <p>אופס- היתה טעות כלשהי, אך אין באפשרותנו להיות יותר ספציפיים עד שנבין מה היתה הבעיה.<br/>
          בינתיים, אתם יכולים לחזור <a href="/">לעמוד הראשי</a> או ליצור איתנו קשר בכפתור למעלה.</p>
        }
        
        <br />
        <img src={this.getErrorUrl()} />
      </div>
    );
  }
}

ErrorPage.wrappedComponent.propTypes = {
  errorId: React.PropTypes.string
};

export default ErrorPage;
