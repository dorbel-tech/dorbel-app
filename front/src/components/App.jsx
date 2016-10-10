import React, { Component } from 'react';
import NavLink from './NavLink';
import { observer } from 'mobx-react';

@observer
class App extends Component {
  render() {
    return (
      <div>
        <NavLink to="/" onlyActiveOnIndex={true}><h1>dorbel</h1></NavLink>
        <ul role="nav">
          <li><NavLink to="/apartments">Apartments</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
