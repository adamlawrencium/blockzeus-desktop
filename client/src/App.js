import React, { Component } from 'react';
import DonutChart from './DonutChart';
import Tile from './Tile'

import { Container, Row, Col } from 'reactstrap';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';

// import Button from 'material-ui/Button';
// import Card from 'material-ui/Card';


import './App.css';

class App extends Component {
  state = { data: {} }

  componentDidMount() {
    fetch('/poloniexData/ticker')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ data });
      });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
          <a className="navbar-brand" href="#">BlockZeus</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-item nav-link active" href="#">Home <span className="sr-only">(current)</span></a>
              <a className="nav-item nav-link" href="#">Features</a>
              <a className="nav-item nav-link" href="#">Pricing</a>
            </div>
          </div>
        </nav>
        <div className="container">
          <br />
          <div className="row">
            <div className="col-5">
              <DonutChart />
            </div>
            <div className="col-7">
              <DonutChart />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col">
              <Tile />
            </div>
            <div className="col-6">
              <Tile />
            </div>
            <div className="col">
              <Tile />
            </div>
          </div>
        </div>
        <br />
        <div><pre>{JSON.stringify(this.state.data, null, 2)}</pre></div>
      </div>
    );
  }
}

export default App;
