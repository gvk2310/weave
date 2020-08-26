import React from 'react'
import {DeploymentTabs} from '../LoginPages/TopNav'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {DeployTabs} from '../LoginPages/myWizLeftNav'

class Status extends React.Component{

    // componentDidMount = () => {
    //     document.querySelector('.dome').classList.remove('activeNav');
    //     document.getElementById('topnav-2').classList.add('activeNav');
    //   }
      
    render(){
        return(
            <MuiThemeProvider>
            <div className="row container-fluid">
                {/* left nav */}
                <div className="col-lg-1">
                    <DeployTabs selected="Status"/>
                </div>
                {/* left nav */}
                    {/* Main Content */}
                <div className="container-fluid col-lg-11 mainContent pl-5">
                <span className="pageHeading pr-5">Ecosystem Status</span>
                <div className="float-right py-2">
                <input className="mr-2 rounded"type="text" id="country" name="country" placeholder="Search Here.." ref="" onChange={this.handleSearchEvent}/>
                    <div></div>
                    <div></div>
                </div><br/><br/>
            
            <table className="table table-hover">
            <thead className=""><tr><th>Name</th><th>Environment</th><th>Infra</th><th>Orehestrator</th><th>VirtualNodes</th><th>Security</th><th>Status</th><th>logs</th></tr></thead>
            <tbody>
                <tr><td>IMS-V4-T1</td><td>Dev</td><td>AWS</td><td>OSM</td><td>4</td><td><i class="fa fa-2x fa-times pl-3 cross"></i></td><td><span className="greendot ml-3"></span></td><td>…</td></tr>
                <tr><td>Versa-SDWAN</td><td>Dev</td><td>AWS</td><td>Cloudformation</td><td>6</td><td><i class="fa fa-2x fa-check pl-3 tick"></i></td><td><span className="greendot ml-3"></span></td><td>…</td></tr>
                <tr><td>Versa-SDWAN-OSM</td><td>Test</td><td>Openstack</td><td>OSM</td><td>1</td><td><i class="fa fa-2x fa-check pl-3 tick"></i></td><td><span className="reddot ml-3"></span></td><td>…</td></tr>
            </tbody>
            </table>

                <div className="py-3">
                <div className="float-right">                               
                    <button type="button" className="btn btn-primary mx-1 px-5" >Next</button>
                </div>
                </div>
                </div>
                </div>
                {/* Main Content */}
            </MuiThemeProvider>
        )
    }
}
export default Status;