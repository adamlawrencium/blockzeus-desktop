import React, { Component } from 'react';
import Navbar from './Navbar';

class NotFound extends Component {
  render() {
    return (
      <div className="App" >
        <Navbar />
        <div className="container-fluid">

        <h1>404 Not Found</h1>
          
        </div>
      </div>
    );
  }
}

export default NotFound;
