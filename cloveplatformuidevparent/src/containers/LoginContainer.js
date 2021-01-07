import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { cookies } from '../helpers/Local/Cookies';
import { setUserRole } from '../store/Actions/User';
import axios from 'axios';
import { Buffer } from 'buffer';

import logo from '../images/logo.svg';

class LoginContainer extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        }
    }

    onchange = (event) => {
        document.getElementById('invalid').style.display = 'none';
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onsubmit = (event) => {
        if (this.state.username === "" || this.state.password === "") {
            event.preventDefault();
            document.getElementById('invalid').style.display = 'block';
        } else {
            event.preventDefault();
            let PwdBuff = new Buffer(this.state.password);
            let base64Pwd = PwdBuff.toString('base64');
            axios.post('https://platformdemo.gvsmb.com/gqlapi/login', { username: this.state.username, password: base64Pwd }).then(response => {
            if (response.data.status === 0) {
                    cookies.set("userrole", response.data.Role)
                    cookies.set("IsAuthenticated", true);
                    cookies.set("username", this.state.username);
                    cookies.set("AuthToken", response.data.Token);
                    cookies.set("NavgSelection", "DevOps Hub");
                    this.props.childprops.userHasAuthenticated(cookies.get("IsAuthenticated"));
                    this.props.setUserRole(cookies.get("userrole"));
                    this.props.history.push({
                        pathname: '/devopstools'
                    });
                }
                else document.getElementById('invalid').style.display = 'block';
            })
        }
    }

    render() {
        return (
            <Fragment>
                <header className="myw-app-header myw-container myw-inner d-flex">
                    <div className="myw-brand d-flex align-items-end">
                        <img src={logo} alt='accenture' style={{ maxHeight: "1.8rem" }} />
                        <span style={{ margin: "0rem", top: "0.7rem" }}></span>
                        <h4><span style={{ color: "#000088", fontWeight: "bold", margin: "0rem", top: "0.7rem" }} className="myw-app-name d-flex align-items-center">myWizard<sup>&reg;</sup>&nbsp;DevOps</span></h4>
                    </div>
                </header>
                <div className="myw-topbar">
                    <div className="myw-inner myw-container d-flex flex-wrap">
                        <span className="myw-app-name d-flex align-items-center" style={{textDecoration: "none"}}>myWizard<sup>&reg;</sup>&nbsp;DevOps - Dedicated</span>
                        <span className="version-text d-flex justify-content-end">v4.1</span>
                    </div>
                </div>

                <div id="main" className="myw-content d-flex flex-column flex-fill devops-landing">
                    <div className="row my-4">
                        <div className="col-12 col-md-6 col-lg-5 col-xl-4">
                            <form onSubmit={this.onsubmit}>
                                <div className="form-group mb-5">
                                    <label className="mb-0">Username</label>
                                    <input type="text" className="form-control" id="username" name="username" onChange={this.onchange} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label className="mb-0">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" onChange={this.onchange} />
                                </div>
                                <p id="invalid">Invalid Credentials! Please try Again</p>
                                <button className="btn btn-primary devops-login-btn my-4">Login</button>
                                <p className="devops-login-desc">Login to jumpstart your new DevXOps experience. Deliver SMART.</p>
                            </form>
                        </div>
                    </div>
                </div>

                <footer className="myw-footer">
                    <div className="myw-inner myw-container">
                        Copyright &copy; 2001-2020 Accenture. All rights reserved. Accenture Confidential. For internal use only.
                    <a href="##">Terms of Use</a>
                        <a href="##">Privacy Statement</a>
                    </div>
                </footer>
            </Fragment>
        )
    }
}

export default connect(null,
    { setUserRole })(withRouter(LoginContainer));