import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="index.html"><h1 className="text-hide dorbel-logo">dorbel</h1></a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
              <form className="navbar-form navbar-right">
                <a className="btn btn-success" href="owner-signup.html" role="button">השכר נכס בבעלותך</a>
              </form>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;



