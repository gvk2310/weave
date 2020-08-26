import React from 'react'
import {MonitoringTabs} from '../LoginPages/TopNav'
import {CertifyTabs} from '../LoginPages/myWizLeftNav'

class Reports extends React.Component{

    render(){
        return(
            <>
             <div className="row container-fluid">
                {/* left nav */}
                <div className="col-lg-1">
                    <CertifyTabs selected="Report"/>
                </div>
                {/* left nav */}
                    {/* Main Content */}
                <div className="container-fluid col-lg-11 mainContent pl-5"></div>
                </div>
                {/* Main Content */}
            </>
        )
    }
}
export default Reports;