import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Link} from 'react-router-dom';
import './Login.css'
import UserW from '../Images/User_W.svg'
import UserB from '../Images/User_B.svg'
import RoleB from '../Images/Role_B.svg'
import RoleW from '../Images/Role_W.svg'
import ServiceB from '../Images/Service_B.svg'
import ServiceW from '../Images/Service_W.svg'

import RepoW from '../Images/Repo_W.svg'
import RepoB from '../Images/Repo_B.svg'
import InfraB from '../Images/Infra_B.svg'
import InfraW from '../Images/Infra_W.svg'
// import AssetB from '../Images/Asset_W.svg'
import AssetW from '../Images/Asset_W.svg'

import DeploymentW from '../Images/Deployment_W.svg'
import DeploymentB from '../Images/Deployment_B.svg'
import SchedulingB from '../Images/Scheduling_B.svg'
import SchedulingW from '../Images/Scheduling_W.svg'
import StatusB from '../Images/Status_B.svg'
import StatusW from '../Images/Status_W.svg'

import TestcaseW from '../Images/Testcase_W.svg'
import TestcaseB from '../Images/Testcase_B.svg'
import ExecuteB from '../Images/Execute_B.svg'
import ExecuteW from '../Images/Execute_W.svg'
import ReportB from '../Images/Report-B.svg'
import ReportW from '../Images/Reports_W.svg'

import NetworkB from '../Images/Network_B.svg'
import NetworkW from '../Images/Network_W.svg'

export function UserMgmtTabs(props) {
return (
    <div className="myWizLeftNavContainer">
        <Link to="/UserMgmt/User" className={(props.selected=='User')?'selectedItem':'default'}><img src={(props.selected=='User')?UserW:UserB} alt='Logo' height="30px" width="30px"/><span className="leftNavText">User</span></Link>     
        <Link to="/UserMgmt/Role" className={(props.selected=='Role')?'selectedItem':'default'}><img src={(props.selected=='Role')?RoleW:RoleB} alt='Logo' height="30px" width="30px"/><span className="leftNavText">Role</span></Link>
        <Link to="/UserMgmt/Services" className={(props.selected=='Services')?'selectedItem':'default'}><img src={(props.selected=='Services')?ServiceW:ServiceB} alt='Logo' height="30px" width="30px"/><span className="leftNavText" id="serviceTxt">Service</span></Link>
    </div>
)
}
export function OnboardTabs(props) {
    return (
    <div className="myWizLeftNavContainer">
        <Link to="/Onboarding/Repository" className={(props.selected=='Repository')?'selectedItem':'default'}><img src={(props.selected=='Repository')?RepoW:RepoB} alt='Logo' height="30px" width="30px"/><span className="leftNavText">Repo</span></Link>     
        <Link to="/Onboarding/Infra" className={(props.selected=='Infra')?'selectedItem':'default'}><img src={(props.selected=='Infra')?InfraW:InfraB} alt='Logo' height="30px" width="30px"/><span className="leftNavText">Infra</span></Link>
        <Link to="/Onboarding/Asset" className={(props.selected=='Asset')?'selectedItem':'default'}><img src={(props.selected=='Asset')?AssetW:AssetW} alt='Logo' height="30px" width="30px"/><span className="leftNavText">Asset</span></Link>
    </div>
    )
    }
export function DeployTabs(props) {
    return (
    <div className="myWizLeftNavContainer">
        <Link to="/Ecosystem/Deployment" className={(props.selected=='Deployment')?'selectedItem':'default'}><img src={(props.selected=='Deployment')?DeploymentW:DeploymentB} alt='Logo' height="30px" width="30px"/></Link>     
        <Link to="/Ecosystem/Scheduling" className={(props.selected=='Scheduling')?'selectedItem':'default'}><img src={(props.selected=='Scheduling')?SchedulingW:SchedulingB} alt='Logo' height="30px" width="30px"/></Link>
        <Link to="/Ecosystem/Status" className={(props.selected=='Status')?'selectedItem':'default'}><img src={(props.selected=='Status')?StatusW:StatusB} alt='Logo' height="30px" width="30px"/></Link>
    </div>
    )
    }
    export function TestingTabs(props) {
        return (
        <div className="myWizLeftNavContainer">
            <Link to="/Testing/TestCases" className={(props.selected=='TestCases')?'selectedItem':'default'}><img src={(props.selected=='TestCases')?TestcaseW:TestcaseB} alt='Logo' height="30px" width="30px"/></Link>     
            <Link to="/Testing/Execute" className={(props.selected=='Execute')?'selectedItem':'default'}><img src={(props.selected=='Execute')?ExecuteW:ExecuteB} alt='Logo' height="30px" width="30px"/></Link>
            <Link to="/Testing/Reports" className={(props.selected=='Reports')?'selectedItem':'default'}><img src={(props.selected=='Reports')?ReportW:ReportB} alt='Logo' height="30px" width="30px"/></Link>
        </div>
        )
        }
export function CertifyTabs(props) {
    return (
    <div className="myWizLeftNavContainer">
        <Link to="/Monitoring/Reports" className={(props.selected=='Report')?'selectedItem':'default'}><img src={(props.selected=='Report')?ReportW:ReportB} alt='Logo' height="30px" width="30px"/></Link>     
        <Link to="/Monitoring/NetworkTopology" className={(props.selected=='NetworkTopology')?'selectedItem':'default'}><img src={(props.selected=='NetworkTopology')?NetworkW:NetworkB} alt='Logo' height="30px" width="30px"/></Link>
    </div>
    )
    }
export function SecurityTabs(props) {
    return (
    <div className="myWizLeftNavContainer">
        <Link to="/Security/Regulate" className={(props.selected=='Regulate')?'selectedItem':'default'}><img src={(props.selected=='Regulate')?ReportW:ReportB} alt='Logo' height="30px" width="30px"/></Link>     
        <Link to="/Security/Scan" className={(props.selected=='Scan')?'selectedItem':'default'}><img src={(props.selected=='Scan')?NetworkW:NetworkB} alt='Logo' height="30px" width="30px"/></Link>
    </div>
    )
    }
export function MonitorTabs(props) {
    return (
    <div className="myWizLeftNavContainer">
        <Link to="/Monitor/Check" className={(props.selected=='Check')?'selectedItem':'default'}><img src={(props.selected=='Check')?ReportW:ReportB} alt='Logo' height="30px" width="30px"/></Link>     
    </div>
    )
    }

