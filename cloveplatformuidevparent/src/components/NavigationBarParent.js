import React, { Fragment, Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Buffer } from 'buffer';
import { cookies, getCookie } from '../helpers/Local/Cookies';

class NavigationBarParent extends Component {
    constructor() {
        super();
        this.events = [
            "load",
            "mousemove",
            "mousedown",
            "click",
            "scroll",
            "keypress"
        ];
        this.warn = this.warn.bind(this);
        this.resetTimeout = this.resetTimeout.bind(this);

        for (var i in this.events) {
            window.addEventListener(this.events[i], this.resetTimeout);
        }
        this.setTimeout();
    }

    clearTimeout = () => {
        if (this.warnTimeout) clearTimeout(this.warnTimeout);
    }

    setTimeout= () => {
        this.warnTimeout = setTimeout(this.warn, 60 * 60 * 1000);
    }

    resetTimeout = () => {
        this.clearTimeout();
        this.setTimeout();
    }

    warn = () => {
        cookies.set("IsAuthenticated", false);
        cookies.set("AuthToken", "");
        cookies.set("username", "");
        cookies.set("userrole", "");
        document.getElementById("expire").style.display = "block"
    }

    changeNavgSelection = (e, tabName) => {
        cookies.set("NavgSelection", tabName);
    }

    render() {
        let navglist = ["DevOps Hub", "Manage Platform", "Platform Statistics", "Pipeline Statistics", "DevNetOps"];
        let navgurl = ["/devopstools", "/manage", "/platformstat", "/pipelinestat", "/devnetops"];

        let navglistarr = [], navgurlarr = []
        let Rolebuff = new Buffer(cookies.get("userrole"), 'base64');
        let userRole = Rolebuff.toString('ascii');

        if (userRole === "admin") {
            navglistarr = navglist;
            navgurlarr = navgurl;
        } else {
            navglistarr = navglist.filter(element => element !== "Manage Platform");
            navgurlarr = navgurl.filter(element => element !== "/manage");
        }

        return (
            <Fragment>
                <div className="myw-topbar">
                    <div className="myw-inner myw-container d-flex flex-wrap">
                        <span className="myw-app-name d-flex align-items-center" style={{ textDecoration: "none" }}>myWizard<sup>&reg;</sup>&nbsp;DevOps - Dedicated</span>
                        <span className="version-text d-flex justify-content-end">v4.1</span>
                    </div>
                </div>
                <div className="myw-navbar">
                    <div className="myw-inner myw-container d-flex flex-wrap">
                        <div className="nav nav-tabs">
                            {
                                navglistarr.map((navitem, index) => (
                                    <React.Fragment key={index}>
                                        {(getCookie('NavgSelection') === navitem) ?
                                            <NavLink className="nav-item nav-link active" onClick={(e) => this.changeNavgSelection(e, navitem)}
                                                to={navgurlarr[index]}>
                                                {navglistarr[index]}
                                            </NavLink>
                                            :
                                            <NavLink className="nav-item nav-link" onClick={(e) => this.changeNavgSelection(e, navitem)}
                                                to={navgurlarr[index]}>
                                                {navglistarr[index]}
                                            </NavLink>
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(NavigationBarParent)
