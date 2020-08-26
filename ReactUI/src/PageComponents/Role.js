import React from 'react'
import {SimpleTabs} from '../LoginPages/TopNav'
import {connect} from 'react-redux'
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {sendCollectedRoles} from '../action/login'
import {getMuiTheme} from 'material-ui/styles/';
import {UserMgmtTabs} from '../LoginPages/myWizLeftNav'

class Role extends React.Component{

    constructor(props){
        super(props);
        this.state={
            showInOption: 'Select something',
            newRole : '',
            //services: '',
            roles:[],
            services:[],
            response: '',
            currentRole: '',
        }
    }

    componentWillMount = () => {
        let token = sessionStorage.getItem('tokenStorage');
        let url = sessionStorage.getItem('URLStorage');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        // Fetch the roles from APi
        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        //redirect: 'follow'
        };
        fetch(url+"/roles", requestOptions)
        .then(response => response.json())
        .then((findresponse)=>{
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
                     if(findresponse.msg){
                      this.setState({response:findresponse.msg})
                      }else{
                            this.setState({roles: findresponse})
                      }
                })
        .catch(error => {
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
          console.log('error', error)
      });
        // Fetch The Services from API
       var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      fetch(url+"/service", requestOptions)
        .then(function(response){
            console.log(response.status);
            return response.json();
          })
        .then(result => {
          console.log(result)
          this.setState({services:result.Services});
        })
        .catch(error => console.log('error', error));
            }

    handleDictionary = (event) => {
        console.log(event.target.value);
      }

    handleAddService = () => {
      let formData = new FormData(document.getElementById('addServicesForm'));
      let formElements = document.forms['addServicesForm'].elements['role'].value;
      let raw = JSON.stringify(Object.fromEntries(formData));
      console.log(formElements);
      console.log(formData);
      console.log(raw);

      /*Add Service*/
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${this.state.token}`);
      myHeaders.append("Content-Type", "application/json");
       var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        dataType: "json",
        //redirect: 'follow'
        };
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block"; }
      fetch(this.state.url+"/roles", requestOptions)
      .then((response) => {
        console.log(response.status);
        (response.status == 200) ? this.setState({msgClass:'successMessage', services: [...this.state.services, JSON.parse(raw)]}) : this.setState({msgClass:'errorMessage'});
        return response.text();
      })
      .then(result => {
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
        this.setState({status:JSON.parse(result).message})
        setTimeout(() => {this.setState({status:''})}, 3000);
      })
      .catch(error => {
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
        console.log('error', error)
        });
    }
    // Add Role
    handleAddRole = () => {
      require('dotenv').config();    
            let API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
            console.log(process.env)
            let token = sessionStorage.getItem('tokenStorage');
            
            let addRolesForm = document.getElementById('addRolesForm');
            let formData = new FormData(addRolesForm);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"role":formData.get('role'),"write":formData.getAll('write'),"read":formData.getAll('read')});

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block"; }
    fetch(`${API_URL}/roles`, requestOptions)
          .then((response) => {
            console.log(response.status);
            
            (response.status == 200) ? this.setState({msgClass:'successMessage', roles: [...this.state.roles, JSON.parse(raw)]}) : this.setState({msgClass:'errorMessage'});
            return response.text();
          })
          .then(result => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
            this.setState({status:JSON.parse(result).message})
            setTimeout(() => {this.setState({status:''})}, 3000);
          })
          .catch(error => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
            console.log('error', error)
          });
    }
    removeService = () => {
      alert('Service Removed');
    }
    handleDeleteBeforeConfirmation = (index, name) => {
      this.setState({delService: name, delServiceWithIndex: index});
    }
    handleDelete = () => {
      this.setState({disabledBtn:true})
      let raw={role : this.state.delService}
      console.log(JSON.stringify(raw));

      require('dotenv').config();    
            let API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
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
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block"; }
        fetch(`${API_URL}/roles`, requestOptions)
        .then((response) => {
          this.setState({disabledBtn:false})
          document.querySelector('#myDeleteConfirmationModal .close').click();
          console.log(response.status);
          if(response.status == 200){
            this.state.roles.splice(this.state.delServiceWithIndex, 1)
            this.setState({msgClass:'successMessage'})
           }
           else{
              this.setState({msgClass:'errorMessage'});
            }
          return response.text();
        })
          .then(result => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
            this.setState({status:JSON.parse(result).message})
            setTimeout(() => {this.setState({status:''})}, 3000);
          })
        .catch(error => {
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";} 
          console.log('error', error)
          this.setState({disabledBtn:false})
          document.querySelector('#myDeleteConfirmationModal .close').click();
      });
  }

    render(){
    this.props.sendRoles(this.state.roles);
    let addRoleModal = <form className="modalbody" id='addRolesForm'>
                        <label className="w-25 px-3" for="email">New Role :</label>
                        <TextField
                            type="text"
                            name="role"
                            /><br/>
                        <label className="w-25 px-3" for="email">Write Service :</label>
                            <select name="write" className="w-50" multiple>
                            {this.state.services && this.state.services.map(item => {   // here I call other options
                                return (<option key={item} directory={item}>{item.name}</option>);
                            })}
                        </select><br/> 
                        <label className="w-25 px-3" for="email">Read Service :</label>
                            <select name="read" className="w-50">
                            {this.state.services && this.state.services.map(item => {   // here I call other options
                                return (<option key={item} directory={item}>{item.name}</option>);
                            })}
                        </select><br/> 
                        </form>

    /*Add Service Modal Body*/
    let addServiceModal = <form className="modalbody" id='addServicesForm'>
                            <div>  

                            <label className="w-25 px-3" for="email">Role :</label>
                            <select name="role" id="" className="w-50">
                                <option value={this.state.currentRole} selected>{this.state.currentRole}</option>
                                {/* <option value="role1">Admin</option>
                                <option value="role2">Dev</option> */}
                            </select><br/>

                            <label className="w-25 px-3" for="email">Permission :</label>
                            <select name="permission" id="" className="w-50">
                                <option value="">Select Something</option>
                                <option value="Read">Read</option>
                                <option value="Write">Write</option>
                            </select><br/>

                            <label className="w-25 px-3" for="email">Service :</label>
                            <select onChange={this.handleDictionary} className="w-50">
                            {this.state.services && this.state.services.map(item => {   // here I call other options
                                return (<option key={item} directory={item}>{item.name}</option>);
                            })}
                        </select><br/>        
                        </div>
                    </form>
        /*Display Roles in Table*/
        let role = '';
        console.log(this.state.roles);
        console.log(this.state.roles.length);
        if(this.state.roles.length>0){
        role = this.state.roles.map((value,index) => {
                  return <tr key={index} className="tight">
                          <td className="frstCol">{value.name}</td>
                            <td className="">
                                {
                                value.read.map(val=> {
                                    return(<p>{val}</p>)
                                })
                            }
                           </td> 
                           <td className="">
                                {
                                value.write.map(val=> {
                                    return(<p>{val}</p>)
                                })
                            }
                           </td> 
                           <td className="">
                            <button  id="deleteRoleBtn" className="mx-2 fa fa-trash fa-x p-1 pt-2 deleteRow" data-target="#myDeleteConfirmationModal" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.name)} ></button>
                            <button  id="addNewServiceBtn" className="btn btn-primary" data-toggle="modal" data-target="#myAddServicesModal" onClick={() => this.setState({currentRole : value.name})}>Add Service</button>
                            {/* <select name="write" className="w-70" >
                              <option >Delete</option>
                              <option>Add Service</option>
                            </select><br/> */}
                           </td>
        </tr>
          });
        }
        else role = <tr><td class="text-center text-primary" colSpan="4">{this.state.response}</td></tr>;

          const muiTheme = getMuiTheme({
            tabs: {
                backgroundColor: 'red'
            },
            inkBar: {
                backgroundColor: 'yellow'
            }
        })
    return(
      
        <MuiThemeProvider theme={muiTheme}>
          <div className="row container-fluid">
          <div id="loader"></div>
            {/* left nav */}
        <div className="col-lg-1">
            <UserMgmtTabs selected="Role"/>
        </div>
            {/* left nav */}
            {/* Main Content */}
        <div className="container-fluid col-lg-11 mainContent pl-5">
            {/* <SimpleTabs/> */}
            <div>
                <span className="pageHeading pr-5">Roles</span>
                <span className={this.state.msgClass}>{this.state.status}</span>
                <span className="float-right py-2">
                <button id="addRoleBtn" className="mx-2" data-toggle="modal" data-target="#myAddRoleModal" data-dismiss="modal"><span className="fa fa-plus"></span> Add</button>
                {/* <button className="mx-2" data-toggle="modal" data-target="#myAddRoleModal" onClick={this.handleAddRole} data-dismiss="modal"><span className="fa fa-minus"></span> Remove</button> */}
                </span>
            </div>
            
            {/* /*My Add Services Modal*/ }
            <div className="container" id="addServicesoModal">
            <div className="modal" id="myAddServicesModal">
              <div className="modal-dialog">
                <div className="modal-content">
                
                  {/* <!-- Modal Header --> */}
                  <div className="modal-header">
                    <h4 className="modal-title">Add Services</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                    {addServiceModal}
                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick={() => this.handleAddService()} data-dismiss="modal">Submit</button>
                  </div>
                  
                </div>
              </div>
            </div>
            </div>

            {/* /*My Add Role Modal*/ }
            <div className="container" id="addRolesModal">
            <div className="modal" id="myAddRoleModal">
              <div className="modal-dialog">
                <div className="modal-content">
                
                  {/* <!-- Modal Header --> */}
                  <div className="modal-header">
                    <h4 className="modal-title">Add Role</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                    {addRoleModal}
                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick={() => this.handleAddRole()} data-dismiss="modal">Submit</button>
                  </div>
                  
                </div>
              </div>
            </div>
            </div>
            {/* /*My Delete Popup Modal*/ }
            <div className="container" id="deleteConfirmationForRoleModal">
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
                      <button type="button" className="btn btn-danger" value="no" onClick={(event) => this.handleDelete(event)} disabled={this.state.disabledBtn}>Delete</button>
                    </div>
                    </div>
                  </div>
                </div>
                </div>
                {/* /*My Delete Popup Modal*/ }
            {/* /Roles Table/ */}
            <table className="table table-hover">
            <thead className="">
                <tr className="">
                    <th className="">Role</th>
                    <th className="">Read Services</th>
                    <th className="">Write Services</th>
                    <th className="">Actions</th>
                </tr>
            </thead>
              {role == '' &&
               <tbody className="tableBody"> </tbody>
               }
               {role != '' &&
               <tbody> {role} </tbody>
               }
            </table>
        </div>
        {/* Main Content */}
        </div>
        </MuiThemeProvider>
    )
    }
}

const mapStateToProps = state => {
    console.log(state);
    const user = state.user;
    //return {user};
    const services = state.services;
    console.log(services);
    const roles = state.roles;
    console.log(roles);
    return {services, user, roles};

  }

const mapDispatchToProps = (dispatch) => {
    console.log(dispatch);
      return{
        sendRoles: (roles) => {
              dispatch( sendCollectedRoles(roles))
          }
      }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Role);