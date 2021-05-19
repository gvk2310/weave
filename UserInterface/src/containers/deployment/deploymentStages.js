import React from 'react'
import moment from 'moment';

class DeploymentStages extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let deployStage = '';
        let currDeployment = this.props.currentDep;
        var depDate = '';
        var timeTaken = '';
        if (currDeployment.logs) {
            let spt = currDeployment.logs;
            let timeLog = spt.split("|");
            let startTime = this.props.currDepTime;
            timeTaken = moment.utc(moment(timeLog[0], "DD-MM-YYYY HH:mm:ss").diff(moment(startTime, "DD-MM-YYYY HH:mm:ss"))).format("mm:ss");
            depDate = startTime.split(" ");
        }

        if (currDeployment.stage_info) {
            // console.log("currDeploy", currDeployment.stage_info)
            deployStage = Object.keys(currDeployment.stage_info).map((value, index) => {
                // console.log('keys', currDeployment.stage_info)

                return (
                    <a key={index} className={(currDeployment.stage_info[value].status ? (currDeployment.stage_info[value].status == 'Completed' ? "completed" : "failed") : "inprog")}>
                        <span>{value}</span>
                        <p>{currDeployment.stage_info[value].status}</p>
                    </a>
                )
            })
        }

        return (
            <>
                <div className="devnet-deploy-info open">
                    <div className="devnet-deploy-head">
                        <div>Deployment Stages: <span>{this.props.currDepName}</span></div>
                        <div className="devnet-deploy-time"><span>{this.props.currDepStatus}</span>: <span>{depDate[0]} | {timeTaken} (mm:ss)</span></div>
                    </div>
                    <div className="devnet-deploy-body">
                        <div className="devnet-deploy-default mt-5">
                            Click on any Deployment to see the Deployment Stages.
                        </div>
                        <nav className="devnet-steps">
                            {deployStage}
                        </nav>
                    </div>
                </div>
            </>
        )
    }

}
export default DeploymentStages