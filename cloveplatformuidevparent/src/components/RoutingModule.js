/* eslint react/prop-types: 0 */
import React, { Suspense } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import history from '../helpers/RouteHelpers/History';
import NavigationBarParent from './NavigationBarParent';
import LoginContainer from '../containers/LoginContainer';
import PageNotFound from '../components/PageNotFound';
import AuthRoute from '../helpers/RouteHelpers/AuthRoute';
import { Buffer } from 'buffer';
import { getCookie } from '../helpers/Local/Cookies';

import loading from '../images/loading.gif';
import Header from "./Header";
import Footer from "./Footer";

const dynamicFederation = (scope, module) => {
    window[scope].override(
        Object.assign(
            {
                react: () => {
                    return Promise.resolve().then(() => {
                        return () => require('react');
                    });
                },
                'react-dom': () => {
                    return Promise.resolve().then(() => {
                        return () => require('react-dom');
                    });
                },
                'react-apollo': () => {
                    return Promise.resolve().then(() => {
                        return () => require('react-apollo');
                    });
                },
                'react-redux': () => {
                    return Promise.resolve().then(() => {
                        return () => require('react-redux');
                    });
                },
                'react-router-dom': () => {
                    return Promise.resolve().then(() => {
                        return () => require('react-router-dom');
                    });
                },
            },
        )
    );

    return window[scope].get(module).then((factory) => {
        const Module = factory();
        return Module;
    });
};

let Rolebuff, userRole;

const RemoteApp = React.lazy(() => dynamicFederation('mywizardplatform', 'App'));
const DevNetOpsApp = React.lazy(() => dynamicFederation('devnetopsui', 'App'));

const RoutingModule = ({ store, childprops }) => {

    if (getCookie("userrole") === undefined) {
        userRole = "";
    } else {
        Rolebuff = new Buffer(getCookie("userrole"), 'base64');
        userRole = Rolebuff.toString('ascii');
    }

    return (
        <Router history={history} basename="/">
            <div className="myw-wrap">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>
                    <Route path="/login">
                        <LoginContainer childprops={childprops} store={store} history={history} />
                    </Route>
                    <AuthRoute path="/devopstools" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/pipelinedetails" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/platformtools" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/customtools" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/manage" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/manage-pvc" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/ldapusers" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/platformstat" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/pipelinestat" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <RemoteApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>
                    <AuthRoute path="/devnetops" props={childprops} userRole={userRole}>
                        <Suspense fallback={<div className="centered"><img src={loading} alt="loading" /></div>}>
                            <Header store={store} />
                            <NavigationBarParent store={store} />
                            <DevNetOpsApp store={store} />
                            <Footer />
                        </Suspense>
                    </AuthRoute>

                    <Route component={PageNotFound} />
                </Switch>
            </div>

        </Router>
    )
}

export default RoutingModule;
