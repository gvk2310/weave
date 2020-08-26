import React from 'react'
import {OnboardingTabs} from '../LoginPages/TopNav'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import { Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom';
import {OnboardTabs} from '../LoginPages/myWizLeftNav'
//import { browserHistory } from 'react-router';

class Infra extends React.Component{

    constructor(props){
        super(props);
        this.state={
            infra: [],
            delInfraName: '',
            name: '',
            fields: {},
            errors: {},
            isHiddenSearchBox: true,
            cloud: '',
            access: '',
            secret: '',
            rcfile: '',
            environment: '',
            orchestrator: '',
            password: '',
            url: '',
            next: false,
            previous: false,
            searchResult:'',
            response: '',
            conditionCloud: '',
            orcurl: '',
            orcusername: '',
            orcpassword: '',
            conditionOrchestrator: '',
        }
        this.handleCloud = this.handleCloud.bind(this);
        this.handleOrchestrator = this.handleOrchestrator.bind(this);
        
    }
    handleNext = () => {
      this.setState({next:true})
    }

    handleCloud = () => {
      this.setState({conditionCloud: this.refs.cloudType.value})
    }
    
    handleOrchestrator = () => {
      this.setState({
        conditionOrchestrator: this.refs.orchestrator.value,
        orcurl: '',
        orcusername: '',
        orcpassword: '',
      })
    }

      componentWillMount = () => {
        require('dotenv').config();    
        let API_URL = process.env.REACT_APP_ASSETONBOARDING;
        console.log(process.env)
        let token = sessionStorage.getItem('tokenStorage');
  
        let myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
          myHeaders.append('Access-Control-Allow-Credentials', 'true');
          myHeaders.append('GET', 'POST', 'OPTIONS');
  
          var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          //redirect: 'follow'
          };
          fetch(`${API_URL}/infra`, requestOptions)
          .then(response =>
            {console.log(response.status);
            console.log(typeof(response));
            console.log(response);
            if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)})};
            return response.json();
              })
          .then((findresponse)=>{
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
            if(findresponse.msg){
              this.setState({response:findresponse.msg})
            }else{
            this.setState({infra: findresponse})
            }
          })
          .catch(error => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
            console.log('error', error)
          });
  
      }

    handleAddInfra = () => {
        require('dotenv').config();    
        let API_URL = process.env.REACT_APP_ASSETONBOARDING;
        let token = sessionStorage.getItem('tokenStorage');
        let addInfraForm1 = document.getElementById('addInfraForm');
        let formData = new FormData(addInfraForm1);

        var raw = JSON.stringify(Object.fromEntries(formData));
        console.log(formData)
        console.log(raw);
        console.log([...this.state.infra, JSON.parse(raw)])

          /*Add Infra*/
          var myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append("Content-Type", "application/json");
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            };
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
          fetch(`${API_URL}/infra`, requestOptions)
          .then((response) => {
              console.log(response);
              console.log(response.status);
              if(response.status == 200){
                  var duplicateIndex = '';
                  const checkDuplicate = this.state.infra.filter((task,index) => {
                    if(task.infra_name == formData.get('infra_name')){
                      duplicateIndex = index;
                      return true;
                    }
                  });
                  if(checkDuplicate !== '')this.state.infra.splice(duplicateIndex, 1)
              this.setState({msgClass:'successMessage',infra: [...this.state.infra, JSON.parse(raw)]})
              }
              else{ 
                alert(response.status + '  ' +response.statusText);
               }
              return response.json();
            })
          .then(result => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
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
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
          alert('error', error)
        });
        document.getElementById("addInfraForm").reset();
    }

      hadleDelete = (event) => {
        this.setState({disabledBtn:true})
        console.log(this.state.delInfraName)
        //let raw = '{"infra_name" : "' + this.state.delInfraName + '"}';
        let raw={
          infra_name : this.state.delInfraName,
        }
        console.log(raw);
        const updatedArray = this.state.infra.filter(task => task.infra_name !== this.state.delInfraName);
        console.log(updatedArray);
        require('dotenv').config();    
              let API_URL = process.env.REACT_APP_ASSETONBOARDING;
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
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
                fetch(`${API_URL}/infra`, requestOptions)
                .then((response) => {
                  this.setState({disabledBtn:false})
                  document.querySelector('#myDeleteConfirmationModal .close').click();
                  console.log(response.status);
                  (response.status == 200) ? this.setState({msgClass:'successMessage',infra:updatedArray}) : this.setState({msgClass:'errorMessage'});     
                  return response.text();
                })
                  .then(result => {
                      if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                      console.log(result)
                      console.log(typeof(result));
                      let result1 = JSON.parse(result);
                      if(result1.msg){
                        alert(result1.msg)
                        }
                        this.setState({status:JSON.parse(result).message})
                        setTimeout(() => {this.setState({status:''})}, 3000);
                      })
                .catch(error => {
                    if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                    console.log('error', error)
                    this.setState({disabledBtn:false})
                    document.querySelector('#myDeleteConfirmationModal .close').click();
                });
    } 
    handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      
      //Name
      if(!fields["infra_name"]){
         formIsValid = false;
         errors["infra_name"] = "Cannot be empty";
      }
      //cloud_type
      if(!fields["cloud_type"]){
        formIsValid = false;
        errors["cloud_type"] = "Cannot be empty";
      }
      //environment
      if(!fields["environment"]){
        formIsValid = false;
        errors["environment"] = "Cannot be empty";
      }
      //orchestrator
      if(!fields["orchestrator"]){
        formIsValid = false;
        errors["orchestrator"] = "Cannot be empty";
      }

      if(fields["cloud_type"] == 'AWS'){
          //Access Key
          if(!fields["access_key"]){
            formIsValid = false;
            errors["access_key"] = "Cannot be empty";
          }
          //Secret Key
          if(!fields["secret_key"]){
            formIsValid = false;
            errors["secret_key"] = "Cannot be empty";
          }
      }
      if(fields["cloud_type"] == 'Openstack'){
      //RcFile
      if(!fields["RcFile"]){
        formIsValid = false;
        errors["RcFile"] = "Cannot be empty";
      }
      //URL
      if(!fields["orchestrator_url"]){
      let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      if(fields["orchestrator_url"]){var formElements = document.forms['addInfraForm'].elements['orchestrator_url'].value;
      if (!regexp.test(formElements)){
      formIsValid = false;
      errors["orchestrator_url"] = "Not a valid URL";
      }}}
      //orchestrator_username
      if(!fields["orchestrator_username"]){
        formIsValid = false;
        errors["orchestrator_username"] = "Cannot be empty";
      }
      //orchestrator_password
      if(!fields["orchestrator_password"]){
        formIsValid = false;
        errors["orchestrator_password"] = "Cannot be empty";
      }
    }
      
        this.setState({errors: errors});
        return formIsValid;
    }
    hadleDeleteBeforeConfirmation = (name) => {
      this.setState({delInfraName: name});
    } 
    handleChange(field, e){        
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
      let errors = {};

      // Call handleCloud based on user choice of cloud_type
      if(fields["cloud_type"] != undefined){
        this.handleCloud()
      }
      // Call handleDictionary based on user choice of orchestrator
      if(fields["orchestrator"] != undefined){
        this.handleOrchestrator()
      }

      const checkDuplicate = this.state.infra.filter(task => task.infra_name == fields["infra_name"]);
      console.log(checkDuplicate);
      if(checkDuplicate.length>0){
      errors["infra_name"] = "Infra name already exists, Do you want to update?";
      this.setState({errors: errors});
      }
      else{
        errors["infra_name"] = "";
      this.setState({errors: errors});
      }
  }
    contactSubmit = (e) => {
      console.log('inside contactSubmit')
      e.preventDefault();
      if(this.handleValidation()){
         document.querySelector('#myAddInfraModal .close').click();
         this.handleAddInfra();
      }else{
         alert("Form has errors.")
      }
    }
    toggleHiddenSearchBox = () => {
      this.setState({isHiddenSearchBox: !this.state.isHiddenSearchBox})
    }
    handleSearchEvent = (event) => {
      this.setState({searchResult:this.refs.searchKey.value})
    }
    render(){   
      
        /*Display Infra Details in the Table*/
        let infra = '';
        let resultingInfra = []; 
        if(this.state.infra.length>0){
        resultingInfra = this.state.infra.filter(infra => infra.infra_name.toLowerCase().indexOf(this.state.searchResult.toLowerCase()) != -1);
        } 
        console.log(resultingInfra)
        console.log(this.state.infra);
        if(resultingInfra.length >= 1) 
        {
          infra = resultingInfra.map((value,index) => {
                  return <tr className="" key={index}>
                            <td>{value.infra_name}</td>
                            <td>{value.cloud_type}</td>
                            <td>{value.environment}</td>
                            <td>{value.orchestrator}</td>
                            <td><button data-toggle="modal" data-target="#myDeleteConfirmationModal" onClick={() => this.hadleDeleteBeforeConfirmation(value.infra_name)} className="mx-2 fa fa-trash fa-x p-1 pt-2 deleteRow"></button></td>
                        </tr>
          })
        }
        else if(this.state.infra.length == 0){infra = <tr><td class="text-center text-primary" colSpan="5">{this.state.response}</td></tr>;}
        else { infra = <tr><td class="text-center text-primary" colSpan="5">No Data To Display</td></tr>;}  
      
          /*Display Infra Details in the Table*/
          /*Add Infra Modal Body*/
            let addInfraModal = <form className="modalbody" id='addInfraForm' onSubmit= {this.contactSubmit.bind(this)}> 
            <div>             
        <label className="w-25 px-3" for="email">Name :</label>
        <TextField
            type="text"
            name="infra_name"
            onChange={this.handleChange.bind(this, "infra_name")}
            />
            <span style={{color: "red"}}>{this.state.errors["infra_name"]}</span>
            <br/> 
        <label className="w-25 px-3" for="email">Cloud :</label>
        <select ref="cloudType" name="cloud_type" onChange={this.handleChange.bind(this, "cloud_type")} className="input-group-text my-2 w-50">
                <option selected disabled>Select Cloud</option>
                <option>AWS</option>
                <option>Openstack</option>
          </select>
          <span style={{color: "red"}}>{this.state.errors["cloud_type"]}</span>
          <br/>
          { this.state.conditionCloud == 'AWS' &&
         <><label className="w-25 px-3" for="email">Access Key :</label>
        <TextField
            type="password"
            name="access_key"
            onChange={this.handleChange.bind(this, "access_key")}
            />
            <span style={{color: "red"}}>{this.state.errors["access_key"]}</span>
            <br/> 
        <label className="w-25 px-3" for="email">Secret Key :</label>
        <TextField
            type="password"
            name="secret_key"
            onChange={this.handleChange.bind(this, "secret_key")}
            />
            <span style={{color: "red"}}>{this.state.errors["secret_key"]}</span>
            <br/></> 
          }
           { this.state.conditionCloud == 'Openstack' &&
            <><label className="w-25 px-3" for="email">Rcfile :</label>
            <textarea
                type="text"
                //value={this.state.rcfile}
                multiline
                name="RcFile"
                onChange={this.handleChange.bind(this, "RcFile")}
                //rows={4}
                rows="4"
                cols="30"
                />
                <span style={{color: "red"}}>{this.state.errors["RcFile"]}</span>
                <br/> 
            </>
            }
        <label className="w-25 px-3" for="email">Environment :</label>
        <select ref="infraName" name="environment"  onChange={this.handleChange.bind(this, "environment")} className="input-group-text my-2 w-50">
                <option selected disabled>Select Environment</option>
                <option>Demo</option>
                <option>Test</option>
                <option>Dev</option>
                <option>Stage</option>
                <option>Production</option>
          </select>
          <span style={{color: "red"}}>{this.state.errors["environment"]}</span>
          <br/>  
          { this.state.conditionCloud == 'AWS' &&
              <><label className="w-25 px-3" for="email">Orchestrator :</label>
              <select ref="orchestrator" name="orchestrator" onChange={this.handleChange.bind(this, "orchestrator")} className="input-group-text my-2 w-50">
              <option selected disabled>Select Orchestrator</option>
              <option>Cloudformation</option>
              </select>
              <span style={{color: "red"}}>{this.state.errors["orchestrator"]}</span>
              <br/>
               </>
          }
          { this.state.conditionCloud == 'Openstack' &&
        <><label className="w-25 px-3" for="email">Orchestrator :</label>
            <select ref="orchestrator" name="orchestrator" onChange={this.handleChange.bind(this, "orchestrator")} className="input-group-text my-2 w-50">
            <option selected disabled>Select Orchestrator</option>
              <option>OSM</option>
              <option>Cloudify</option>
            </select>
            <span style={{color: "red"}}>{this.state.errors["orchestrator"]}</span>
            <br/> </>}
          
            {((this.state.conditionOrchestrator == 'OSM' || this.state.conditionOrchestrator == 'Cloudify') && this.state.conditionCloud == 'Openstack') &&
            <><label className="w-25 px-3" for="email">Url :</label>
          <TextField
              type="text"
              name="orchestrator_url"
              onChange={this.handleChange.bind(this, "orchestrator_url")}
              />
              <span style={{color: "red"}}>{this.state.errors["orchestrator_url"]}</span>
              <br/>
          <label className="w-25 px-3" for="email">User Name :</label>
          <TextField
              type="text"
              name="orchestrator_username"
              onChange={this.handleChange.bind(this, "orchestrator_username")}
              />
              <span style={{color: "red"}}>{this.state.errors["orchestrator_username"]}</span>
              <br/>
           <label className="w-25 px-3" for="email">Password :</label>
          <TextField
              type="password"
              name="orchestrator_password"
              onChange={this.handleChange.bind(this, "orchestrator_password")}
              />
              <span style={{color: "red"}}>{this.state.errors["orchestrator_password"]}</span>
              <br/> </>
          }
          
        </div>
        </form>
        /*Add Infra Modal Body*/

        return(
            <MuiThemeProvider>
          <div className="row container-fluid">
          
            {/* left nav */}
        <div className="col-lg-1">
            <OnboardTabs selected="Infra"/>
        </div>
            {/* left nav */}
            {/* Main Content */}
        <div className="container-fluid col-lg-11 mainContent pl-5">
        <div className="rightContainer">
                  <span className="pageHeading pr-5">Infra Onboarding</span>
                    <div className="topRight float-right">
                      {!this.state.isHiddenSearchBox && <input className="mr-2 rounded"type="text" id="country" name="country" placeholder="Search Here.." ref="searchKey" onChange={this.handleSearchEvent}/>}
                      <span className="toprightIcons"><i class="fa fa-search" aria-hidden="true" onClick={this.toggleHiddenSearchBox}></i></span>
                      <span className="toprightIcons"><i class="fa fa-sliders" aria-hidden="true"></i>Filter</span>
                      <button id="addInfraBtn" className="mx-2" data-toggle="modal" data-target="#myAddInfraModal"><span className="fa fa-plus"></span> Add</button>
                    </div>
                </div>  
            {/* /Infra Table/ */}
            <table className="table table-hover">
            <thead className="">
                <tr className="">
                    <th className="">Name</th>
                    <th className="">Cloud</th>
                    <th className="">Environment</th>
                    <th className="">Orchestrator</th>
                    <th className="">Action</th>

                </tr>
            </thead>
            <div id="loader"></div>
            <tbody>
                  {infra}
            </tbody>    
            </table>
            <hr/>
            {/* /Infra Table/ */}
            {/* /*My Add Infra Modal*/ }
            <div className="container">
            <div className="modal" id="myAddInfraModal">
              <div className="modal-dialog">
                <div className="modal-content">
                
                  {/* <!-- Modal Header --> */}
                  <div className="modal-header">
                    <h4 className="modal-title">Add</h4>
                    <button id="closeAddInfraModalBtn" type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                    {addInfraModal}
                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                    <button id="submitAddInfraModalBtn" type="button" className="btn btn-success" onClick= {this.contactSubmit.bind(this)}>Submit</button>
                  </div>
                  
                </div>
              </div>
            </div>
            </div>
            {/* /*My Add Infra Modal*/ }
            {/* /*My Delete Popup Modal*/ }
            <div className="container">
              <div className="modal" id="myDeleteConfirmationModal">
                <div className="modal-dialog">
                  <div className="modal-content">
                  
                    {/* <!-- Modal Header --> */}
                    <div className="modal-header">
                      <h4 className="modal-title">Delete Confirmation</h4>
                      <button id="closeDeleteInfraModalBtn" type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    {/* <!-- Modal body --> */}
                      <div className="modal-body text-center text-danger">
                        <div className>Are you sure!!</div>
                      </div>
                    {/* <!-- Modal footer --> */}
                    <div className="modal-footer">
                      <button id="deleteDeleteInfraModalBtn" type="button" className="btn btn-danger" value="no" onClick={(event) => this.hadleDelete(event)} disabled={this.state.disabledBtn}>Delete</button>
                    </div>
                    </div>
                  </div>
                </div>
                </div>
              {/* /*My Delete Popup Modal*/ }
            {/* Previous an Next Button */}
            <div className="py-3">
                <div className="float-right">
                <Link to="/Onboarding/Repository" ><button id="previousPageInfra" type="button" className="btn btn-primary mx-1 px-5">Previous</button></Link>
                <Link to="/Onboarding/Asset" ><button id="nextPageInfra" type="button" className="btn btn-primary mx-1 px-5">Next</button></Link>
                </div>
            </div>
            {/* Previous an Next Button */}
            </div>
              {/* Main Content */}
        </div>
            </MuiThemeProvider>
        )
    }
}
export default Infra;