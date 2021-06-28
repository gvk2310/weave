import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavigationBar from "./NavigationBar";
import '../css/devnetops.css';
import '../css/style.css';
import { setPipelineData } from '../store/Actions/Tools';
import Overview from '../containers/overview/Overview';
import User from '../containers/access/user';
import Role from '../containers/access/role';
import Services from '../containers/access/services';
//import Project from '../containers/access/project';
import Project from '../containers/project/project';

import Deployment from '../containers/deployment/deployment';
// import Status from '../containers/deployment/status';

import Repository from '../containers/onboard/repository';
import Infra from '../containers/onboard/infra';
import Asset from '../containers/onboard/asset';
import Test from '../containers/onboard/test';
import { encryptionAlgorithm, decryptionAlgorithm, Base64EncodeUrl, Base64DecodeUrl } from '../helpers/helperFunction'


const mapStateToProps = (state) => {
    return {
        cartridgeDetails: state.CartridgeDetails.cartridgedetails
    }
}

class RoutingModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
        };
        this.selectedId = '';
    }
    componentDidMount = () => {
        const uName = process.env.service_user;
        const uKey = process.env.service_key;
        console.log("uName ",uName);
        console.log("uKey ",uKey);

        const encrypteduserName = encryptionAlgorithm(uName);
        const encryptedKey = encryptionAlgorithm(uKey);

        console.log("en user", encrypteduserName);
        console.log("en key", encryptedKey);
        var myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');
        var requestOptions = {
          method: 'GET',
          headers: myHeaders
        };
        fetch(`###REACT_APP_PLATFORM_URL###/access/token-auth/${encrypteduserName}/${encryptedKey}`, requestOptions)
          .then(response => {
              if(response.status === 200){
                  this.setState({
                      authenticated: true,
                  })
              }
            console.log("response of 1st call", response);
          })
          .catch(error => console.log('error', error));
      };
    render() {
        return (
            this.state.authenticated ?
            <Router basename="/devnetops/">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/home" />
                    </Route>
                    <Route path="/home">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Overview />

                            </div>
                        </div>
                    </Route>
                    <Route exact path="/onboarding/repository">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Repository />
                            </div>
                        </div>
                    </Route>

                    <Route exact path="/onboarding/infra">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Infra />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/onboarding/asset">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Asset />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/onboarding/test">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Test />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/deploy/deployment">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Deployment />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/access/user">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <User />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/access/role">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Role />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/access/service">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Services />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/project/project">
                        <div id="main" className="myw-content d-flex flex-column flex-fill">
                            <div className="row flex-fill no-gutters">
                                <NavigationBar />
                                <Project />
                            </div>
                        </div>
                    </Route >


                </Switch >
            </Router >
            : "Not Authenticated"
        )
    }

}

export default connect(mapStateToProps, { setPipelineData })(RoutingModule)