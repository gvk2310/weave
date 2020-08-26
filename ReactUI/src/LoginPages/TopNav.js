import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Link} from 'react-router-dom';
import './Login.css'

export function SimpleTabs() {
    
return (
    
    <div><br/>
        <Tabs >
        <Link to="/UserMgmt/User"><Tab label="User" id="topnav-0" className="dome navbar bg-dark border border-white activeNav"></Tab></Link>
        <Link to="/UserMgmt/Role"><Tab label="Role" id="topnav-1"  className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
        <Link to="/UserMgmt/Services"><Tab label="Services"  id="topnav-2" className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
        </Tabs>
    </div>
)
}

export function OnboardingTabs() {
    
    return (
        
        <div><br/>
            <Tabs >
            <Link to="/Onboarding/Repository"><Tab label="Repository" id="topnav-0"  className="dome navbar bg-dark border border-white activeNav"></Tab></Link>
            <Link to="/Onboarding/Infra"><Tab label="Infra" id="topnav-1"  className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
            <Link to="/Onboarding/Asset"><Tab label="Asset" id="topnav-2"  className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
            </Tabs>
        </div>
    )
    }

export function DeploymentTabs() {

    return (
        
        <div><br/>
            <Tabs >
            <Link to="/Ecosystem/Deployment"><Tab label="Deployment" id="topnav-0" className="dome navbar bg-dark border border-white activeNav"></Tab></Link>
            <Link to="/Ecosystem/Scheduling"><Tab label="Scheduling" id="topnav-1" className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
            <Link to="/Ecosystem/Status"><Tab label="Status" id="topnav-2" className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
            </Tabs>
        </div>
    )
    }

export function TestingTabs() {

        return (
            
            <div><br/>
                <Tabs >
                <Link to="/Testing/TestCases"><Tab label="TestCases" id="topnav-0" className="dome navbar bg-dark border border-white activeNav"></Tab></Link>
                <Link to="/Testing/Execute"><Tab label="Execute" id="topnav-1" className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
                <Link to="/Testing/Reports"><Tab label="Reports" id="topnav-2" className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>
                </Tabs>
            </div>
        )
        }
export function MonitoringTabs() {

    return (
        
        <div><br/>
            <Tabs >
            <Link to="/Monitoring/Reports"><Tab label="Reports" id="topnav-0" className="dome navbar bg-dark border border-white activeNav"></Tab></Link>
            <Link to="/Monitoring/NetworkTopology"><Tab label="Network Topology" id="topnav-1" className="dome rounded-top navbar bg-dark border border-white"></Tab></Link>            
            </Tabs>
        </div>
    )
    }        