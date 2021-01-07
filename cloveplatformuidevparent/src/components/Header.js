import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { getCookie } from '../helpers/Local/Cookies';
import { cookies } from '../helpers/Local/Cookies';
import history from '../helpers/RouteHelpers/History';

import logo from '../images/logo.svg';

export const logout = () => {
    cookies.set("IsAuthenticated", false);
    cookies.set("AuthToken", "");
    cookies.set("username", "");
    cookies.set("userrole", "");
	cookies.set("NavgSelection", "");
    history.push('/');
}

const Header = () => (
    <Fragment>
        <header className="myw-app-header myw-container myw-inner d-flex">
            <div className="myw-brand d-flex align-items-end">
                <img src={logo} alt='accenture' />
                <span style={{ margin: "0rem", top: "0.7rem" }}></span>
                <h4><span style={{ color: "#000088", fontWeight: "bold", margin: "0rem", top: "0.7rem" }} className="myw-app-name d-flex align-items-center">myWizard<sup>&reg;</sup>&nbsp;DevOps</span></h4>
            </div>
            <div className="myw-header-nav d-flex justify-content-end">
                <p>({getCookie('username')}) <span><a onClick={logout} href="/mywizardplatform/">Sign Out</a></span></p>
            </div>
        </header>
    </Fragment>
);

export default withRouter(Header);