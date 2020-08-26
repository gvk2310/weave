import React from 'react'
import {OnboardingTabs} from '../LoginPages/TopNav'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import { Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom';
import {OnboardTabs} from '../LoginPages/myWizLeftNav'

class Asset extends React.Component{

    constructor(props){
        super(props);
        this.state={
            group: '',
            name: '',
            type: '',
            vendor: '',
            version: '',
            uploadto: '',
            uploadfile: '',
            isHiddenSearchBox: true,
            fields: {},
            errors: {},
            security: '',
            asset: [],
            repo:[],
            delAsset:'',
            msgClass:'',
            selectedFile: null,
            delAssetWithIndex: '',
            loaded: 0,
            disabledBtn: false,
            repoType: '',
            searchResult:'',
            response: '',
            nameList: ['PCRF_v4.qcow2','PCRF_Config','PCRF_VNFD.tar.gz','PCRF_NSD.tar.gz','CSCF_v3.qcow2','SDWAN_Director_16.ami','SDWAN_Controller.ami','SDWAN_Flex.ami','SDWAN_Flex_CF','SDWAN_Controller_CF','SDWAN_Director_CF','Versa_Director.qcow2','Versa_Controller.qcow2','Versa_Analytics.qcow2','Versa_Flex.qcow2','Versa_Director_VNFD.tar.gz','Versa_Controller_VNFD.tar.gz','Versa_Analytics_VNFD.tar.gz','Versa_Flex_VNFD.tar.gz','Versa_Director_NSD.tar.gz','Versa_Controller_NSD.tar.gz','Versa_Analytics_NSD.tar.gz','Versa_Flex_NSD.tar.gz','Versa_Flex_Config','Versa_Director_Config','Versa_Controller_Config','Versa_Analytics_Config','Versa_Flex_Config'],
            vendorList: ['Ericsson','Ericsson','Ericsson','Ericsson','Ericsson','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa','Versa'],
            groupList: ['IMS','IMS','IMS','IMS','IMS','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN','SDWAN'],
            typeList: ['VNF','Config',' VNFD','NSD',' VNFD','VNF','VNF','VNF','CF_Template','CF_Template','CF_Template','VNF','VNF','VNF','VNF','VNFD','VNFD','VNFD','VNFD','NSD','NSD','NSD','NSD','Config','Config','Config','Config','Config'],
            sizeList: [' 4.6G','2.0k','2.0k','2.0k','3.1G','6.5G','4.5G','5.3G','3.0k','2.7k','1.1k','6.5G','4.5G','6.5G','6.5G','1.0k','1.4k','2.0k','2.0k','1.0k','1.4k','2.0k','2.0k','2.0k','1.0k','1.4k','2.0k','2.0k'],
            versionList: ['4.5','4.5','4.5','4.5','3.1','16.4','15.3','14.2','14.2','15.3','16.4','12.4','15.4','12.4','12.4','12.4','12.4','13.4','13.4','12.4','16.4','16.4','16.4','16.4','16.4','16.4','16.4','16.4'],
            securityList: ['Verified','Verified','Verified','Verified','NotVerified','Verified','Verified','Verified','Verified','Verified','Verified','NotVerified','NotVerified','NotVerified','NotVerified','NotVerified','NotVerified','NotVerified','NotVerified','Verified','Verified','Verified','Verified','Verified','Verified','Verified','Verified','Verified','Verified'],
        }
        this.handleRepoType = this.handleRepoType.bind(this);
    }
    
      componentDidMount = () => {
        require('dotenv').config();    
        let API_URL = process.env.REACT_APP_ASSETONBOARDING;
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
          fetch(`${API_URL}/asset`, requestOptions)
          .then(response =>
            {console.log(response);
              if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)})};
            return response.json();
              })
          .then((findresponse)=>{
              if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
               if(findresponse.msg){
                this.setState({response:findresponse.msg})
                }else{
                      this.setState({asset: findresponse})
                }
          })
          .catch(error => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
            console.log('error', error)
            });
          
          //Fetch Repo
          fetch(`${API_URL}/repo`, requestOptions)
          .then(response =>
            {console.log(response.status);
            console.log(typeof(response));
            //if(response.status != 200){alert(response.status + "  " + response.statusText)};
            return response.json();
              })
          .then((findresponse)=>{
            console.log(findresponse);
            this.setState({repo: findresponse})
          })
          .catch(error => console.log('error', error));
      }
    handleRepoType = () => {
      var e = document.getElementById("SelectAsset");
      var option= e.options[e.selectedIndex];
      var repoType = option.getAttribute("data-type");
      this.setState({repoType:repoType})
      console.log(repoType)
    }
    handleAddAsset = () => {
          require('dotenv').config();    
          let API_URL = process.env.REACT_APP_ASSETONBOARDING;
          let token = sessionStorage.getItem('tokenStorage');

            let addAssetForm1 = document.getElementById('addAssetForm');
            let fileInput = document.getElementById('asset_file')
            let formData = new FormData(addAssetForm1);
            if(this.state.repoType=='local'){
              formData.append("asset_file", fileInput.files[0], fileInput.files[0].name );
            }
      // formData.append("asset_file", fileInput.files[0], "/C:/Users/namrata.a.yadav/Documents/myte snap.png");

            var raw = JSON.stringify(Object.fromEntries(formData));
            console.log(Object.fromEntries(formData))
            console.log(formData.getAll('asset_file'));
            console.log(formData)
            console.log(raw);

            /*Add Asset*/
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            //myHeaders.append("Content-Type", "multipart/form-data");
            // myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formData,
              //dataType: "json",
              //redirect: 'follow'
              };
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
            fetch(`${API_URL}/asset`, requestOptions)
            .then((response) => {
              console.log(response);
              console.log(response.status);
              (response.status == 200) ? this.setState({msgClass:'successMessage',asset: [...this.state.asset, JSON.parse(raw)]}) : alert(response.status + '  ' +response.statusText);
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
          document.getElementById("addAssetForm").reset();
    }

    hadleDelete = () => {
      console.log(this.state.delAsset);
        this.setState({disabledBtn:true})
        let raw={
          asset_id : this.state.delAsset,
        }
        console.log(JSON.stringify(raw));

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
                fetch(`${API_URL}/asset`, requestOptions)
                .then((response) => {
                  this.setState({disabledBtn:false})
                  document.querySelector('#myDeleteConfirmationModal .close').click();
                  console.log(response.status, response.statusText);
                  if(response.status == 200) {
                      this.state.asset.splice(this.state.delAssetWithIndex, 1);
                      this.setState({msgClass:'successMessage'})
                    }
                  else{
                     this.setState({msgClass:'errorMessage'})
                  };     
                  return response.text();
                })
                  .then(result => {
                      if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                      console.log(result)
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
    handleChange(field, e){         
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
      let errors = {};
      this.setState({errors: errors});

      // Call handleRepoType based on user choice of Upload To
      if(fields["asset_repository"] != undefined){
        this.handleRepoType()
      }
  }
  
    handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      
      //Name
      if(!fields["asset_group"]){
         formIsValid = false;
         errors["asset_group"] = "Cannot be empty";
      }
      //asset_name
      if(!fields["asset_name"]){
        formIsValid = false;
        errors["asset_name"] = "Cannot be empty";
      }
      //asset_type
      if(!fields["asset_type"]){
        formIsValid = false;
        errors["asset_type"] = "Cannot be empty";
      }
      //asset_vendor
      if(!fields["asset_vendor"]){
        formIsValid = false;
        errors["asset_vendor"] = "Cannot be empty";
      }
      //asset_repository
      if(!fields["asset_repository"]){
        formIsValid = false;
        errors["asset_repository"] = "Cannot be empty";
      }
      //asset_version
      if(!fields["asset_version"]){
        formIsValid = false;
        errors["asset_version"] = "Cannot be empty";
      }
      if(this.state.repoType=='local'){
      //asset_file
      if(!fields["asset_file"]){
        formIsValid = false;
        errors["asset_file"] = "Cannot be empty";
      }
    }
      if(this.state.repoType=='remote'){
        console.log('inside remote')
      //asset_path
      if(!fields["asset_path"]){
        formIsValid = false;
        errors["asset_path"] = "Cannot be empty";
      }      
    }
        this.setState({errors: errors});
        return formIsValid;
    }
    contactSubmit = (e) => {
      e.preventDefault();
      if(this.handleValidation()){
         document.querySelector('#myAddAssetModal .close').click();
         this.handleAddAsset();
      }else{
         alert("Form has errors.")
      }
    }
    hadleDeleteBeforeConfirmation = (index, name) => {
      this.setState({delAsset: name, delAssetWithIndex: index});
    }
    toggleHiddenSearchBox = () => {
      this.setState({isHiddenSearchBox: !this.state.isHiddenSearchBox})
    }
    handleSearchEvent = (event) => {
      this.setState({searchResult:this.refs.searchKey.value})
    }
    render(){

    var obj = {};
    for ( var i=0, len=this.state.asset.length; i < len; i++ ){
      var currElement= this.state.asset[i];
      obj[currElement.asset_type] = currElement.asset_type
            //console.log(currElement, currElement.asset_type)
        }
    let assetType = Object.keys(obj);
    console.log(assetType);
        // Count Vendor Length
        var obj1 = {};

        for ( var i=0, len=this.state.asset.length; i < len; i++ )
            obj1[this.state.asset[i]['asset_vendor']] = this.state.asset[i];

        let asset1 = new Array();
        for ( var key in obj1 )
              asset1.push(obj1[key]);
              console.log(asset1)
        // Count Vendor Length
        /*Display Asset Details in the Table*/
        let Asset = '';
        let resultingAsset = []; 
        if(this.state.asset.length>0){
        resultingAsset = this.state.asset.filter(asset => asset.asset_name.toLowerCase().indexOf(this.state.searchResult.toLowerCase()) != -1);
        } 
        console.log(resultingAsset)
        console.log(this.state.asset);
        console.log(this.state.repo);
        if(resultingAsset.length > 0) {
          Asset = resultingAsset.map((value,index) => {
                  return <tr className="" key={index}>
                            <td>{value.asset_name}</td>
                            <td>{value.asset_vendor}</td>
                            <td>{value.asset_group}</td>
                            <td>{value.asset_type}</td>
                            <td>{value.asset_size}</td>
                            <td>{value.asset_version}</td>
                            <td><i class="fa fa-2x fa-times pl-3 cross"></i></td>
                            <td><button className="mx-2 fa fa-trash fa-x p-1 pt-2 deleteRow" data-target="#myDeleteConfirmationModal" data-toggle="modal" onClick={() => this.hadleDeleteBeforeConfirmation(index, value.asset_id)} ></button></td>
                        </tr>
          })
        }
      else if(this.state.asset.length == 0){Asset = <tr><td class="text-center text-primary" colSpan="8">{this.state.response}</td></tr>;}
      else Asset = <tr><td class="text-center text-primary" colSpan="8">No Data To Display</td></tr>;

        /*Add Asset Modal Body*/
        let addAssetModal = <form className="modalbody" id='addAssetForm'  onSubmit= {this.contactSubmit.bind(this)}> 
            <div>   
        <label className="w-25 px-3" for="email">Asset Group :</label>
        <TextField
            type="text"
            name="asset_group"
            onChange={this.handleChange.bind(this, "asset_group")}
            />
            <span style={{color: "red"}}>{this.state.errors["asset_group"]}</span>
            <br/> 
        <label className="w-25 px-3" for="email">Name :</label>
        <TextField
            type="text"
            name="asset_name"
            onChange={this.handleChange.bind(this, "asset_name")}
            />
            <span style={{color: "red"}}>{this.state.errors["asset_name"]}</span>
            <br/> 
        <label className="w-25 px-3" for="email">Type :</label>
        <select name="asset_type" onChange={this.handleChange.bind(this, "asset_type")} className="input-group-text my-2 w-50">
                <option disabled selected>Select an Option</option>
                <option>key files</option>
                <option>template</option>
                <option>nsd</option>
                <option>vnfd</option>
                <option>qcow</option>
                {assetType.length>0 && assetType.map(item => {   
                    return (<option key={item} directory={item} data-type={item}>{item}</option>);
                })}
        </select>
        <span style={{color: "red"}}>{this.state.errors["asset_type"]}</span>
        <br/>
        <label className="w-25 px-3" for="email">Vendor :</label>
        <TextField
            type="text"
            name="asset_vendor"
            onChange={this.handleChange.bind(this, "asset_vendor")}
            />
            <span style={{color: "red"}}>{this.state.errors["asset_vendor"]}</span>
            <br/> 
        <label className="w-25 px-3" for="email">Upload To :</label>
        <select id="SelectAsset" name="asset_repository" onChange={this.handleChange.bind(this, "asset_repository")} className="input-group-text my-2 w-50">
                <option selected disabled>Select the Repository</option>
                {this.state.repo.length>0 && this.state.repo.map(item => {   
                    return (<option key={item} directory={item.repo_name} data-type={item.repo_type}>{item.repo_name}</option>);
                })}
        </select>
        <span style={{color: "red"}}>{this.state.errors["asset_repository"]}</span>
        <br/>
        <label className="w-25 px-3" for="email">Version :</label>
        <TextField
            type="text"
            name="asset_version"
            onChange={this.handleChange.bind(this, "asset_version")}
            />
            <span style={{color: "red"}}>{this.state.errors["asset_version"]}</span>
            <br/>
            {this.state.repoType=='local' && <div id="localRepoFile">
        <label className="w-25 px-3" for="email" >Upload File :</label>
        <TextField
            className="my-3"
            type="file"
            //name="asset_file1"
            id="asset_file"
            onChange={this.handleChange.bind(this, "asset_file")}
            />
            <span style={{color: "red"}}>{this.state.errors["asset_file"]}</span>
            <br/>
            </div>
            }
            {this.state.repoType=='remote' && <div id="remoteRepoFile">
        <label className="w-25 px-3" for="email">Upload File through URL:</label>
        <TextField
            className="my-3"
            type="url"
            id="remoteRepoFile"
            name="asset_path" 
            onChange={this.handleChange.bind(this, "asset_path")}
            // onClick={this.handleDropbox}
            />
            <span style={{color: "red"}}>{this.state.errors["asset_path"]}</span>
            <br/>
            </div>
          }
        </div>
        </form>

    return(
        <MuiThemeProvider>
        <div className="row container-fluid">
        
            {/* left nav */}
        <div className="col-lg-1">
            <OnboardTabs selected="Asset"/>
        </div>
            {/* left nav */}
            {/* Main Content */}
        <div className="container-fluid col-lg-11 mainContent pl-5">
            {/**/}
              <span className="pageHeading pr-5">Asset Onboarding</span>
              <div className="topRight float-right">
                {!this.state.isHiddenSearchBox && <input className="mr-2 rounded"type="text" id="country" name="country" placeholder="Search Here.." ref="searchKey" onChange={this.handleSearchEvent}/>}
                <span className="toprightIcons"><i class="fa fa-search" aria-hidden="true" onClick={this.toggleHiddenSearchBox}></i></span>
                <span className="toprightIcons"><i class="fa fa-sliders" aria-hidden="true"></i>Filter</span>
                <button id="addAsset" className="mx-2" data-toggle="modal" data-target="#myAddAssetModal"><span className="fa fa-plus"></span> Add</button>
              </div>
            {/* Counters */}
            <div className="rightContainer"> 
            <div class="counter">
              <span class="counterHolder">
                <span class="counterTitle">Total Assets</span>
                <span class="CounterNumbers">{this.state.asset.length}</span>
              </span>
              <span class="counterHolder">
                <span class="counterTitle">Number of vendors</span>
                <span class="CounterNumbers">{asset1.length}</span>
              </span>
              <span class="counterHolder">
                <span class="counterTitle">Total size</span>
                <span class="CounterNumbers">45Gb</span>
              </span>
            </div>
            </div>
            {/* Counters */}
        {/* /Asset Table/ */}
        <table className="table table-hover">
        <thead className="">
          <tr><th>Name</th><th>Vendor   </th><th>Group   </th><th>Type   </th><th> Size    </th><th>Version    </th><th>    Security  </th><th>    Action  </th></tr></thead>
          <div id="loader"></div>
        <tbody>  
            {Asset}
        </tbody>  
        </table>
        <hr/>
        {/* /*My Add Asset Modal*/ }
        <div className="container"  id="AddAssetModal">
        <div className="modal" id="myAddAssetModal">
          <div className="modal-dialog">
            <div className="modal-content">
            
              {/* <!-- Modal Header --> */}
              <div className="modal-header">
                <h4 className="modal-title">Add</h4>
                <button id="closeAddAssetModalBtn" type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              {/* <!-- Modal body --> */}
                {addAssetModal}
              {/* <!-- Modal footer --> */}
              <div className="modal-footer">
                <button  id="submitAddAssetModalBtn" type="button" className="btn btn-success" onClick= {this.contactSubmit.bind(this)}>Submit</button>
              </div>
              
            </div>
          </div>
        </div>
        </div>

            {/* /*My Delete Popup Modal*/ }
            <div className="container"  id="DeleteAssetModal">
              <div className="modal" id="myDeleteConfirmationModal">
                <div className="modal-dialog">
                  <div className="modal-content">
                  
                    {/* <!-- Modal Header --> */}
                    <div className="modal-header">
                      <h4 className="modal-title">Delete Confirmation</h4>
                      <button id="closeDeleteAssetModalBtn" type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    {/* <!-- Modal body --> */}
                      <div className="modal-body text-center text-danger">
                        <div className>Are you sure!!</div>
                      </div>
                    {/* <!-- Modal footer --> */}
                    <div className="modal-footer">
                      <button id="deleteDeleteAssetModalBtn" type="button" className="btn btn-danger" value="no" onClick={(event) => this.hadleDelete(event)} disabled={this.state.disabledBtn}>Delete</button>
                    </div>
                    </div>
                  </div>
                </div>
                </div>
                {/* /*My Delete Popup Modal*/ }


            <div className="py-3">
                <div className="float-right">
                    {/* <button type="button" className="btn btn-danger mx-1 px-5" >Cancel</button> */}
                    <Link to="/Onboarding/Infra" ><button id="previousPageAsset" type="button" className="btn btn-primary mx-1 px-5" >Previous</button></Link>
                </div>
            </div>
            </div>
            {/* Main Content */}
        </div>
        </MuiThemeProvider>
    )
}

}
export default Asset;
