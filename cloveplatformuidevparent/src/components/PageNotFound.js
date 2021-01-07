import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { logout } from './Header';

import logo from '../images/logo.svg';

function PageNotFound() {
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

            <div id="main" className="myw-content flex-column flex-fill text-center mt-5">
                <h5>We're sorry, the page you requested could not be found in our server. Please try logging in again.</h5>
                <a onClick={logout} href="/mywizardplatform/" style={{ textDecoration: "none" }}>
                    <span className="btn btn-primary">Login</span>
                </a>
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

export default withRouter(PageNotFound);