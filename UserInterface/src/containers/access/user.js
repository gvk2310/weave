import React from 'react';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router-dom';

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
            showAddModal:false,
            showEditModal:false,
            showDelModal:false,
            displayLoader: true,
            password: '',
            isHiddenSearchBox: true,
            openPage:'',
            userArr:[],
            roles:[],
            editContent:'',
            edit:false,
            searchResult:'',
            disabledBtn: false,
            fields: {},
            errors: {},
        };
    }

    handleDeleteUser = (index) => {
        alert('delete the user '+index);
    }

    handleSearchEvent = (event) => {
        this.setState({searchResult:this.refs.searchKey.value});
    }

    toggleHiddenSearchBox = () => {
        this.setState({isHiddenSearchBox: !this.state.isHiddenSearchBox});
    }    

    handleShowModal = (modalId) => {
        if(modalId === 'adduserModal')this.setState({showAddModal:!this.state.showAddModal});
        if(modalId === 'edituserModal')this.setState({showEditModal:!this.state.showEditModal});
        if(modalId === 'deleteuserModal')this.setState({showDelModal:!this.state.showDelModal});   
    }

    handleEditUser = (value,index) => {
        console.log(value);
        this.handleShowModal('edituserModal');
        this.setState({
            editContent:value,
            edit:true,
        });
    }

    handleEditData = (event) => {
        console.log(event);
        this.handleShowModal('edituserModal');
        const editUserForm = document.getElementById('editUserForm');
        const formData = new FormData(editUserForm);
        const raw = JSON.stringify(Object.fromEntries(formData));
        console.log(formData);
        console.log(raw);
    
        /* Edit User */
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            dataType: "json",
        };
        this.setState({displayLoader:true}); 
        fetch(`###REACT_APP_PLATFORM_URL###/access/users`,requestOptions)
            .then((response) => {
                console.log(response.status);
            
                if(response.status == 200){
                    let duplicateIndex = null;
                    const checkDuplicate = this.state.userArr.filter((task,index) => {
                        console.log("task.emai",task.email)
                        console.log("raw.email", JSON.parse(raw).email)
                        if(new String(task.email).valueOf() == new String(JSON.parse(raw).email).valueOf()){
                            duplicateIndex = index;
                            return task;
                        }  
                    });
                    console.log("checkDuplicate",checkDuplicate);
                    if(checkDuplicate.length>0){
                        this.state.userArr.splice(duplicateIndex, 1)
                        checkDuplicate[0].roles = JSON.parse(raw).roles
                    }
                    this.setState({msgClass:'successMessage',userArr: [...this.state.userArr, checkDuplicate[0]]}) 
                }
                else{
                    this.setState({msgClass:'errorMessage'});
                }
                return response.text();
            })
            .then(result => {
                this.setState({displayLoader:false});
                this.setState({status:JSON.parse(result).message});
                setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
            })
            .catch(error => {
                this.setState({displayLoader:false});
                console.log('error', error);
            });
    }


    componentDidMount = () => {
     
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        console.log(process.env);     
        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/access/users`, requestOptions)
            .then(response => response.json())
            .then((findresponse)=>{
                
                this.setState({displayLoader:false});
                if(findresponse.msg){
                    this.setState({response:findresponse.msg});
                }else{
                    this.setState({userArr: findresponse});
                    console.log( findresponse);
                }
            })
            .catch(error => {
                
                this.setState({displayLoader:false});
                console.log('error', error);
            });
        // Get Roles
        fetch(`###REACT_APP_PLATFORM_URL###/access/roles`, requestOptions)
            .then(response => response.json())
            .then((findresponse)=>{
                
                if(findresponse.msg){
                    this.setState({response:findresponse.msg});
                }else{
                    this.setState({roles: findresponse});
                }
            })
            .catch(error => console.log('error', error));      
    }

          // Add User
          handleAddUser = () => {
              this.handleShowModal('adduserModal'); 
              const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
              console.log(process.env);
              const addUserForm = document.getElementById('addUserForm');
              const formData = new FormData(addUserForm);
              const raw = JSON.stringify({"email":formData.get('email'),"name":formData.get('name'),"password":formData.get('password'),"roles":formData.getAll('role')});
              console.log(formData);
              console.log(raw);
      
              /* Add Service */
              const myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  dataType: "json",
              };
              this.setState({displayLoader:true}); 
              if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
              fetch(`###REACT_APP_PLATFORM_URL###/access/users`, requestOptions)
                  .then((response) => {
                      console.log(response.status);
                      (response.status == 200) ? this.setState({alertmessage:'success',checkpoint:true, userArr: [...this.state.userArr, JSON.parse(raw)]}) : this.setState({msgClass:'errorMessage',status:'There was an unknown error'});
                      return response.text();
                  })
                  .then(result => {
                      
                      this.setState({displayLoader:false});
                      this.setState({status:JSON.parse(result).message});
                      setTimeout(() => {
                          this.setState({status:'', msgClass:''});}, 3000);
                  })
                  .catch(error => {
                      
                      this.setState({displayLoader:false});
                      setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
                      console.log('error', error);
                  });
          }          
    
          // Delete User
          handleDelete = () => {
              this.handleShowModal('deleteuserModal')
              this.setState({disabledBtn:true});
              const raw={email : this.state.delUser};
              console.log(JSON.stringify(raw));  
              const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
              console.log(process.env);         
              const myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
          
              const requestOptions = {
                  method: 'DELETE',
                  headers: myHeaders,
                  body: JSON.stringify(raw),
                  
              };
              this.setState({displayLoader:true}); 
              if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
              fetch(`###REACT_APP_PLATFORM_URL###/access/users`, requestOptions)
                  .then((response) => {
                      this.setState({disabledBtn:false});
                      console.log(response.status);
                      if(response.status == 200){
                          this.state.userArr.splice(this.state.delUserWithIndex, 1);
                          this.setState({msgClass:'successMessage'});
                      }
                      else{
                          this.setState({msgClass:'errorMessage',status:'There was an unknown error'});
                      }
                      return response.text();
                  })
                  .then(result => {
                      
                      this.setState({displayLoader:false});
                      this.setState({status:JSON.parse(result).message});
                      setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
                  })
                  .catch(error => {
                      
                      this.setState({displayLoader:false});
                      console.log('error', error);
                      this.setState({disabledBtn:false});
                      document.querySelector('#myDeleteConfirmationModal .close').click();
                      setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
                  });
          }

          handleDeleteBeforeConfirmation = (index, email) => {
              this.handleShowModal('deleteuserModal');
              this.setState({delUser: email, delUserWithIndex: index});
          }

          contactSubmit = (e) => {
              console.log('inside contactSubmit');
              e.preventDefault();
              //   if(this.handleValidation()){
              this.handleShowModal('edituserModal');
              this.handleEditData();
              //   }else{
              //       alert("Form has errors.")
              //   }
          }

          contactSubmit1 = (e) => {
              console.log('inside contactSubmit1');
              e.preventDefault();
              //   if(this.handleValidation1()){
              this.handleShowModal('adduserModal');
              this.handleAddUser();
              //   }else{
              //       alert("Form has errors.")
              //   }
          }

          handleChange(field, e){         
              const {fields} = this.state;
              fields[field] = e.target.value;        
              this.setState({fields});
              const errors = {};
              this.setState({errors});
          }    

          //   handleValidation(){
          //       console.log('inside handle validations');
          //       const {fields} = this.state;
          //       const errors = {};
          //       let formIsValid = true;
          //       this.setState({fields});

          //       Name             
          //       if(!fields.name){
          //           formIsValid = false;
          //           errors.name = "Cannot be empty";                  
          //       }
          //       if(typeof fields.role !== "undefined"){
          //         if(!fields.role.match(/^[A-Za-z0-9_-]/)){
          //             formIsValid = false;
          //             errors.role = "Only letters";
          //         }        
          //     }
          //       this.setState({errors: errors});
          //       return formIsValid;
          //   }   
          
          handleValidation1(){
              console.log('inside handle validations');
              const {fields} = this.state;
              const errors = {};
              let formIsValid = true;
              this.setState({fields});
              
              // null email              
              if(!fields.email){
                  formIsValid = false;
                  errors.email = "Cannot be empty";                  
              }
              // invalid email
              if(typeof fields.email !== "undefined"){
                  const lastAtPos = fields.email.lastIndexOf('@');
                  const lastDotPos = fields.email.lastIndexOf('.');
 
                  if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields.email.indexOf('@@') == -1 && lastDotPos > 2 && (fields.email.length - lastDotPos) > 2)) {
                      formIsValid = false;
                      errors.email = "Email is not valid";
                  }
              }
              
              // Name             
              if(!fields.name){
                  formIsValid = false;
                  errors.name = "Cannot be empty";                  
              }
             // Role
              if(!fields.role){
                  formIsValid = false;
                  errors.role = "Cannot be empty";                  
              }
              this.setState({errors: errors});
              return formIsValid;
          }            

          render(){
              console.log("this.state.userArr",this.state.userArr)
              // Style for modal
              const showModalStyle={
                  display:'block'
              };
              const hideModalStyle={
                  display:'none'
              };
              /* Search Functionality */
              let result = []; 
              if(this.state.userArr.length>0){
                  result = this.state.userArr.filter(userArr => userArr.email.toLowerCase().indexOf(this.state.searchResult) != -1);
              }  
              /* Table Body */ 
              let name = '', editBox = '';
              if(this.state.userArr.length>0){
                  name = result.map((value,index) => {
                      return <tr key={index} className="tight">
                          <td>{value.name}</td>
                          <td>{value.email}</td>
                          <td>{value.roles}</td> 
                          <div class="dev-actions">
                              <a href="javascript:void(0)" data-toggle="modal" data-target="#myEditModal" onClick={() => this.handleEditUser(value,index)}><img src={require("images/edit.svg")} alt="Edit"/></a>
                              <a href="javascript:void(0)" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.email)} ><img src={require("images/delete-icon.svg")} alt="Delete"/></a>
                          </div>
                      </tr>;
                  });
              }
              else name = <tr><td className="text-center text-primary" colSpan="4">{this.state.response}</td></tr>;
              // Edit User Form
              const modalEditContent = <form className="modalbody" id='editUserForm'>
                  <label className="form-label" htmlFor="name">Email :</label>
                  <input type="email" name="email"
                      id="email" className="form-control" value={this.state.editContent.email}
                      readOnly placeholder="Enter Email" onChange={this.handleChange.bind(this, "email")}/>
                 
                  <br/>
                  <label className="form-label" htmlFor="name">Role :</label>
                  <select className="form-control" name="roles">
                      {this.state.roles && this.state.roles.map((item, key) => {   // here I call other options
                          return (<option key={key} directory={item}>{item.role}</option>);
                      })}
                      <span style={{color: "red"}}>{this.state.errors.role}</span> 
                  </select>               
                  <br/>
              </form>;
              // Add User Form
              const modalAddContent = <form className="modalbody" id='addUserForm'>
                  <label className="w-25 px-3" htmlFor="email">Email :</label>
                  <input type="email" name="email"
                      id="email" className="form-control" placeholder="Enter Email" onChange={this.handleChange.bind(this, "email")}/>
                  <span style={{color: "red"}}>{this.state.errors.email}</span> 
                  
                  <br/>
                  <label className="w-25 px-3" htmlFor="email">Name :</label>
                  <input type="text" name="name"
                      id="name" className="form-control" placeholder="Enter Name" onChange={this.handleChange.bind(this, "name")}/>
                  <span style={{color: "red"}}>{this.state.errors.name}</span> 
                 
                  <br/>

                  <label className="w-25 px-3" htmlFor="email">Roles :</label>
                  <select name="role" id="role" className="form-control" onChange={this.handleChange.bind(this, "role")} >
                      <option>Select Role</option>
                      {this.state.roles && this.state.roles.map((item, key) => {   // here I call other options
                          return (<option key={key} directory={item}>{item.role}</option>);
                      })}                      
                  </select> 
                  <span style={{color: "red"}}>{this.state.errors.role}</span>
              </form>;
              // Add User Form

              return(
                  <>
                      <div className="col dev-AI-infused-container dev-analytics">
                          <div className="py-4 myw-container">
                              <div className="d-flex align-items-center">
                                  <div className="dev-page-title">User Configuration</div>
                                  <div className="ml-auto dev-actions">
                                      <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#adduserModal" onClick={() => {this.handleShowModal('adduserModal');}}><img src={require("images/add.svg")} alt="Add"/> <span>Add</span></button>
                                  </div>
                              </div>
                              <div className="dev-section my-4">
                                  {this.state.checkpoint && <div className="alert myw-toast myw-alert alert-success alert-dismissible show" role="alert" >
                                      <div>New user added successfully.</div>
                                      <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                                  </div>}
                                  <div className="table-responsive">
                                      <table className="table table-striped dev-anlytics-table">
                                          <thead>
                                              <tr>
                                                  <th scope="col">Name</th>
                                                  <th scope="col">Email</th>
                                                  <th scope="col">Roles</th>
                                                  <th scope="col" className="text-center" width="7%">Action</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              {name}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                              {/* <!-- modal - Add User --> */}
                              <div className="modal" id="adduserModal" tabIndex="-1" role="dialog" aria-labelledby="adduserModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal?showModalStyle:hideModalStyle}>
                                  <div className="modal-backdrop show"></div>
                                  <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                                      <div className="modal-content">
                                          <div className="modal-header">
                                              <h5 className="modal-title" id="adduserModaltitle">Add</h5>
                                              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {this.handleShowModal('adduserModal');}}>
                                                  <span aria-hidden="true">&times;</span>
                                              </button>
                                          </div>
                                          <div className="modal-body">
                                              {modalAddContent}
                                          </div>
                                          <div className="modal-footer">
                                              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={(e) => this.contactSubmit1(e)} >Submit</button>
                                          </div>
                                                      
                                      </div>
                                  </div>
                              </div>
                              {/* <!-- /modal -  Add User --> */}
                              {/* <!-- modal - Edit User --> */}
                              <div className="modal" id="edituserModal" tabIndex="-1" role="dialog" aria-labelledby="edituserModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal?showModalStyle:hideModalStyle}>
                                  <div className="modal-backdrop show"></div>
                                  <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                                      <div className="modal-content">
                                          <div className="modal-header">
                                              <h5 className="modal-title" id="edituserModaltitle">Edit User</h5>
                                              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {this.handleShowModal('edituserModal');}}>
                                                  <span aria-hidden="true">&times;</span>
                                              </button>
                                          </div>
                                          <div className="modal-body">
                                              {modalEditContent}
                                          </div>
                                          <div className="modal-footer">
                                              <button type="button" className="btn btn-primary" data-dismiss="modal" aria-label="Close" onClick= {this.contactSubmit.bind(this)} >Submit</button>
                                          </div>
                                                      
                                      </div>
                                  </div>
                              </div>
                              {/* <!-- /modal -  Edit User --> */}
                              {/* <!-- modal - Delete User --> */}
                              <div className="modal" id="deleteuserModal" tabIndex="-1" role="dialog" aria-labelledby="deleteuserModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal?showModalStyle:hideModalStyle}>
                                  <div className="modal-backdrop show"></div>
                                  <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                                      <div className="modal-content">
                                          <div className="modal-header">
                                              <h5 className="modal-title" id="deleteuserModaltitle">Delete User</h5>
                                              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {this.handleShowModal('deleteuserModal');}}>
                                                  <span aria-hidden="true">&times;</span>
                                              </button>
                                          </div>
                                          <div className="modal-body">
                                                          Are you sure?
                                          </div>
                                          <div className="modal-footer">
                                              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={(event) => this.handleDelete(event)}>Submit</button>
                                          </div>
                                                      
                                      </div>
                                  </div>
                              </div>
                              {/* <!-- /modal -  Delete User --> */}
                                            
                          </div>
                      </div>
                      {/* <!-- /content --> */}
                  </>
              );
              
          }
}
export default User;
