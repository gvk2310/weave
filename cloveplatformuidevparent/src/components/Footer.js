import React, { Fragment } from 'react';
import { logout } from './Header';

const Footer = () => (
    <Fragment>
        <footer className="myw-footer">
            <div className="myw-inner myw-container">
                Copyright &copy; 2001-2020 Accenture. All rights reserved. Accenture Confidential. For internal use only.
                <a href="##">Terms of Use</a>
                <a href="##">Privacy Statement</a>
            </div>
        </footer>
        <div className="modal" id="expire" tabIndex="-1" role="dialog">
            <div className="modal-backdrop show"></div>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="text-center">
                            <h5>Your session has been expired. Please Login again. </h5>
                            <a onClick={logout} href="/mywizardplatform/" style={{ textDecoration: "none" }}>
                                <span className="btn btn-primary">Login</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
);

export default Footer;