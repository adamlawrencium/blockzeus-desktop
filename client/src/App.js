import React, { Component } from 'react';
import DonutChart from './DonutChart';

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
        <div className="card" style={{ width: '20rem' }}>
          <img className="card-img-top" src="..." alt="Card image cap" />
          <div className="card-body">
            <h4 className="card-title">Card title</h4>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
        <br />
        <div><pre>{JSON.stringify(this.state.data, null, 2)}</pre></div>
      </div>
    );
  }
}

export default App;
