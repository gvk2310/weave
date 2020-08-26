import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Link} from 'react-router-dom';
import './Login.css'

class MyWizTopNav extends React.Component{

    constructor(props){
        super(props);
        this.state={
            active: '',
        }
    }

handleSelect = (e) => {
    document.querySelectorAll('.TopNav12').forEach(el => {
        el.classList.remove('Active')
    })
    e.currentTarget.classList.add("Active");
}

render(){    
return (
    
    <div className="myWizTopNav" >
        <Link to="/uploadScreen" onClick={(event) => this.handleSelect(event)} className="TopNav12 Active">Home</Link>
        <Link to="/UserMgmt/User" onClick={(event) => this.handleSelect(event)} className="TopNav12">User</Link>
        <Link to="/Onboarding/Repository" onClick={(event) => this.handleSelect(event)} className="TopNav12">Onboard</Link>
        <Link to="/Ecosystem/Deployment" onClick={(event) => this.handleSelect(event)} className="TopNav12">Deploy</Link>
        <Link to="/Security/Scan" onClick={(event) => this.handleSelect(event)} className="TopNav12">Security</Link>
        <Link to="/Monitor/Check" onClick={(event) => this.handleSelect(event)} className="TopNav12">Monitor</Link>
        <Link to="/Testing/TestCases" onClick={(event) => this.handleSelect(event)} className="TopNav12">Testing</Link>
        <Link to="/Monitoring/Reports" onClick={(event) => this.handleSelect(event)} className="TopNav12">Certify</Link>
    </div>
        )
        }
    }

export default MyWizTopNav;
