import React from 'react'
import {SimpleTabs} from '../LoginPages/TopNav'
import { connect } from "react-redux";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {UserMgmtTabs} from '../LoginPages/myWizLeftNav'

class Services extends React.Component{

    constructor(props){
        super(props);
        this.state={
            services: [],
            showInOption: 'Select something',
            status: '',
            response: '',
            token: '',
            url: '',
            isDone: true,
            msgClass: '',
            disabledBtn: false,
        }
    }
    componentWillMount = () => {
      
    }
    componentDidMount = () => {
      /*Change the color of top nav on select*/
      // document.querySelector('.dome').classList.remove('activeNav');
      // document.getElementById('topnav-2').classList.add('activeNav');
      
      // Get Token & Url
      this.setState({
        token: sessionStorage.getItem('tokenStorage'),
        url: sessionStorage.getItem('URLStorage'),
      })
      const url = sessionStorage.getItem('URLStorage');
      const token = sessionStorage.getItem('tokenStorage');

      /*Display List of Services*/
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append('Origin', 'http://localhost:3000/');
      myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
      myHeaders.append('Access-Control-Allow-Credentials', 'true');
      myHeaders.append('GET', 'POST', 'OPTIONS');
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch(url+"/service", requestOptions)
        .then(function(response){
            console.log(response.status);
            console.log(response);
            return response.json();
          })
        .then(result => {
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
          console.log(result)
          if(result.msg){
            this.setState({response:result.msg})
            }else{
          this.setState({services:result.Services});
            }
        })
        .catch(error => {
          console.log('error', error)
          if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}          
        });
          }
    // Add Services
    handleAddService = () => {
      let addServicesForm = document.getElementById('addServicesForm');
      let formData = new FormData(addServicesForm);
      //var formElements = document.forms['addServicesForm'].elements['name'].value;
      var raw = JSON.stringify(Object.fromEntries(formData));
      let raw1 = JSON.stringify(Object.assign(Object.fromEntries(formData), {'state': 'disabled'}));
      //console.log(formElements);
      console.log(formData);
      console.log(raw);
      console.log(raw1);

      require('dotenv').config();    
          let API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
          console.log(process.env)
          let token = sessionStorage.getItem('tokenStorage');
      /*Add Service*/
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${this.state.token}`);
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        dataType: "json",
        //redirect: 'follow'
        };
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
        fetch(`${API_URL}/service`, requestOptions)
      .then((response) => {
        console.log(response.status);
        
        (response.status == 200) ? this.setState({msgClass:'successMessage', services: [...this.state.services, JSON.parse(raw1)]}) : this.setState({msgClass:'errorMessage'});
        return response.text();
      })
      .then(result => {
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
        this.setState({status:JSON.parse(result).message})
        setTimeout(() => {this.setState({status:''})}, 3000);
      })
      .catch(error => {
        console.log('error', error)
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
      });
      //window.location.reload(false);
    }

    handleDeleteBeforeConfirmation = (index, name) => {
      this.setState({delService: name, delServiceWithIndex: index});
    }
    handleDelete = () => {
        this.setState({disabledBtn:true})
        let raw={name : this.state.delService}
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
          fetch(`${API_URL}/service`, requestOptions)
          .then((response) => {
            this.setState({disabledBtn:false})
            document.querySelector('#myDeleteConfirmationModal .close').click();
            console.log(response.status);
            if(response.status == 200){
              this.state.services.splice(this.state.delServiceWithIndex, 1)
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

    handleCloseModal = () => {
      this.setState({status:''})
    }

    render(){
        /*Add Service body*/
        let addService = <form className="modalbody" id='addServicesForm'>
                            <label className="w-30 px-3" for="email">New Service :</label>
                            <TextField
                                type="text"
                                name="name"
                                /><br/>
                        </form>
        /*Display Service Status in the Table*/
        console.log(typeof(this.state.services));
        let service = '';
        console.log(this.state.services);
          if(this.state.services.length>0) 
          {
            service = this.state.services.map((value,index) => {
                    return <tr className="" key={index}>
                              <td>{value.name}</td>
                              <td>{value.state}</td>
                              <td>{value.endpoint}</td>
                              <td><button id="deleteServicesBtn" className="mx-2 fa fa-trash fa-x p-1 pt-2 deleteRow" data-target="#myDeleteConfirmationModal" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.name)} ></button></td>
                          </tr>
            })
          }
        else service = <tr><td class="text-center text-primary" colSpan="4">{this.state.response}</td></tr>;
    return(
        <MuiThemeProvider>
              <div className="row container-fluid">
              <div id="loader"></div>
            {/* left nav */}
        <div className="col-lg-1">
            <UserMgmtTabs selected="Services"/>
        </div>
            {/* left nav */}
            {/* Main Content */}
        <div className="container-fluid col-lg-11 mainContent pl-5">
        {/* <SimpleTabs/> */}

        <div>
        <span className="pageHeading pr-5">Services</span>
        <span className={this.state.msgClass}>{this.state.status}</span>
                <span className="float-right py-2">
                <button  id="addServicesBtn" className="mx-2" data-toggle="modal" data-target="#myAddServiceModal"><span className="fa fa-plus"></span> Add</button>
                </span>
        </div>
        
        <table className="table table-hover w-100">
        <thead className="">
                <tr>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Endpoints</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {service}
            </tbody>
        </table>

        {/* /*My Add Service Modal*/ }
        <div className="container" id="addServicesModal">
            <div className="modal" id="myAddServiceModal">
              <div className="modal-dialog">
                <div className="modal-content">
                  {/* <!-- Modal Header --> */}
                  <div className="modal-header">
                    <h4 className="modal-title">Add Service</h4>
                    <button type="button" className="close" data-dismiss="modal" onClick={this.handleCloseModal}>&times;</button>
                  </div>
                  {/* <!-- Modal body --> */}
                    {addService}
                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick={() => this.handleAddService()} data-dismiss="modal">Submit</button>
                  </div>
                  
                </div>
              </div>
            </div>
            </div>
            {/* /*My Delete Popup Modal*/ }
            <div className="container" id="deleteServicesModal">
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
    {/* Main Content */}
    </div>
    </MuiThemeProvider>
    )
    }
}

const mapStateToProps = state => {
    const services = state.services;
    const user = state.user;
    return {services, user};
  }
  
export default connect(mapStateToProps, '')(Services);