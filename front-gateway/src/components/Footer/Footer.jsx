import React from 'react';
import './Footer.scss';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-4 social-footer-container">
              <h5>עקבו אחרינו</h5>
              <ul>
                <li>
                  <a href="" className="fa fa-3x fa-linkedin-square"></a>
                </li>
                <li>
                  <a href="" className="fa fa-3x fa-twitter-square"></a>
                </li>
                <li>
                  <a href="" className="fa fa-3x fa-instagram"></a>
                </li>
                <li>
                  <a href="" className="fa fa-3x fa-facebook-square"></a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-lg-offset-4 col-sm-7 col-sm-offset-1">
              <h5>לינקים</h5>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <ul className="list-group">
                    <li className="list-group-item"><a href="">מי אנחנו</a></li>
                    <li className="list-group-item"><a href="">הסכם פרטיות</a></li>
                    <li className="list-group-item"><a href="">דירות נוספות</a></li>
                  </ul>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <ul className="list-group">
                    <li className="list-group-item"><a href="">צור קשר</a></li>
                    <li className="list-group-item"><a href="">שתף והזמן חברים</a></li>
                    <li className="list-group-item"><a href="">קריירה</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row rights-reserved-container">
            <div className="col-md-4">
              <a href="">
                <svg>
                  <use xlinkHref="#dorbel_logo"></use>
                </svg>
              </a>
            </div>
            <div className="col-md-4">
              <div dir="ltr" className="text-center rights-reserved">dorbel Ltd 2015. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
