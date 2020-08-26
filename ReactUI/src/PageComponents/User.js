import React from 'react'
import {Link} from 'react-router-dom'
import {SimpleTabs} from '../LoginPages/TopNav'
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../LoginPages/Login.css'
import {connect} from 'react-redux'
import {UserMgmtTabs} from '../LoginPages/myWizLeftNav'

class User extends React.Component{

    constructor(props){
        super(props);
        this.state={
            newUser:{
              name:'',
              email:'',
              website:'',
              phone:''
            },
            response: '',
            displayLoader: true,
            isHiddenSearchBox: true,
            openPage:'',
            userArr:[],
            roles:[],
            editContent:'',
            edit:false,
            searchResult:'',
            disabledBtn: false,
        }
    }
    handleDeleteUser = (index) => {
        alert('delete the user '+index);
        }
    handleSearchEvent = (event) => {
      this.setState({searchResult:this.refs.searchKey.value})
    }
    toggleHiddenSearchBox = () => {
      this.setState({isHiddenSearchBox: !this.state.isHiddenSearchBox})
    }
    handleEditUser = (value,index) => {
        this.setState({
            editContent:value,
            edit:true,
        })

        }
    handleEditData = (event) => {
      require('dotenv').config();    
            let API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
            console.log(process.env)
            let token = sessionStorage.getItem('tokenStorage');
        let editUserForm = document.getElementById('editUserForm');
        let formData = new FormData(editUserForm);
        let raw = JSON.stringify(Object.fromEntries(formData));
        console.log(formData);
        // console.log(raw1);
  
        /*Edit User*/
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: raw,
          dataType: "json",
          //redirect: 'follow'
          };
          this.setState({displayLoader:true}); 
          fetch(`${API_URL}/users`, requestOptions)
        .then((response) => {
          console.log(response.status);
          
          (response.status == 200) ? this.setState({msgClass:'successMessage'}) : this.setState({msgClass:'errorMessage'});
          return response.text();
        })
        .then(result => {
          this.setState({displayLoader:false});
          this.setState({status:JSON.parse(result).message})
          setTimeout(() => {this.setState({status:''})}, 3000);
        })
        .catch(error => {
          this.setState({displayLoader:false});
          console.log('error', error)
      });
        }
    handleAddUserEvent = () => {

    }
        
    componentWillMount = () => {
      let token = sessionStorage.getItem('tokenStorage');
      let url = sessionStorage.getItem('URLStorage');
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
      myHeaders.append('Access-Control-Allow-Credentials', 'true');
      myHeaders.append('GET', 'POST', 'OPTIONS');

      var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      //redirect: 'follow'
      };
      fetch(url+"/users", requestOptions)
      .then(response => response.json())
      .then((findresponse)=>{
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
        this.setState({displayLoader:false});
                   if(findresponse.msg){
                    this.setState({response:findresponse.msg})
                    }else{
                          this.setState({userArr: findresponse})
                          console.log( findresponse)
                    }
              })
      .catch(error => {
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
        this.setState({displayLoader:false});
        console.log('error', error)
      });
      //Get Roles
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
        .catch(error => console.log('error', error));      
          }
    // Add User
    handleAddUser = () => {

      require('dotenv').config();    
          let API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
          console.log(process.env)
          let token = sessionStorage.getItem('tokenStorage');
      let addUserForm = document.getElementById('addUserForm');
      let formData = new FormData(addUserForm);
      var raw = JSON.stringify({"email":formData.get('email'),"name":formData.get('name'),"password":formData.get('password'),"roles":formData.getAll('roles')});
      console.log(formData);
      console.log(raw);

      /*Add Service*/
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        dataType: "json",
        //redirect: 'follow'
        };
        this.setState({displayLoader:true}); 
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
        fetch(`${API_URL}/users`, requestOptions)
      .then((response) => {
        console.log(response.status);
        
        (response.status == 200) ? this.setState({msgClass:'successMessage', userArr: [...this.state.userArr, JSON.parse(raw)]}) : this.setState({msgClass:'errorMessage'});
        return response.text();
      })
      .then(result => {
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
        this.setState({displayLoader:false});
        this.setState({status:JSON.parse(result).message})
        setTimeout(() => {this.setState({status:''})}, 3000);
      })
      .catch(error => {
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
        this.setState({displayLoader:false});
        console.log('error', error)
      });
      //window.location.reload(false);
    }
    // Delete User
    handleDelete = () => {
      this.setState({disabledBtn:true})
      let raw={email : this.state.delUser}
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
        this.setState({displayLoader:true}); 
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
        fetch(`${API_URL}/users`, requestOptions)
        .then((response) => {
          this.setState({disabledBtn:false})
          document.querySelector('#myDeleteConfirmationModal .close').click();
          console.log(response.status);
          if(response.status == 200){
            this.state.userArr.splice(this.state.delUserWithIndex, 1)
            this.setState({msgClass:'successMessage'})
           }
           else{
              this.setState({msgClass:'errorMessage'});
            }
          return response.text();
        })
          .then(result => {
            if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
            this.setState({displayLoader:false});
            this.setState({status:JSON.parse(result).message})
            setTimeout(() => {this.setState({status:''})}, 3000);
          })
        .catch(error => {
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
          this.setState({displayLoader:false});
          console.log('error', error)
          this.setState({disabledBtn:false})
          document.querySelector('#myDeleteConfirmationModal .close').click();
      });
  }
    handleDeleteBeforeConfirmation = (index, email) => {
      this.setState({delUser: email, delUserWithIndex: index});
    }

    render(){
      
      /*Search Functionality*/
      let result = []; 
      if(this.state.userArr.length>0){
      result = this.state.userArr.filter(userArr => userArr.email.toLowerCase().indexOf(this.state.searchResult) != -1);
      }  
       /*Table Body*/ 
        let name = '', editBox = '';
        if(this.state.userArr.length>0){
        name = result.map((value,index) => {
                  return <tr key={index} className="tight">
                            <td>{value.email}</td>
                            <td>
                                {
                                value.roles.map(val=> {
                                    return(<p className="userRole">{val}</p>)
                                    })
                                }
                           </td> 
                            <td><button id="deleteUsersBtn" className="mx-2 fa fa-trash fa-x p-1 pt-2 deleteRow" data-target="#myDeleteConfirmationModal" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.email)} ></button><button className="mx-2 fa fa-pencil-square-o fa-x p-1 pt-2 deleteRow" data-toggle="modal" data-target="#myEditModal" onClick={() => this.handleEditUser(value,index)}></button></td>
                        </tr>
          })
        }
        else name = <tr><td class="text-center text-primary" colSpan="5">{this.state.response}</td></tr>;
        // Edit User Form
      let modalEditContent = <form className="modalbody" id='editUserForm'>
      <label className="w-25 px-3" htmlFor="name">Email :</label>
      <TextField
        type="text"
        name="email"
        value={this.state.editContent.email}
        readOnly/><br/>
      <label className="w-25 px-3" htmlFor="password">Password :</label>
      <TextField
        type="text"
        name="password"
        />
        <br/>
      </form>
      // Edit User Form
      // Add User Form
      let modalAddContent = <form className="modalbody" id='addUserForm'>
      <label className="w-30 px-3" for="email">Email :</label>
      <TextField
          type="email"
          name="email"
          /><br/>
      <label className="w-30 px-3" for="email">Name :</label>
      <TextField
          type="text"
          name="name"
          /><br/>
      <label className="w-30 px-3" for="email">Password :</label>
      <TextField
          type="password"
          name="password"
          /><br/>
      <label className="w-30 px-3" for="email">Roles :</label>
      <select name="roles" className="w-50" >
                            {this.state.roles && this.state.roles.map(item => {   // here I call other options
                                return (<option key={item} directory={item}>{item.name}</option>);
                            })}
      </select><br/> 
      </form>
       // Add User Form
    return(
        
    <div>
       <MuiThemeProvider>
       <div className="row container-fluid">
       {this.state.displayLoader && <div id="loader"></div>}
            {/* left nav */}
        <div className="col-lg-1">
            <UserMgmtTabs selected="User"/>
        </div>
            {/* left nav */}
            {/* Main Content */}
        <div className="container-fluid col-lg-11 mainContent pl-5">
        {/* <SimpleTabs/> */}
        <span className="pageHeading pr-5">Users</span>
        <div className="topRight float-right">
                {!this.state.isHiddenSearchBox && <input className="mr-2 rounded"type="text" id="country" name="country" placeholder="Search Here.." ref="searchKey" onChange={this.handleSearchEvent}/>}
                <span className="toprightIcons"><i class="fa fa-search" aria-hidden="true" onClick={this.toggleHiddenSearchBox}></i></span>
                <span className="toprightIcons"><i class="fa fa-sliders" aria-hidden="true"></i>Filter</span>
                <button id="addUserBtn" data-toggle="modal" data-target="#myAddModal" onClick={this.handleAddUserEvent}><span className="fa fa-plus"></span> Add</button>
        </div><br/>
        <div>
        <span className="small pr-5">Displaying {result.length} Items</span>
        <span className={this.state.msgClass}>{this.state.status}</span>
        </div>        
        {/* <span className="float-right py-2">
          <input className="mr-2 rounded"type="text" id="country" name="country" placeholder="Search Here.." ref="searchKey" onChange={this.handleSearchEvent}/>
          <button data-toggle="modal" data-target="#myAddModal" onClick={this.handleAddUserEvent}><span className="fa fa-plus"></span> Add</button>
        </span> */}

        <table className="table table-hover">
            <thead className="">
                <tr>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                    {name}
            </tbody>
            
        </table>
        {/* {this.state.edit && */}
            <div class="container" id="editUserModal">
                    
            {/* <!-- The Edit Modal --> */}
            <div class="modal" id="myEditModal">
              <div class="modal-dialog">
                <div class="modal-content">
                
                  {/* <!-- Modal Header --> */}
                  <div class="modal-header">
                    <h4 class="modal-title">Edit User Details</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                  {modalEditContent}
                  {/* <!-- Modal footer --> */}
                  <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal" onClick={() => this.handleEditData()}>Submit</button>
                  </div>
                  
                </div>
              </div>
            </div>
            {/* <!-- The Add Modal --> */}
            <div class="modal" id="myAddModal">
              <div class="modal-dialog" id="addUserModal">
                <div class="modal-content">
                
                  {/* <!-- Modal Header --> */}
                  <div class="modal-header">
                    <h4 class="modal-title">Add User Details</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                  {modalAddContent}
                  {/* <!-- Modal footer --> */}
                  <div class="modal-footer">
                    <button type="button" class="btn btn-success" onClick={() => this.handleAddUser()} data-dismiss="modal">Submit</button>
                  </div>
                  
                </div>
              </div>
            </div>
            {/* /*My Delete Popup Modal*/ }
            <div className="container" id="deleteUserModal">
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
              </div>
        
        </div>
        {/* Main Content */}
        </div>
        </MuiThemeProvider>
        </div>
    
    )
}
}

const mapStateToProps = state => {
  const user = state.user;
  const roles = state.roles;
  return {user, roles};

}

export default connect(mapStateToProps, '')(User);