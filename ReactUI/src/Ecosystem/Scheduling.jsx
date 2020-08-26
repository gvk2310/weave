import React from 'react'
import {DeploymentTabs} from '../LoginPages/TopNav'
import App from './index.jsx'
import { relativeTimeRounding } from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {DeployTabs} from '../LoginPages/myWizLeftNav'

class Scheduling extends React.Component{
    
    // componentDidMount = () => {
    //     document.querySelector('.dome').classList.remove('activeNav');
    //     document.getElementById('topnav-1').classList.add('activeNav');
    //   }

    render(){

        return(
            <MuiThemeProvider>
                      <div className="row container-fluid">
                {/* left nav */}
                <div className="col-lg-1">
                    <DeployTabs selected="Scheduling"/>
                </div>
                {/* left nav */}
                    {/* Main Content */}
                <div className="container-fluid col-lg-11 mainContent pl-5">
                <App/>
                </div>
                </div>
                {/* Main Content */}
            </MuiThemeProvider>
        )
    }
}
export default Scheduling;