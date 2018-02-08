import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="page-footer blue center-on-small-only">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <br />
              {/* <h5 className="title">BlockZeus</h5> */}
              <div className="blockzeus-comment">BlockZeus is currently in beta! Please leave feedback here.</div>
            </div>
            <div className="col-md-6">
              <br />
              <h5 className="title">More</h5>
              <a href="#!">Roadmap</a><br />
              <a href="#!">Contact</a><br />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <div className="container-fluid">
            © 2018 BlockZeus Technologies
            <br />
            <br />
          </div>
        </div>
        {/* /.Copyright */}
      </footer>
    );
  }
}

export default Footer;
