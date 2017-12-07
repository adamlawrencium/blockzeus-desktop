import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = { data: {} }

  componentDidMount() {
    // fetch('/poloniexData/ticker')
    //   .then(res => res.json())
    //   .then(users => this.setState({ users }));

    fetch('/poloniexData/ticker')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ data });
      });
    
    // console.log(res.json());
  }

  render() {

    return (
      <div className="App">
        <h1>Users</h1>
        <div><pre>{JSON.stringify(this.state.data, null, 2) }</pre></div>
        {/* {this.state.data} */}
        {/* {this.state.data.map(pair =>
          <div key={pair}>{pair}</div>
        )} */}
      </div>
    );
  }
}

export default App;
