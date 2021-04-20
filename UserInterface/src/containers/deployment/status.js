import React from 'react'

class Status extends React.Component{

    constructor(props){
        super(props);
        this.state={
        }
    }

    
    render(){

        return(
           
            <div className="col dev-AI-infused-container">
                <div className="myw-container py-4 ">
                    <div className="d-flex align-items-center">
                        <div className="dev-page-title">Ecosystem Status</div>
                        <div className="ml-auto dev-actions">
                            {/* <button type="button" class="btn">
                                    <img src={require("images/search.svg")} alt="Search"/>
                                    <span>Search</span>
                                </button>
                                <button type="button" class="btn">
                                    <img src={require("images/filter.svg")} alt="Filter"/>
                                    <span>Filter</span>
                                </button> */}
                            <button type="button" className="btn btn-secondary"><img src={require("images/add.svg")} alt="Add"/> <span>Add</span></button>
                        </div>
                    </div>
                    <div className="dev-section my-4">
                        <div className="table-responsive">
                            <table className="table table-striped dev-anlytics-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Environment</th>
                                        <th scope="col">Infra</th>
                                        <th scope="col">Orchestrator</th>
                                        <th scope="col" className="text-center">Virtual Nodes</th>
                                        <th scope="col" className="text-center">Security</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Logs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Deployment1</td>
                                        <td>Demo</td>
                                        <td>Infra1</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/ic-icon.svg")} alt="Incompleted"/></td>
                                        <td>Incomplete</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>TestDeployment</td>
                                        <td>Test</td>
                                        <td>ACC-DevOps</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/c-icon.svg")} alt="Completed"/></td>
                                        <td>Incomplete</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>MyProductionDeployment</td>
                                        <td>Dev</td>
                                        <td>Test-DevOps</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/c-icon.svg")} alt="Completed"/></td>
                                        <td>Completed</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>Deployment1</td>
                                        <td>Stage</td>
                                        <td>5G-Dev</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/c-icon.svg")} alt="Completed"/></td>
                                        <td>Completed</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>TestDeployment</td>
                                        <td>Production</td>
                                        <td>IMS-Dev</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/ic-icon.svg")} alt="Incompleted"/></td>
                                        <td>Incomplete</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>MyProductionDeployment</td>
                                        <td>Demo</td>
                                        <td>Versa-SDWAN</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/c-icon.svg")} alt="Completed"/></td>
                                        <td>Completed</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>Deployment1</td>
                                        <td>Test</td>
                                        <td>5G-Test</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/ic-icon.svg")} alt="Incompleted"/></td>
                                        <td>Incomplete</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>TestDeployment</td>
                                        <td>Dev</td>
                                        <td>AWS</td>
                                        <td>Cloudformation</td>
                                        <td align="center">3</td>
                                        <td align="center"><img src={require("images/c-icon.svg")} alt="Completed"/></td>
                                        <td>Completed</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <nav class="mt-4">
                            <div class="pagination justify-content-end">
                                <a href="javascript:;" class="page-link disabled" tabindex="-1" aria-disabled="true">&lt;</a>
                                <a href="javascript:;" class="page-link active" aria-current="page">1 <span class="sr-only">(current)</span></a>
                                <a href="javascript:;" class="page-link">2</a>
                                <a href="javascript:;" class="page-link">3</a>
                                <span class="page-link disabled">...</span>
                                <a href="javascript:;" class="page-link">7</a>
                                <a href="javascript:;" class="page-link">&gt;</a>
                                <span class="page-link p-0">
                                    <select class="form-control form-control-sm">
                                        <option>10/ Page</option>
                                    </select>
                                </span>
                            </div>
                        </nav> */}
                </div>
            </div>
        )
    }
}
export default Status;