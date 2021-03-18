import React from 'react'

class DeploymentStages extends React.Component{
constructor(props){
    super(props)
    this.state={

    }
}

render(){
    let deployStage = '';
    let currDeployment = this.props.currentDep;
    if(currDeployment.stage_info) {
        console.log("currDeploy",currDeployment.stage_info)
        
        deployStage = Object.keys(currDeployment.stage_info).map((value,index) => {
            // deployStageStatus = Object.keys(currDeployment.stage_info.value).map((value,index) => {
            //     console.log(value)
            // })
          console.log(currDeployment.stage_info)
          
          return(
                    <a className="completed">
                        <span>{value}</span>
                        <p>{currDeployment.stage_info[value].status}</p>
                    </a>
          )
        // return(<>
        // <p className="DepName">{currDeployment.name}</p>
        //     <div className="statusTable row">
        //     <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
        //     <span className="stages  col-sm-5">
        //         <span className="stage">{value}</span>
        //         {currDeployment.stage_info[value].status == 'complete' && <span className="stageStatus">Done</span>}
        //         {currDeployment.stage_info[value].status == 'failed' && <span className="stageStatus">Failed</span>}
        //     </span>
        //     <span className="deploymentStatus  col-sm-5 pt-2">
        //     {currDeployment.stage_info[value].status == 'complete' && <span className="statusIcon"><i className="fa fa-check-circle p-1" aria-hidden="true"></i></span>}
        //     {currDeployment.stage_info[value].status == 'skipped' && <span className="statusIcon"><i className="fa fa-exclamation-triangle p-1" aria-hidden="true"></i></span>}
        //     {currDeployment.stage_info[value].status == '' && currDeployment.status == 'DEPLOY_COMPLETE' && <span className="statusIcon dp_dull"> not applicable</span>}
        //     {currDeployment.stage_info[value].status == '' && currDeployment.status != 'DEPLOY_COMPLETE' && <span className="statusIcon"><i className="fa fa-ellipsis-h p-1" aria-hidden="true"></i> awaiting</span>}
        //     {currDeployment.stage_info[value].status == 'failed' && <span className="statusIcon"><i className="fa fa-times-circle p-1" aria-hidden="true"></i></span>}
            
        //         <span className="statusTe">{currDeployment.stage_info[value].status}</span>
        //     </span>
        //     </div></>)
     })
    }
    // else if(currDeployment.status == 'DELETE_COMPLETE'){
    //     deployStage = <div className="noDepStages">
    //                     <div>Deployment Deleted Successfully</div>
    //                 </div>
    // }
    // else if(currDeployment.status == 'DELETE_IN_PROGRESS'){
    //     deployStage = <div className="noDepStages">
    //     <div>Delete in Progress...</div>
    // </div>
    // }
    return(
        <>
        <div className="devnet-deploy-info open">
            <div className="devnet-deploy-head">
                <div>Deployment Stages: <span>{this.props.currDepName}</span></div>
                {/* <div className="devnet-deploy-time">Deployed 14/10/2020 | 01:10 P.M.</div> */}
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