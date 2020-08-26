import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './myWizStyle.css';
import './common.css';
import * as serviceWorker from './serviceWorker';
import PrivateRoute from './PrivateRoute'
import App from './LoginPages/App';
import { Provider } from "react-redux";
import store from "./store/store";
import UploadScreen from './LoginPages/UploadScreen';
import Login from './LoginPages/Login'
import { 
  BrowserRouter as Router, 
  Route, 
  Link, 
  Switch 
} from 'react-router-dom';
import Header from './LoginPages/Header'
import User from './PageComponents/User'
import Role from './PageComponents/Role'
import Services from './PageComponents/Services'
import Ecosystem from './Ecosystem/Deployment'
import deployNow from './Ecosystem/deployNow'
import Status from './Ecosystem/Status'
import Scheduling from './Ecosystem/Scheduling'
import Reports from './Monitoring/Reports'
import NetworkTopology from './Monitoring/NetworkTopology'
import Asset from './Onboarding/Asset'
import Infra from './Onboarding/Infra'
import Repository from './Onboarding/Repository'
import Execute from './Testing/Execute'
import Report from './Testing/Reports'
import TestCases from './Testing/TestCases'
import LoginPage from './LoginPages/LoginPage'
import MyWizFooter from './LoginPages/myWizFooter'
import MyWizHeader from './LoginPages/myWizHeader'
import HealthCheck from './Monitor/HealthCheck'
import Regulate from './Security/Regulate'
import VirusScan from './Security/VirusScan'


ReactDOM.render(
  <Provider store={store}>

    <Router>

    {/* <MyWizFooter/> */} 
      {/* <Route exact path = "/UXDesign" component={UXDesign} /> */}
        {/* <Route path = "/" component={Header} />  */}
          
        {/* <Route path = "/login" component={Login} />          */}
        <Route path = "/" component={MyWizHeader} />
         <Route path = "/login" component={LoginPage} /> 
         <PrivateRoute exact path = "/uploadScreen" component = {UploadScreen} />
         <PrivateRoute exact path = "/UserMgmt/User" component = {User} />
         <PrivateRoute exact path = "/UserMgmt/Role" component = {Role} />
         <PrivateRoute exact path = "/UserMgmt/Services" component = {Services} />
         <PrivateRoute exact path = "/Onboarding/Repository" component = {Repository} />
         <PrivateRoute exact path = "/Onboarding/Infra" component = {Infra} />
         <PrivateRoute exact path = "/Onboarding/Asset" component = {Asset} />
         <PrivateRoute exact path = "/Ecosystem/Deployment" component = {Ecosystem} />
         <PrivateRoute exact path = "/Ecosystem/Status" component = {Status} />
         <PrivateRoute exact path = "/Ecosystem/Scheduling" component = {Scheduling} />
         <PrivateRoute exact path = "/Testing/TestCases" component = {TestCases} />
         <PrivateRoute exact path = "/Testing/Execute" component = {Execute} />
         <PrivateRoute exact path = "/Testing/Reports" component = {Report} />
         <PrivateRoute exact path = "/Monitoring/Reports" component = {Reports} />
         <PrivateRoute exact path = "/Monitoring/NetworkTopology" component = {NetworkTopology} />
         <PrivateRoute exact path = "/Monitor/Check" component = {HealthCheck} />
         <PrivateRoute exact path = "/Security/Regulate" component = {Regulate} />
         <PrivateRoute exact path = "/Security/Scan" component = {VirusScan} />
         <PrivateRoute exact path = "/userManagement" component = {User} />
         <PrivateRoute exact path = "/Ecosystem/Deployment/deployNow" component = {deployNow} />
         <Route path = "/" component={MyWizFooter} /> 
         {/* <Route path = "/contact" component = {Contact} /> */}
      
       
   </Router>
     
  </Provider>
,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
