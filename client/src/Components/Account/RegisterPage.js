import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../../_helpers';
import { userActions, alertActions } from '../../_actions';

import Navbar from '../Site/Navbar';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    // clear alert on location change
    const { dispatch } = this.props;
    history.listen((location, action) => {
      dispatch(alertActions.clear());
    });

    this.state = {
      user: {
        // firstName: '',
        // lastName: '',
        email: '',
        password: '',
        confirm: '',
      },
      submitted: false,
      passwordValid: false,
      passwordsMatch: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handlePassChange = this.handlePassChange.bind(this);
    // this.handleConfirmPassChange = this.handleConfirmPassChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
  }

  // handlePassChange(event) {
  //   const { name, value } = event.target;
  //   const { user } = this.state;
  //   this.setState({
  //     user: {
  //       ...user,
  //       [name]: value,
  //     },
  //   }, () => { this.passwordValid(); });
  // }

  // handleConfirmPassChange(event) {
  //   const { name, value } = event.target;
  //   const { user } = this.state;
  //   this.setState({
  //     user: {
  //       ...user,
  //       [name]: value,
  //     },
  //   }, () => { this.passwordsMatch(); });
  // }

  // passwordValid() {
  //   const { user } = this.state;
  //   if (user.password.length >= 8 && user.password.length <= 20) {
  //     this.setState({ passwordValid: true });
  //     return;
  //   }
  //   this.setState({ passwordValid: false });
  // }
  // passwordsMatch() {
  //   const { user } = this.state;
  //   if (user.password === user.confirm || user.confirm.length === 0) {
  //     this.setState({ passwordsMatch: true });
  //     return;
  //   }
  //   this.setState({ passwordsMatch: false });
  // }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });

    const { dispatch } = this.props;
    dispatch(alertActions.clear());

    const { user } = this.state;
    if (user.email && user.password && user.confirm) {
      console.log('all forms filled out');
      dispatch(userActions.register(user));
    } else {
      dispatch(alertActions.error('Please fill out all fields'));
      console.log('not all forms filled');
    }
  }

  render() {
    const { registering, alert } = this.props;
    // console.log(this.props);
    // console.log(this.state);
    const { user, submitted } = this.state;
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card card-body card-section panel" style={{ maxWidth: '520px' }} >
                <h2 className="card-title">Signup</h2>
                <hr />
                <form className="needs-validation" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="satoshi@example.com" required onChange={this.handleChange} />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                  </div>
                  {/* <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="first">First Name</label>
                        <input type="password" className="form-control" id="first" name="first" placeholder="Bob" onChange={this.handleChange} />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="last">Last Name</label>
                        <input type="password" className="form-control" id="last" name="last" placeholder="McGob" onChange={this.handleChange} />
                      </div>
                    </div>
                  </div> */}
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className={`form-control ${this.state.passwordValid ? 'is-valid' : ''}`} id="password" name="password" placeholder="8-20 characters" onChange={this.handleChange} />
                    <div className="valid-feedback">
                      Password looks good!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm">Confirm Password</label>
                    <input type="password" className={`form-control ${this.state.passwordsMatch ? '' : 'is-invalid'}`} id="confirm" name="confirm" placeholder="8-20 characters" onChange={this.handleChange} />
                    <div className="invalid-feedback">
                      Passwords must match!
                    </div>
                  </div>
                  {alert.message && (
                    <div className={`alert ${alert.type}`} role="alert">
                      {alert.message}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary">Signup</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { registering } = state.registration;
  const { alert } = state;
  return {
    registering,
    alert,
  };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export default connectedRegisterPage;
