import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  render() {
    return <div>Hello World</div>;
  }
}

if(typeof window !== 'undefined') {
  render(<App />, document.getElementById('root'));
}
