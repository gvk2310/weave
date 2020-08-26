import React from 'react'
import {DeploymentTabs} from '../LoginPages/TopNav'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import '../common.css'
import '../LoginPages/Login.css'
//import Asset from '../Images/rectangle_4733_2_u35.svg'
import {DeployTabs} from '../LoginPages/myWizLeftNav'
import deployNow from './deployNow'
import {Link} from 'react-router-dom'
import { Redirect } from 'react-router-dom';
import { encode } from "base-64";
import { connect } from "../websocket";
import ProgressBar from "./ProgressBar";

const testData = [
  { bgcolor: "#00baff", completed: 60 },
  // { bgcolor: "#00695c", completed: 30 },
  // { bgcolor: "#ef6c00", completed: 53 },
];

class Ecosystem extends React.Component{

    constructor(props){
      super(props);
      // connect(message => {
      //   console.log(message);
      // });
      this.state={
        username: 'admin',
        password: 'admin123',
        deploy: [],
        asset: [],
        openDeploymentPage:false,
        isHiddenSearchBox: true,
        delDeploy:'',
        searchResult:'',
        disabledBtn: false,
        environment: ['dev','test','production','stage','demo'],
        changeOrchestrator: '',
        changeCloudType: '',
        VNFList: ['SDWAN_Director_16.ami','SDWAN_Controller.ami','SDWAN_Flex.ami'],
        VNFListOSM: ['Openstack1','Openstack2'],
        CFTemplate: ['Comcast-CF-template','Telefonica-CF-template'],
        Config: ['Director-config','Controller-config','Control-config','Branch-config'],
        ConfigCloud: ['Comcast-config','Telefonica-config'],
        VNFDList: ['Director-vnfd','Controller-vnfd','Control-vnfd','Branch-vnfd'],
        NSDAsset: ['Director-nsd','Controller-nsd','Control-nsd','Branch-nsd'],
        nameList: ['IMS-V4-T1','Versa-SDWAN','Versa-SDWAN-OSM'],
        infraList: ['aws','Acc-DevOps','Test-DevOps','5G-Dev','5G-Test','IMS-Client','IMS-Demo','Versa-SDWAN-Dev','Versa-SDWAN-Test'],
        deployNow: false,
        deployLater: false,
        expanded:false,
      }
    }
    handleDeleteData = () => {

    }
    
