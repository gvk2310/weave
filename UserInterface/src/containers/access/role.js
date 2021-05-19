import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

class Role extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkPoint: false,
            isError: false,
            showInOption: 'Select something',
            roles: [],
            services: [],
            isHiddenSearchBox: true,
            displayLoader: true,
            response: '',
            showAddModal: false,
            showEditModal: false,
            showDelModal: false,
            editservice: '',
            currentRole: '',
            fields: {},
            errors: {},
            status: ''
        };
    }

    componentDidMount = () => {
        this.handleGetRole();

        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        var myHeaders = new Headers();

        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        // Fetch The Services from API
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`###REACT_APP_PLATFORM_URL###/access/services`, requestOptions)
            .then(function (response) {
                // console.log(response.status);
                return response.json();
            })
            .then(result => {
                // console.log(result);
                this.setState({ services: result });
            })
            .catch(error => console.log('error', error));
    }

    handleShowModal = (modalId) => {
        if (modalId === 'addroleModal') {
            const clear = this.state.showAddModal;
            this.setState({ showAddModal: !this.state.showAddModal });
            if (!clear) {
                document.getElementById('addRolesForm').reset();
                const errors = {};
                this.setState({ errors });
            }
        }
        if (modalId === 'editroleModal') this.setState({ showEditModal: !this.state.showEditModal });
        if (modalId === 'deleteroleModal') this.setState({ showDelModal: !this.state.showDelModal });
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }

    handleDictionary = (event) => {
        // console.log(event.target.value);
    }

    handleGetRole = () => {
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        var myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        // Fetch the roles from APi
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/access/roles`, requestOptions)
            .then(response => response.json())
            .then((findresponse) => {

                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ roles: findresponse });
                }
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    // Add Role
    handleAddRole = () => {
        this.handleShowModal('addroleModal');
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        // console.log(process.env);
        const addRolesForm = document.getElementById('addRolesForm');
        const formData = new FormData(addRolesForm);
        // console.log(Object.fromEntries(formData))
        const raw = JSON.stringify({ "role": formData.get('role'), "services": formData.getAll('write') });
        // console.log('raw' , raw)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/access/roles`, requestOptions)
            .then((response) => {
                // console.log(response.status);
                if (response.status == 200) {
                    this.setState({ isError: false, checkpoint: true });
                    this.handleGetRole();
                }
                else {
                    this.setState({ isError: true, checkpoint: true });
                }
                return response.text();
            })
            .then(result => {
                if (JSON.parse(result).message) { this.setState({ status: JSON.parse(result).message }); }
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                console.log('error', error);
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
            document.getElementById('addRolesForm').reset();
    }

    handleUpdateService = () => {
        this.handleShowModal('editroleModal');
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        // console.log(process.env);

        const formData = new FormData(document.getElementById('editServicesForm'));
        // console.log(formData);
        var raw = JSON.stringify({ "role": formData.get('role'), "services": formData.getAll('write') });
        // console.log(raw)
        /*Add Service*/
        const myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            dataType: "json",
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/access/roles?action=1`, requestOptions)
            .then((response) => {
                // console.log(response.status);
                if (response.status == 200) {
                    this.setState({ isError: false, checkPoint: true });
                    this.handleGetRole();
                }
                else {
                    this.setState({ isError: true, checkPoint: true });
                }
                return response.text();
            })
            .then(result => {
                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({ checkPoint: false }); }, 3000);
            })
            .catch(error => {
                console.log('error', error);
                setTimeout(() => { this.setState({ checkPoint: false }); }, 3000);
            });
    }

    handleEditRole = (value, index) => {
        this.handleShowModal('editroleModal')
        // console.log(value.role);
        this.setState({
            editName: value.role,
            edit: true,
        });

    }

    handleDeleteBeforeConfirmation = (index, name) => {
        this.handleShowModal('deleteroleModal');
        this.setState({ delService: name, delServiceWithIndex: index });
    }

    handleDelete = () => {
        this.handleShowModal('deleteroleModal');
        this.setState({ disabledBtn: true });
        const raw = { role: this.state.delService };
        // console.log(JSON.stringify(raw));
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        // console.log(process.env);

        var myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(raw),
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/access/roles`, requestOptions)
            .then((response) => {
                this.setState({ disabledBtn: false });
                // console.log(response.status);
                if (response.status == 200) {
                    this.state.roles.splice(this.state.delServiceWithIndex, 1);
                    this.setState({ isError: false ,checkpoint: true});
                }
                else {
                    this.setState({ isError: true, checkpoint: true });
                }
                return response.text();
            })
            .then(result => {
                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({  checkpoint: false }); }, 3000);
            })
            .catch(error => {
                console.log('error', error);
                this.setState({ disabledBtn: false });
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => { this.setState({  checkpoint: false }); }, 3000);
            });
    }

    contactSubmit = (e) => {
        // console.log('inside contactSubmit');
        e.preventDefault();
        if (this.handleValidation()) {
            this.handleShowModal('addroleModal');
            this.handleAddRole();
        }
        else {

        }

    }

    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ fields });
        const errors = {};
        this.setState({ errors });
    }

    handleValidation() {
        // console.log('inside handle validations');
        const { fields } = this.state;
        const errors = {};
        let formIsValid = true;
        this.setState({ fields });

        // role name
        if (!fields.role) {
            formIsValid = false;
            errors.role = "Cannot be empty";
        }

        if (typeof fields.role !== "undefined") {
            if (!fields.role. match(/^[A-Za-z][A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.role = "Invalid Input";
            }
            if(fields.role.length < 4 ){
                formIsValid = false;
                errors.role = "Minimum Length is 4";
            }
        }
        // console.log(fields.write, 'write')

        this.setState({ errors });
        return formIsValid;
    }

    render() {
        // console.log("Roles", this.state.roles)
        // console.log(this.state.services);
        //Style for modal
        const showModalStyle = {
            display: 'block'
        };
        const hideModalStyle = {
            display: 'none'
        };

        const addRoleModal = <form className="modalbody" id='addRolesForm'>
            <div className="form-group">
                <label className="form-label">Name<span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-control" name="role" id="roleId" placeholder="Enter Role Name" onChange={this.handleChange.bind(this, "role")} maxLength="24" />
                <span style={{ color: "red" }}>{this.state.errors.role}</span>
            </div>
            <div className="form-group">
                <label className="form-label">Services<span style={{ color: "red" }}>*</span></label>
                <select className="form-control" name="write" id="roleWriteService" multiple>
                    {/* <option>Select Services</option> */}
                    {this.state.services && this.state.services.map((item, index) => {   // here I call other options
                        return (<option key={index} directory={item} value={item.name}>{item.name}</option>);
                    })}
                    <span style={{ color: "red" }}>{this.state.errors.write}</span>
                </select>
            </div>
        </form>;

        /* Edit Service Modal Body */
        const editServiceModal = <form className="modalbody" id='editServicesForm'>
            <div className="form-group">
                <label className="form-label">Role Name<span style={{ color: "red" }}>*</span></label>
                <input name="role" type="text" className="form-control" value={this.state.editName} maxLength="24" readOnly/>
            </div>
            <div>
                <label className="form-label">Service<span style={{ color: "red" }}>*</span></label>
                <select name="write" id="addServServ" onChange={this.handleDictionary} className="form-control" multiple>
                    {this.state.services && this.state.services.map((item, key) => {   // here I call other options
                        return (<option key={key} directory={item}>{item.name}</option>);
                    })}
                </select><br />

            </div>
        </form>;

        /* Display Roles in Table */
        let role = '';
        if (this.state.roles.length > 0) {
            role = this.state.roles.map((value, index) => {
                return <tr key={index} className="tight">
                    <td className="frstCol">{value.role}</td>
                    <td style={{ 'line-height': '22px' }} className="">
                        {[...value.access.access_on.join(", ")]}
                    </td>
                    <td className="text-center">
                    <div class="dev-actions">
                        <a href="javascript:void(0)" data-toggle="modal" data-toggle="modal" data-target="#editroleModal" onClick={() => this.handleEditRole(value, index)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                        <a href="javascript:void(0)" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.role)}><img src={require("images/delete.svg")} alt="Delete" /></a>
                    </div>
                    </td>
                </tr>;
            });
        }
        else role = <tr><td className="text-center text-primary" colSpan="3">{this.state.response}</td></tr>;

        return (
            <>
                {/* <!-- content --> */}
                <div className="col dev-AI-infused-container dev-analytics">
                    <div className="py-4 myw-container">
                        <div className="d-flex align-items-center flex-wrap">
                            <div className="dev-page-title">Role Configuration</div>
                            <div className="ml-auto dev-actions">
                                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#addroleModal" onClick={() => { this.handleShowModal('addroleModal') }} ><img src={require("images/add.svg")} alt="Add" /> <span>Add </span></button>
                            </div>
                        </div>
                        <div className="dev-section my-4">
                            <div style={this.state.checkpoint ? showModalStyle : hideModalStyle} >
                                {this.state.checkpoint && <div className={`alert myw-toast myw-alert alert-dismissible show ${this.state.isError ? 'alert-failed':'alert-success'}`} role="alert" >
                                    <div>{this.state.status}</div>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleShowModal('checkpoint') }}></button>
                                </div>}
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped dev-anlytics-table">
                                    <thead>
                                        <tr>
                                            <th scope="col" width="20%">Role Name</th>
                                            <th scope="col">Services</th>
                                            <th scope="col" className="text-center" width="7%">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {role}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <!-- modal - Add Role --> */}
                        <div className="modal" id="addroleModal" tabIndex="-1" role="dialog" aria-labelledby="addroleModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="addroleModaltitle">Add Role</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('addroleModal'); }} >
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {addRoleModal}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('addroleModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={(e) => this.contactSubmit(e)}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /modal -  Add Role --> */}
                        {/* <!-- modal - edit Role --> */}
                        <div className="modal" id="editroleModal" tabIndex="-1" role="dialog" aria-labelledby="editroleModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editroleModaltitle">Edit Role</h5>
                                        <button type="button" className="close" data-target="#editroleModal" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('editroleModal'); }} >
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            {editServiceModal}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('editroleModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={() => this.handleUpdateService()} >Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /modal -  Edit Role --> */}

                        {/* <!-- modal - Delete Role --> */}
                        <div className="modal" id="deleteroleModal" tabIndex="-1" role="dialog" aria-labelledby="deleteroleModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deleteroleModaltitle">Delete Role</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deleteroleModal'); }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                    Do you want to delete Role?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('deleteroleModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={() => this.handleDelete()}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /modal -  Delete Role --> */}
                    </div>
                </div>
            </>
        );
    }
}

export default Role;
