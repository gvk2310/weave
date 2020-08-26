import React from 'react'
import {OnboardingTabs} from '../LoginPages/TopNav'
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router-dom';
import '../LoginPages/Login.css'
import { Redirect } from 'react-router-dom';
import {OnboardTabs} from '../LoginPages/myWizLeftNav'

class Repository extends React.Component{

    // componentDidMount = () => {
    //     document.querySelector('.dome').classList.remove('activeNav');
    //     document.getElementById('topnav-0').classList.add('activeNav');
    //   }

    constructor(props){
        super(props);
        this.state={
            name: '',
            password: '',
            isHiddenSearchBox: true,
            username: '',
            url: '',
            type: '',
            currentAssetName : '',
            repoType: '',
            repo: [],
            msgClass: '',
            searchResult:'',
            response: '',
            fields: {},
            errors: {},
            currentRepo: '',
            delRepoName: '',
            delConfirmation: 'yes',
            modal: '',
            disabledBtn: false,
            NameList: ['EPC-Dev-Repo','IMS-Team-Repo','Versa-SDWAN-Artifact'],
            TypeList: ['jfrog','nexus'],
            UrlList: ['http://customer1.accenture.com/EPC-Dev-Repo','	http://customer2.Ericsson.com/IMS-Storage','http://customer1.SDWAN.accenture.com/EPC-Dev-Repo'],
        }
    }
    componentDidMount = () => {
      // var es = new EventSource("http://localhost:3000/");
      // es.onmessage = function(event){
      //     console.log(event.data);
      //     document.getElementById("AssetName").innerHTML += event.data +"<br/>";
      // }
      let myHeaders = new Headers();
              myHeaders.append('Access-Control-Allow-Origin', '*');
              myHeaders.append('Access-Control-Allow-Credentials', 'true');
              myHeaders.append('GET', 'POST', 'OPTIONS');
      
              var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              //redirect: 'follow'
              };
//     fetch('http://localhost:8080/dummy', requestOptions)
//         .then(response =>{return response.json();})
//         .then((findresponse)=>{
//           console.log(findresponse)
//         })
//         .catch(error => alert('error', error));
    }
    componentWillMount = () => {

      // var es = new EventSource("http://localhost:3000/");
      // es.onmessage = function(event){
      //     console.log(event.data);
      //     document.getElementById("AssetName").innerHTML += event.data +"<br/>";
      // }

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
        fetch(`${API_URL}/repo`, requestOptions)
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
          this.setState({repo: findresponse})
            //Display Assets linked with repo
              let currentAssetName = '';
              let currRepo =  findresponse[0];
              if(currRepo != undefined){
              if(currRepo.assets_info.length>0)
              {
                console.log('inside if')
              currentAssetName = currRepo.assets_info.map((value1, index1) => {
                return(<>
                  <div className="statusTable row">
                    <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                    <span className="assetInfo col-sm-5 block1">
                          <span className="stage" id="AssetName">{value1.asset_name}</span>
                          <span className="stageStatus">{value1.asset_version}</span>
                    </span>
                    <span className="assetInfo  col-sm-5 pt-2 block2">
                      {/* <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span> */}
                      <span><span className="assetField">Group </span> : <span>{value1.asset_group}</span></span>
                      <span><span className="assetField">Vendor </span> : <span>{value1.asset_vendor}</span></span>
                      <span><span className="assetField">Type </span> : <span>{value1.asset_type}</span></span>
                    </span>
                  </div>
                  </>)
                })
              }
              else{
                console.log('inside else')
                currentAssetName =
                <>
                  <div className="statusTable row">
                    <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
                    <span className="assetBlank col-sm-10">
                          <span className="stage" id="AssetName">No assets to display</span>
                    </span>
                  </div>
                </>
              }
                console.log(currentAssetName)
                  this.setState({currentRepo:currRepo.repo_name, currentAssetName:currentAssetName})
            }
          }
          //Display Assets linked with repo
        })
        .catch(error => {
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
          alert('error', error)
        });


    }
    handleAlreadyExistingRepository = () => {
        
    }
    
    handleAddRepository = () => {

      //this.setState({modal:''})
      console.log('inside add repo')
      require('dotenv').config();    
      let API_URL = process.env.REACT_APP_ASSETONBOARDING;
      console.log(process.env)
      let token = sessionStorage.getItem('tokenStorage');

            let addServicesForm = document.getElementById('addRepositoryForm');
            let formData = new FormData(addServicesForm);
            var raw = JSON.stringify(Object.fromEntries(formData));
            // var raw1 = raw (": []")
            let raw1 = JSON.stringify(Object.assign(Object.fromEntries(formData), {'assets_info': []}));
            console.log(raw1)
            console.log(formData);
            console.log(formData.get('repo_name'));
            console.log(raw);
            /*Add Repository*/
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              dataType: "json",
              //redirect: 'follow'
              };
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
            fetch(`${API_URL}/repo`, requestOptions)
            .then((response) => {
              console.log(response);
              console.log(response.status);
              if(response.status == 200){
                  var duplicateIndex = '';
                  const checkDuplicate = this.state.repo.filter((task,index) => {
                    if(task.repo_name == formData.get('repo_name')){
                      duplicateIndex = index;
                      return true;
                    }
                  });
                  console.log(checkDuplicate);
                  if(checkDuplicate.length>0)this.state.repo.splice(duplicateIndex, 1)
              this.setState({msgClass:'successMessage',repo: [...this.state.repo, JSON.parse(raw1)]})
              }
              else{ 
                alert(response.status + '  ' +response.statusText);
               }
              return response.json();
            })
            .then(result => {
              if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
              console.log(result)
              console.log(typeof(result))
              
              if(result.msg){
              alert(result.msg)
              }
              this.setState({status:JSON.parse(result).message})
              setTimeout(() => {this.setState({status:''})}, 3000);
            })
          .catch(error => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
            console.log('error', error)
          });
          document.getElementById("addRepositoryForm").reset();
    }

    contactSubmit = (e) => {
      console.log('inside contactSubmit')
      e.preventDefault();
      if(this.handleValidation()){
        //  this.setState({modal:'modal'})
         document.querySelector('#myAddRepositoryModal .close').click();
         this.handleAddRepository();
      }else{
         alert("Form has errors.")
      }

    }

    handleChange(field, e){         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
        let errors = {};

        const checkDuplicate = this.state.repo.filter(task => task.repo_name == fields["repo_name"]);
        console.log(checkDuplicate);
        if(checkDuplicate.length>0){
        errors["repo_name"] = "Repo name already exists, Do you want to update?";
        this.setState({errors: errors});
        }
        else{
          errors["repo_name"] = "";
        this.setState({errors: errors});
        }
    }

    handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      
      //Name
      if(!fields["repo_name"]){
         formIsValid = false;
         errors["repo_name"] = "Cannot be empty";
      }

      //Vendor
      if(!fields["repo_vendor"]){
        formIsValid = false;
        errors["repo_vendor"] = "Cannot be empty";
     }
      //Type
      if(!fields["repo_type"]){
        formIsValid = false;
        errors["repo_type"] = "Cannot be empty";
    }
      //URL
      if(!fields["repo_url"]){
      let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      var formElements = document.forms['addRepositoryForm'].elements['repo_url'].value;
      if (!regexp.test(formElements)){
      formIsValid = false;
      errors["repo_url"] = "Not a valid URL";
      }
    }
    //   //UserName
    //   if(!fields["repo_username"]){
    //     formIsValid = true;
    //     errors["repo_username"] = "Cannot be empty";
    // }
    //   //Password
    //   if(!fields["repo_password"]){
    //     formIsValid = true;
    //     errors["repo_password"] = "Cannot be empty";
    //   }
        this.setState({errors: errors});
        return formIsValid;
    }

    hadleDelete = (event) => {
      this.setState({disabledBtn:true})
      console.log(this.state.delRepoName)
      //let raw = '{"repo_name" : "' + this.state.delRepoName + '"}';
      let raw={
        repo_name : this.state.delRepoName,
        delete_assets : event.target.value
      }
      console.log(raw);
      const updatedArray = this.state.repo.filter(task => task.repo_name !== this.state.delRepoName);
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
              fetch(`${API_URL}/repo`, requestOptions)
              .then((response) => {
                this.setState({disabledBtn:false})
                document.querySelector('#myDeleteConfirmationModal .close').click();
                console.log(response.status);
                (response.status == 200) ? this.setState({msgClass:'successMessage',repo:updatedArray}) : this.setState({msgClass:'errorMessage'});     
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

    hadleDeleteBeforeConfirmation = (name) => {
      this.setState({delRepoName: name});
    }
    displayAssetList = (currRepo) => {
      // this.setState({currentRepo:currRepo.repo_name})
      console.log(currRepo.assets_info);
      console.log(currRepo.assets_info.length);
      let currentAssetName = '';
      if(currRepo.assets_info.length>0)
      {
        console.log('inside if')
      currentAssetName = currRepo.assets_info.map((value1, index1) => {
        return(<>
          <div className="statusTable row">
            <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
            <span className="assetInfo col-sm-5 block1">
                  <span className="stage" id="AssetName">{value1.asset_name}</span>
                  <span className="stageStatus">{value1.asset_version}</span>
            </span>
            <span className="assetInfo  col-sm-5 pt-2 block2">
              {/* <span className="statusIcon"><i class="fa fa-check-circle p-1" aria-hidden="true"></i></span> */}
              <span><span className="assetField">Group </span> : <span>{value1.asset_group}</span></span>
              <span><span className="assetField">Vendor </span> : <span>{value1.asset_vendor}</span></span>
              <span><span className="assetField">Type </span> : <span>{value1.asset_type}</span></span>
            </span>
          </div>
          </>)
        })
      }
      else{
        console.log('inside else')
        currentAssetName =
        <>
          <div className="statusTable row">
            <span className="depStageBar col-sm-1"><vr className="verticalLine"/></span>
            <span className="assetBlank col-sm-10">
                  <span className="stage" id="AssetName">No assets to display</span>
            </span>
          </div>
        </>
      }
        console.log(currentAssetName)
          this.setState({currentRepo:currRepo.repo_name, currentAssetName:currentAssetName})
    }
    toggleHiddenSearchBox = () => {
      this.setState({isHiddenSearchBox: !this.state.isHiddenSearchBox})
    }
    handleSearchEvent = (event) => {
      this.setState({searchResult:this.refs.searchKey.value})
    }
    render(){

        /*Display Repository Details in the Table*/
        let repository = '';
        let resultingAsset = []; 
        if(this.state.repo.length>0){
        resultingAsset = this.state.repo.filter(repo => repo.repo_name.toLowerCase().indexOf(this.state.searchResult.toLowerCase()) != -1);
        } 
        console.log(resultingAsset)
        console.log(this.state.repo);
        if(resultingAsset.length > 0) {
          repository = resultingAsset.map((value,index) => {            
                  return <tr className="" key={index} onMouseOver={() => this.displayAssetList(value)}>
                            <td>{value.repo_name}</td>
                            <td>{value.repo_vendor}</td>
                            <td>{value.repo_type}</td>
                            <td>{value.repo_url}</td>
                            <td><button data-toggle="modal" data-target="#myDeleteConfirmationModal" onClick={() => this.hadleDeleteBeforeConfirmation(value.repo_name)} className="mx-2 fa fa-trash fa-x p-1 pt-2 deleteRow"></button></td>
                        </tr>
          })
        }
        else if(this.state.repo.length == 0){repository = <tr><td class="text-center text-primary" colSpan="5">{this.state.response}</td></tr>;}
      else repository = <tr><td class="text-center text-primary" colSpan="5">No Data To Display</td></tr>;
        /*Add Repository Modal Body*/
        let addRepositoryModal = <form className="modalbody" id='addRepositoryForm' onSubmit= {this.contactSubmit.bind(this)}> 
                <div>  
                <label className="w-25 px-3" htmlFor="email">Name :</label>
                <TextField
                    type="text"
                    name="repo_name"
                    onChange={this.handleChange.bind(this, "repo_name")}
                    />
                    <span style={{color: "red"}}>{this.state.errors["repo_name"]}</span>
                    <br/>
                <label className="w-25 px-3" htmlFor="vendor">Vendor :</label>
                <select name="repo_vendor" onChange={this.handleChange.bind(this, "repo_vendor")} class="input-group-text my-2 w-50" required>
                                            <option selected disabled>Select Repository Vendor</option>
                                            <option>jfrog</option>
                                            <option disabled>nexus</option>
                                  </select>
                                  <span style={{color: "red"}}>{this.state.errors["repo_vendor"]}</span>
                                  <br/>
                <label className="w-25 px-3" htmlFor="type">Type :</label>
                <select name="repo_type" onChange={this.handleChange.bind(this, "repo_type")} class="input-group-text my-2 w-50" required>
                                            <option selected disabled>Select Repository Type</option>
                                            <option>local</option>
                                            <option>remote</option>
                                    </select>
                                    <span style={{color: "red"}}>{this.state.errors["repo_type"]}</span>
                                    <br/>
                <label className="w-25 px-3" onChange={this.handleChange.bind(this, "repo_url")} htmlFor="url">URL :</label>
                <TextField
                    type="url"
                    name="repo_url"
                    />
                    <span style={{color: "red"}}>{this.state.errors["repo_url"]}</span>
                    <br/>
                <label className="w-25 px-3" onChange={this.handleChange.bind(this, "repo_username")} htmlFor="email">User Name :</label>
                <TextField
                    type="text"
                    name="repo_username"
                    />
                    <span style={{color: "red"}}>{this.state.errors["repo_username"]}</span>
                    <br/>
                <label className="w-25 px-3" onChange={this.handleChange.bind(this, "repo_password")} htmlFor="email">Password :</label>
                <TextField
                    type="password"
                    name="repo_password"
                    />
                    <span style={{color: "red"}}>{this.state.errors["repo_password"]}</span>
                    <br/>
                <br/>        
            </div>
        </form>

        return(
            <MuiThemeProvider>
          <div className="row container-fluid">
          
            {/* left nav */}
        <div className="col-lg-1">
            <OnboardTabs selected="Repository"/>
        </div>
            {/* left nav */}
            {/* Main Content */}
        <div className="container-fluid col-lg-8 mainContent pl-5">
                <div className="rightContainer">
                {/* <div class="counter">
                  <p class="counterHolder">
                      <span class="counterTitle">q</span>
                      <span class="CounterNumbers">03</span>
                    </p>
                  </div> */}
                  <span className="pageHeading pr-5">Repo Onboarding</span>
                    <div className="topRight float-right">
                      {!this.state.isHiddenSearchBox && <input className="mr-2 rounded"type="text" id="country" name="country" placeholder="Search Here.." ref="searchKey" onChange={this.handleSearchEvent}/>}
                      <span className="toprightIcons"><i class="fa fa-search" aria-hidden="true" onClick={this.toggleHiddenSearchBox}></i></span>
                      <span className="toprightIcons"><i class="fa fa-sliders" aria-hidden="true"></i>Filter</span>
                      <button id="addRepoBtn" className="mx-2" data-toggle="modal" data-target="#myAddRepositoryModal"><span className="fa fa-plus"></span> Add</button>
                    </div>
                </div>  
                    {/* /Repository Table/ */}
                    <table className="table table-hover">
                    <div id="loader"></div>
                    <thead className="">
                        <tr><th>Name</th><th>Vendor</th><th>Type</th><th>URL</th><th>Action</th></tr></thead>
                        <tbody>
                        {/* <tr><td>EPC-Dev-Repo</td><td>jfrog</td><td>http://customer1.accenture.com/EPC-Dev-Repo</td></tr>
                        <tr><td>IMS-Team-Repo</td><td>nexus</td><td>http://customer2.Ericsson.com/IMS-Storage</td></tr>
                        <tr><td>Versa-SDWAN-Artifact</td><td>jfrog</td><td>http://customer1.SDWAN.accenture.com/EPC-Dev-Repo</td></tr> */}
                        {repository}
                        </tbody>
                    </table>
                    <hr/>
            {/* /*My Add Modal*/ }
            <div className="container">
            <div className="modal" id="myAddRepositoryModal">
              <div className="modal-dialog">
                <div className="modal-content">
                
                  {/* <!-- Modal Header --> */}
                  <div className="modal-header">
                    <h4 className="modal-title">Add</h4>
                    <button id="closeAddRepoModalBtn" type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                    {addRepositoryModal}
                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                    <button id="submitAddRepoModalBtn" type="button" className="btn btn-success" onClick= {this.contactSubmit.bind(this)}>Submit</button>
                  </div>
                  
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
                      <button id="closeDeleteRepoModalBtn" type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    {/* <!-- Modal body --> */}
                      <div className="modal-body text-center text-danger">
                        <div className>Are you sure!!</div>
                        <div>You want all the associated assets with this repo to be deleted?</div>
                      </div>
                    {/* <!-- Modal footer --> */}
                    <div className="modal-footer">
                      <button id="deleteOnlyRepoModalBtn" type="button" className="btn btn-danger" value="False" onClick={(event) => this.hadleDelete(event)} disabled={this.state.disabledBtn}>Delete Only Repo</button>
                      <button id="deleteAllRepoModalBtn" type="button" className="btn btn-danger" value="True" onClick={(event) => this.hadleDelete(event)} disabled={this.state.disabledBtn}>Delete All</button>
                    </div>
                    </div>
                  </div>
                </div>
                </div>


                  <div className="py-3">
                  <div className="float-right">                               
                  <Link to="/Onboarding/Infra" ><button  id="nextPageRepo" type="button" className="btn btn-primary mx-1 px-5" >Next</button></Link>
                  </div>
              </div>
                </div>
              {/* Main Content */}
              {/* Assets inside Repo  */}
          <div className="col-lg-3  ">
              <p className="displayAsset Title">Associated Assets</p>
              <p className="DepName">{this.state.currentRepo}</p>            
              <div className="displayAssetContainer">{this.state.currentAssetName}</div>
          </div>
          
          {/* Assets inside Repo  */}
        </div>
            </MuiThemeProvider>
        )
    }
}
export default Repository;