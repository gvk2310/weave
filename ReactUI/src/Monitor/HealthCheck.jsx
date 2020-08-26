import React from 'react'
import {MonitoringTabs} from '../LoginPages/TopNav'
import {MonitorTabs} from '../LoginPages/myWizLeftNav'
import BarGraph from './BarGraph'
import DoughnutGraph from './DoughnutGraph'

class HealthCheck extends React.Component{

    render(){
        return(
            <>
             <div className="row container-fluid">
                {/* left nav */}
                <div className="col-lg-1">
                    <MonitorTabs selected="Check"/>
                </div>
                {/* left nav */}
                {/* Main Content */}
                <div className="container-fluid col-lg-11 mainContent pl-5 row" id="healthCheckup">
                    <div className="col-lg-5">
                        <BarGraph />
                    </div>
                    <div className="col-lg-5">
                        <DoughnutGraph/>
                    </div>
                </div>
                </div>
                {/* Main Content */}
            </>
        )
    }
}
export default HealthCheck;