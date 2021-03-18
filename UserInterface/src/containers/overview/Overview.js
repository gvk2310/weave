import React from 'react';

class Overview extends React.Component{

    constructor(props){
        super(props);
        this.state={}
    }

    render(){
        return(
                <>
                <div className="col dev-AI-infused-container">
                        <div className="myw-container py-4 devnetBG">
                            <div className="dev-title">DevNetOps</div>
                            <p>DevOps&nbsp;to automate the network operations helping the Network Reliability Engineer(NRE) to carry out network operations with simple steps of execution.</p>
                            <img src={require("images/exe-steps.svg")} alt="Execution Steps"/>
                        </div>
                        <div className="myw-container py-4">
                            <div className="dev-section dev-net-ops">
                                <div className="fs-16 dev-700">Statistics</div>
                                <div className="dev-default-tool dev-net-default-tool">
                                    <img src={require("images/no-chart.svg")} alt=""/>
                                </div>
                            </div>
                        </div>
                </div>
                </>
        )
    }
}
export default Overview;

