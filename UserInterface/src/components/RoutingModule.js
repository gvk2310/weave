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
import { cookies } from '../helpers/Local/Cookies';


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
            failCookie: '',
        };
        this.selectedId = '';
    }
    componentDidMount = () => {
        const uName = process.env.service_user;
        const uKey = process.env.service_key;
        const encrypteduserName = encryptionAlgorithm(uName);
        const encryptedKey = encryptionAlgorithm(uKey); 
        var myHeaders = new Headers();
        let data = {
            encoded_service_user: encrypteduserName,
            encoded_service_key: encryptedKey,
        }
        myHeaders.append('Content-Type', 'application/json');
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data),
        };
        fetch(`###REACT_APP_PLATFORM_URL###/access/token-auth`, requestOptions)
          .then(response => {
              if(response.status === 200){
                  this.setState({
                      authenticated: true,
                  })
              }
              else{
                  this.setState({
                      failCookie: "Token generation Failed"
                  })
              }
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
            : this.state.failCookie === '' ? "" : "Token Generation Failed"
        )
    }

}

export default connect(mapStateToProps, { setPipelineData })(RoutingModule)
