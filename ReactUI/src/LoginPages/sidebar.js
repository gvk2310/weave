import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import {Link} from 'react-router-dom';
import './Login.css'
import '../common.css'

export default props => {
  return (
    <Menu>
      <Link className="menu-item" to="/uploadScreen" >Overview</Link>
      {/* //<Link className="menu-item" to="/userManagement" >User Management</Link> */}
      
      
      <div className="accordion" id="accordionLeftNav">
      <div className="menu-item" data-toggle="collapse" data-target="#Usermanagement" aria-expanded="false" aria-controls="collapseExample">User Management<i className="arrow down"></i></div>
        <div className="collapse expand" id="Usermanagement" data-parent="#accordionLeftNav" >
        <Link className="menu-item sub-menu" to="/UserMgmt/User" >User</Link><br/>
        <Link className="menu-item sub-menu" to="/UserMgmt/Role" >Role</Link><br/>
        <Link className="menu-item sub-menu" to="/UserMgmt/Services" >Services</Link><br/>
        </div>
        <div className="menu-item" data-toggle="collapse" data-target="#Onboarding" aria-expanded="false" aria-controls="collapseExample">Onboarding<i className="arrow down"></i></div>
        <div className="collapse expand" id="Onboarding" data-parent="#accordionLeftNav" >
        <Link className="menu-item sub-menu" to="/Onboarding/Repository" >Repository</Link><br/>
        <Link className="menu-item sub-menu" to="/Onboarding/Infra" >Infra</Link><br/>
        <Link className="menu-item sub-menu" to="/Onboarding/Asset" >Asset</Link><br/>
        </div>
        <div className="menu-item" data-toggle="collapse" data-target="#Ecosystem" aria-expanded="false" aria-controls="collapseExample">Ecosystem<i className="arrow down"></i></div>
        <div className="collapse expand" id="Ecosystem" data-parent="#accordionLeftNav">
        {/* <Link className="menu-item">Ecosystem</Link> */}
        <Link className="menu-item sub-menu" to="/Ecosystem/Deployment" >Deployment</Link><br/>
        <Link className="menu-item sub-menu" to="/Ecosystem/Scheduling" >Scheduling</Link><br/>
        <Link className="menu-item sub-menu" to="/Ecosystem/Status" >Status</Link><br/>
        </div>
        <div className="menu-item" data-toggle="collapse" data-target="#Testing" aria-expanded="false" aria-controls="collapseExample">Testing<i className="arrow down"></i></div>
        <div className="collapse expand" id="Testing" data-parent="#accordionLeftNav">
        {/* <Link className="menu-item">Testing</Link> */}
        <Link className="menu-item sub-menu" to="/Testing/TestCases" >TestCases</Link><br/>
        <Link className="menu-item sub-menu" to="/Testing/Execute" >Execute</Link><br/>
        <Link className="menu-item sub-menu" to="/Testing/Reports" >Reports</Link><br/>
        </div>
        <div className="menu-item" data-toggle="collapse" data-target="#Monitoring" aria-expanded="false" aria-controls="collapseExample">Monitoring<i className="arrow down"></i></div>
        <div className="collapse expand" id="Monitoring" data-parent="#accordionLeftNav">
        {/* <Link className="menu-item">Monitoring</Link><br/> */}
        <Link className="menu-item sub-menu" to="/Monitoring/Reports" >Reports</Link><br/>
        <Link className="menu-item sub-menu" to="/Monitoring/NetworkTopology" >Network Topology</Link><br/>
        </div>
      </div>
    </Menu>
  );
};