    componentDidMount = () => {
      require('dotenv').config();    
      let API_URL = process.env.REACT_APP_DEPLOYMENT;
      let API_URL1 = process.env.REACT_APP_ASSETONBOARDING;
      console.log(process.env)
      let token = sessionStorage.getItem('tokenStorage');

      let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        //myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        //redirect: 'follow'
        };
        fetch(`${API_URL}`, requestOptions)
        .then(response =>
          {console.log(response);
            if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)})};
          return response.json();
            })
        .then((findresponse)=>{
            document.getElementById('loader').style.display = "none";
             if(findresponse.msg){
              this.setState({response:findresponse.msg})
              }else{
                    this.setState({deploy : findresponse})
                    console.log(this.state.deploy)
              }
        })
        .catch(error => {
          // document.getElementById('loader').style.display = "none";
          console.log('error', error)
          });
        //Fetch Assets
        fetch(`${API_URL1}/asset`, requestOptions)
          .then(response =>
            {console.log(response);
              if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)})};
            return response.json();
              })
          .then((findresponse)=>{
              document.getElementById('loader').style.display = "none";
               if(findresponse.msg){
                console.log(findresponse.msg)
                }else{
                      this.setState({asset: findresponse})
                }
          })
          .catch(error => {
            document.getElementById('loader').style.display = "none";
            console.log('error', error)
            });
    }
    toggleHiddenSearchBox = () => {
      this.setState({isHiddenSearchBox: !this.state.isHiddenSearchBox})
    }
    handleAddDeploy = () => {
      require('dotenv').config();    
      let API_URL = process.env.REACT_APP_DEPLOYMENT;
      let token = sessionStorage.getItem('tokenStorage');

        let addDeployForm1 = document.getElementById('addDeployForm');
        let formData = new FormData(addDeployForm1);
        let fileInput = document.getElementById('config')
        formData.append("config", fileInput.files[0], fileInput.files[0].name );
        var raw = JSON.stringify(Object.fromEntries(formData));
        console.log(Object.fromEntries(formData))
        console.log(formData)
        console.log(raw);

        /*Add Deploy*/
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          };
        document.getElementById('loader').style.display = "block";
        fetch(`${API_URL}`, requestOptions)
        .then((response) => {
          console.log(response);
          console.log(response.status);
          (response.status == 200) ? this.setState({msgClass:'successMessage',asset: [...this.state.asset, JSON.parse(raw)]}) : alert(response.status + '  ' +response.statusText);
          return response.json();
        })
        .then(result => {
          document.getElementById('loader').style.display = "none";
          console.log(typeof(result));
          if(typeof(result) == 'object')
          {
          alert(result.msg)
          }
          else{
          this.setState({status:JSON.parse(result).message})
          setTimeout(() => {this.setState({status:''})}, 3000);
          }
        })
      .catch(error => {
        document.getElementById('loader').style.display = "none";
        alert('error', error)
        });
      document.getElementById("addDeployForm").reset();
}

      handleDeployNowPostRequest = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${encode(`${this.state.username}:${this.state.password}`)}`);
        myHeaders.append('Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
        };
        
        fetch("http://100.21.154.139:9000/jenkins/job/sdwan_versa_workstation/build?token=devnetops_remote", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      }
 
    handleDeployNow = () => {
        let addDeployForm = document.getElementById('addDeploymentForm');
        let formData = new FormData(addDeployForm);
        console.log(formData);
        // var raw = JSON.stringify(Object.fromEntries(formData));
        var raw = Object.fromEntries(formData);
        console.log(raw)
        console.log(formData.getAll('VNF'))
    }

    handleDeployLater = () => {
      this.setState({deployLater:!this.state.deployLater})
    }
    toggleDeployNowForm = () => {
      this.setState({openDeploymentPage:true})
    }
    handleChangeOrchestrator = () => {
      this.setState({changeOrchestrator: this.refs.depOrchestrator.value})
    }
    handleChangeCloudType = () => {
      console.log(this.refs.changeCloudType.value)
      this.setState({changeCloudType: this.refs.changeCloudType.value})
    }

    showCheckboxes = () => {
      var checkboxes = document.getElementById("checkboxes");
      if (!this.state.expanded) {
        checkboxes.style.display = "block";
        this.state.expanded = true;
      } else {
        checkboxes.style.display = "none";
        this.state.expanded = false;
      }
      var chks = document.querySelectorAll('#checkboxes input:checked');
      var selected = [];
      for (var i = 0; i < chks.length; i++) {
                        selected.push(chks[i].value);      
                                 }
        console.log(selected);
    }

    hadleDelete = () => {
      console.log(this.state.delDeploy);
        this.setState({disabledBtn:true})
        let raw={
          id : this.state.delDeploy,
          force_delete :"false"
        }
        console.log(JSON.stringify(raw));

        require('dotenv').config();    
              let API_URL = process.env.REACT_APP_DEPLOYMENT;
              console.log(process.env)
              let token = sessionStorage.getItem('tokenStorage');
        var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${token}`);
                myHeaders.append("Content-Type", "application/json");
      
                var requestOptions = {
                  method: 'DELETE',
                  headers: myHeaders,
                  body: JSON.stringify(raw),
                  //redirect: 'follow'
                };
               document.getElementById('loader').style.display = "block";
                fetch(`${API_URL}`, requestOptions)
                .then((response) => {
                  this.setState({disabledBtn:false})
                  document.querySelector('#myDeleteConfirmationModal .close').click();
                  alert(response.status +" "+ response.statusText);
                  if(response.status == 200) {
                      this.state.deploy.splice(this.state.delDeployWithIndex, 1);
                      this.setState({msgClass:'successMessage'})
                    }
                  else{
                     this.setState({msgClass:'errorMessage'})
                  };     
                  return response.text();
                })
                  .then(result => {
                      document.getElementById('loader').style.display = "none";
                      console.log(result)
                      let result1 = JSON.parse(result);
                      if(result1.msg){
                        alert(result1.msg)
                        }
                        this.setState({status:JSON.parse(result).message})
                        setTimeout(() => {this.setState({status:''})}, 3000);
                      })
                .catch(error => {
                    document.getElementById('loader').style.display = "none";
                    console.log('error', error)
                    this.setState({disabledBtn:false})
                    document.querySelector('#myDeleteConfirmationModal .close').click();
                });
    }
    hadleDeleteBeforeConfirmation = (index, id) => {
      this.setState({delDeploy: id, delDeployWithIndex: index});
    }
    handleSearchEvent = (event) => {
      this.setState({searchResult:this.refs.searchKey.value})
    }
    render(){

              /*Display deploy Details in the Table*/
              let deploy = '';
              let resultingdeploy = []; 
              if(this.state.deploy.length>0){
               resultingdeploy = this.state.deploy.filter(deploy => {
                console.log(deploy.name) 
                return deploy.name.toLowerCase().indexOf(this.state.searchResult.toLowerCase()) != -1
              });
              } 
              console.log(resultingdeploy)
              if(resultingdeploy.length > 0) {
                deploy = resultingdeploy.map((value,index) => {
                        return <tr className="" key={index}>
                                  <td className="DepName">{value.name}</td>
                                  <td>{value.environment}</td>
                                  <td>{value.infra}</td>
                                  <td>{value.orchestrator}</td>
                                  <td>{value.status}</td>
                                  <td><button className="mx-2 fa fa-trash fa-x p-1 pt-2 deleteRow" data-target="#myDeleteConfirmationModal" data-toggle="modal" onClick={() => this.hadleDeleteBeforeConfirmation(index, value.id)} ></button></td>
                              </tr>
                })
              }
            else if(this.state.deploy.length == 0){deploy = <tr><td class="text-center text-primary" colSpan="8">{this.state.response}</td></tr>;}
            else deploy = <tr><td class="text-center text-primary" colSpan="6">No Data To Display</td></tr>;
            /*Add Deployment Modal Body*/
            let addDeploymentModal = <div className="modalbody">
            <form id="addDeployForm">      
                <label className="w-25 px-3" htmlFor="email">Name :</label>
                <TextField
                    type="text"
                    name="name"
                    /><br/> 

                <label className="w-25 px-3" htmlFor="email">Environment :</label>
                <select name="environment" className="input-group-text my-2 w-50">
                              {this.state.environment.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 

                <label className="w-25 px-3" htmlFor="email">Infra :</label>
                <select name="infra" className="input-group-text my-2 w-50">
                  {this.state.infraList.map(item => {   
                        return (<option value={item} key={item} directory={item}>{item}</option>);
                      })}
                </select><br/>

                <label className="w-25 px-3" htmlFor="email">Orchestrator :</label>
                <select ref="depOrchestrator" name="orchestrator" onChange={this.handleChangeOrchestrator} className="input-group-text my-2 w-50">
                        <option value="Select Orchestrator">Select Orchestrator</option>
                        <option value="cloudformation">cloudformation</option>
                        <option value="OSM">OSM</option>
                  </select><br/>  

                  {/* if orchestrator value = cloudformation */}
                  {this.state.changeOrchestrator == 'cloudformation' &&
                  <>
                  {/* <label className="w-25 px-3" htmlFor="email">VNF :</label>
                  <select name="depCfVNF" className="input-group-text my-2 w-50 mdb-select md-htmlForm">
                              {this.state.VNFList.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/>  */}

                  <label className="w-25 px-3" htmlFor="email">Template :</label>
                  <TextField
                    type="text"
                    name="assets"
                    /><br/> 
                  {/* <select name="assets" className="input-group-text my-2 w-50">
                              {this.state.CFTemplate.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/>  */}
                  <label className="w-25 px-3" htmlFor="type">Type :</label>
                  <select ref="changeCloudType" name="type" className="input-group-text my-2 w-50"  onChange={this.handleChangeCloudType} >
                    <option value='generic' key='generic' directory='generic'>generic</option>
                    <option value='versa' key='versa' directory='versa'>versa</option>
                  </select><br/>

                  {this.state.changeCloudType == 'versa' &&
                  <>
                  <label className="w-25 px-3" htmlFor="director_ip">Director IP :</label>
                  <TextField
                    type="text"
                    name="director_ip"
                    /><br/> 
                  <label className="w-25 px-3" htmlFor="controller_ip">Controller IP :</label>
                  <TextField
                    type="text"
                    name="controller_ip"
                    /><br/> 
                  </>
                            }
                  <label className="w-25 px-3" htmlFor="email">Config :</label>
                  <TextField
                    className="my-3"
                    type="file"
                    id="config"
                    />
                  {/* <select name="depCfConfig" className="input-group-text my-2 w-50">
                              {this.state.ConfigCloud.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/>  */}
                  </>
                  }

                  {/* if orchestrator value = OSM */}
                  {this.state.changeOrchestrator == 'OSM' &&
                  <>
                  <label className="w-25 px-3" htmlFor="email">VNF :</label>
                  <select name="depOsmVnf" className="input-group-text my-2 w-50">
                              {this.state.VNFListOSM.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 

                  <label className="w-25 px-3" htmlFor="email">VNF Desc. :</label>
                  <span className="multiselect my-2 w-50">
                      <span onClick={this.showCheckboxes} className="selectBox">
                        <select className="input-group-text" >
                          <option>Select an option</option>
                        </select>
                        <span className="overSelect"></span>
                      </span>
                      <span id="checkboxes">
                        <label htmlFor="one">
                          <input type="checkbox" value="1" name="VNF"/><option>Select an option</option></label>
                        <label htmlFor="two">
                          <input type="checkbox" value="2" name="VNF"/>Second checkbox</label>
                        <label htmlFor="three">
                          <input type="checkbox" value="3" name="VNF"/>Third checkbox</label>
                      </span>
                    </span>  <br/>

                  <label className="w-25 px-3" htmlFor="email">NS Desc. :</label>
                  <select name="depOsmNsd" className="input-group-text my-2 w-50">
                              {this.state.NSDAsset.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 

                  <label className="w-25 px-3" htmlFor="email">Config :</label>
                  <select name="depOsmConfig" className="input-group-text my-2 w-50">
                              {this.state.Config.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 
                  </>
                  }
          </form>
          </div>
          /*Delete Deployment Modal Body*/
          let deleteDeploymentModal = <div className="modalbody">
          <div>  
          <label className="w-25 px-3" htmlFor="email">Name :</label>
          <select name="depNewName" className="input-group-text my-2 w-50">
                        {this.state.nameList.map(item => {   
                            return (<option value={item} key={item} directory={item}>{item}</option>);
                        })}
                    </select><br/> 
          </div>
          </div>
          
        return(
            <MuiThemeProvider>
        {this.state.openDeploymentPage != false &&
              <deployNow/>
        }
        {this.state.openDeploymentPage == false &&
          <div className="row container-fluid">
            {/* left nav */}
        <div className="col-lg-1">
            <DeployTabs selected="Deployment"/>
        </div>
            {/* left nav */}
            {/* Main Content */}
        <div className="container-fluid col-lg-8 mainContent pl-5">
        <span className="pageHeading pr-5">Deployment</span>
                <div className="float-right py-2">
                {!this.state.isHiddenSearchBox && <input className="mr-2 rounded"type="text" id="country" name="country" placeholder="Search Here.." ref="searchKey" onChange={this.handleSearchEvent}/>}
                <span className="toprightIcons"><i class="fa fa-search" aria-hidden="true" onClick={this.toggleHiddenSearchBox}></i></span>
                <span className="toprightIcons"><i class="fa fa-sliders" aria-hidden="true"></i>Filter</span>
                    {/* <Link to="/Ecosystem/Deployment/deployNow" ><button id="addDeploy" type="button" className="btn btn-primary mx-1 px-5" ><span className="fa fa-plus"></span> New</button></Link> */}
                    <button className="mx-2" data-toggle="modal" data-target="#myAddDeploymentModal"><span className="fa fa-plus"></span> New</button>
                    {/* <button className="mx-2" onClick={this.toggleDeployNowForm}><span className="fa fa-plus"></span> New</button> */}
                    {/* <button className="mx-2 fa fa-trash fa-2x p-1 pt-2" data-toggle="modal" data-target="#myDeleteDeploymentModal"></button> */}
                </div><br/><br/>
            {/* <button onClick={() => {window.location.href='http://100.21.154.139:9000/jenkins/job/sdwan_versa_workstation/build?token=devnetops_remote'}}>Open Page</button> */}
            
            <table className="table table-hover">
            <thead className=""><tr><th>Name</th><th>Environment</th><th>Infra</th><th>Orchestrator</th><th>Deploy</th><th>Action</th></tr></thead>
            <div id="loader"></div>
            <tbody>
                {deploy}
                {/* <tr><td className="DepName">IMS-V4-T1</td><td>Dev</td><td>AWS</td><td>OSM</td><td>Deployed</td></tr>
                <tr><td className="DepName">Versa-SDWAN</td><td>Dev</td><td>AWS</td><td>CloudhtmlFormation</td><td>In Progress..</td></tr>
                <tr><td className="DepName">Versa-SDWAN-OSM</td><td>Test</td><td>Openstack</td><td>OSM</td><td>In Progress..</td></tr>
                <tr><td className="DepName">Versa-SDWAN-OSM</td><td>Test</td><td colspan="3">
                    {testData.map((item, idx) => (
                    <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} />
                  ))}
                </td></tr> */}
            </tbody>
            </table>
            {/* ProgressBar */}
              {/* <div className="App">
              {testData.map((item, idx) => (
                <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} />
              ))}
            </div> */}
              {/* ProgressBar */}
            {/* /*My Add Deployment Modal*/ }
            <div className="container">
            <div className="modal" id="myAddDeploymentModal">
              <div className="modal-dialog">
                <div className="modal-content">
                
                  {/* <!-- Modal Header --> */}
                  <div className="modal-header">
                    <h4 className="modal-title">Add</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                    {addDeploymentModal}
                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                   <button type="button" className="btn btn-success" onClick={this.handleAddDeploy} data-dismiss="modal">Deploy Now</button>
                   <button type="button" className="btn btn-success"  onClick={this.handleDeployLater} >Deploy Later</button>
                    {/* <button type="button" className="btn btn-success" onClick={() => this.handleAddData()}>Submit</button> */}
                    
                  </div>
                  {this.state.deployLater &&
                  <div className="modal-footer">
                  <input id="deployLaterInput" type="datetime-local"/>  
                  <button type="button" className="btn btn-success" onClick={this.handleDeployNow} data-dismiss="modal">Deploy</button>                  
                  </div>
                    }
                </div>
              </div>
            </div>
            </div>

            {/* /*My Delete Popup Modal*/ }
            <div className="container">
              <div className="modal" id="myDeleteConfirmationModal">
                <div className="modal-dialog">
                  <div className="modal-content">
                  
                    {/* <!-- Modal Header --> */}
                    <div className="modal-header">
                      <h4 className="modal-title">Delete Confirmation</h4>
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    {/* <!-- Modal body --> */}
                      <div className="modal-body text-center text-danger">
                        <div className>Are you sure!!</div>
                      </div>
                    {/* <!-- Modal footer --> */}
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" value="no" onClick={(event) => this.hadleDelete(event)} disabled={this.state.disabledBtn}>Delete</button>
                    </div>
                    </div>
                  </div>
                </div>
                </div>
                {/* /*My Delete Popup Modal*/ }
          </div>
          {/* Main Content */}
          {/* Deployment Stages */}
          <div className="col-lg-3 deploymentStages">
              <p className="deploymentStagesTitle">Deployment Stages</p>
              <p className="DepName">Versa-SDWAN</p>
              <p className="deploymentTime">
                <span>Deployed </span>
                <span>23/08/2019 10:17 A.M </span>
                <span><i class="fa fa-angle-down" aria-hidden="true"></i></span>
              </p>
              <div className="statusTable row">
                <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                <span className="stages  col-sm-5">
                  <span className="stage">Deploy</span>
                  <span className="stageStatus">Done</span>
                </span>
                <span className="deploymentStatus  col-sm-5 pt-2">
                  <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span>
                  <span className="statusTe">Completed</span>
                </span>
              </div>

              <div className="statusTable row">
                <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                <span className="stages  col-sm-5">
                  <span className="stage">Security Check</span>
                  <span className="stageStatus">Done</span>
                </span>
                <span className="deploymentStatus  col-sm-5 pt-2">
                  <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span>
                  <span className="statusTe">Completed</span>
                </span>
              </div>

              <div className="statusTable row">
                <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                <span className="stages  col-sm-5">
                  <span className="stage">Device creation</span>
                  <span className="stageStatus">Done</span>
                </span>
                <span className="deploymentStatus  col-sm-5 pt-2">
                  <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span>
                  <span className="statusTe">Completed</span>
                </span>
              </div>

              <div className="statusTable row">
                <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                <span className="stages  col-sm-5">
                  <span className="stage">Stage Branches</span>
                  <span className="stageStatus">Done</span>
                </span>
                <span className="deploymentStatus  col-sm-5 pt-2">
                  <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span>
                  <span className="statusTe">Completed</span>
                </span>
              </div>

              <div className="statusTable row">
                <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                <span className="stages  col-sm-5">
                  <span className="stage">Test</span>
                  <span className="stageStatus">Done</span>
                </span>
                <span className="deploymentStatus  col-sm-5 pt-2">
                  <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span>
                  <span className="statusTe">Completed</span>
                </span>
              </div>

              <div className="statusTable row">
                <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                <span className="stages  col-sm-5">
                  <span className="stage">Certify</span>
                  <span className="stageStatus">Done</span>
                </span>
                <span className="deploymentStatus  col-sm-5 pt-2">
                  <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span>
                  <span className="statusTe">Completed</span>
                </span>
              </div>
          </div>
          
          {/* Deployment Stages */}
          
            </div>}
            </MuiThemeProvider>
        )
    }
}
export default Ecosystem;