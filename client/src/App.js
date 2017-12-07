import React, { Component } from 'react';
import Navbar from './Navbar';
import DonutChart from './DonutChart';
import PortfolioLineChart from './PortfolioLineChart';
import HoldingsTiles from './HoldingsTiles';
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
  state = {
    data: {},
    holdings: {}
  }

  componentDidMount() {
    fetch('/poloniexData/ticker')
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        this.setState({ data });
      });
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <br />
          <div className="row">
            <div className="col-5">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Digital Asset Holdings</h4>
                  <DonutChart />
                </div>
              </div>
            </div>
            <div className="col-7">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Portfolio Performance</h4>
                  <PortfolioLineChart />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <HoldingsTiles />
        </div>
        <br />
      </div>
    );
  }
}

export default App;
