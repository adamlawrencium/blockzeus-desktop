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
        <DonutChart />
        <div className="container">
          <div className="row">
            <div className="col-lg">
              <Tile />
            </div>
            <div className="col-lg">
              <Tile />
            </div>
            <div className="col-lg">
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
