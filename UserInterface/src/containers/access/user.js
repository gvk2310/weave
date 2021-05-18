import React from 'react';

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newUser: {
                name: '',
                email: '',
                website: '',
                phone: ''
            },
            response: '',
            showAddModal: false,
            showEditModal: false,
            showDelModal: false,
            displayLoader: true,
            password: '',
            isHiddenSearchBox: true,
            openPage: '',
            userArr: [],
            roles: [],
            projectArr: [],
            project: '',
            editContent: '',
            edit: false,
            searchResult: '',
            disabledBtn: false,
            fields: {},
            errors: {},
            checkPoint: false,
            isError: false,
            status: ''
        };
    }

    handleDeleteUser = (index) => {
        alert('delete the user ' + index);
    }

    handleSearchEvent = (event) => {
        this.setState({ searchResult: this.refs.searchKey.value });
    }

    toggleHiddenSearchBox = () => {
        this.setState({ isHiddenSearchBox: !this.state.isHiddenSearchBox });
    }

    handleShowModal = (modalId) => {
        if (modalId === 'adduserModal') {
            const clear = this.state.showAddModal;
            this.setState({ showAddModal: !this.state.showAddModal });
            if (!clear) {
                document.getElementById('addUserForm').reset();
                const errors = {};
                this.setState({ errors });
            }
        }
        if (modalId === 'edituserModal') this.setState({ showEditModal: !this.state.showEditModal });
        if (modalId === 'deleteuserModal') this.setState({ showDelModal: !this.state.showDelModal });
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }

    handleEditUser = (value, index) => {
        console.log(value);
        this.handleShowModal('edituserModal');
        this.setState({
            editContent: value,
            edit: true,
        });
    }

    handleEditData = (event) => {
        console.log(event);
        this.handleShowModal('edituserModal');
        const editUserForm = document.getElementById('editUserForm');
        const formData = new FormData(editUserForm);
        var raw = JSON.stringify({ "project": formData.get('projectArr'), "email": formData.get('email'), "roles": formData.get('roles') });
        console.log(raw);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            dataType: "json",
        };
        this.setState({ displayLoader: true });
        fetch(`###REACT_APP_PLATFORM_URL###/access/users`, requestOptions)
            .then((response) => {
                console.log(response.status);
                if (response.status == 200) {
                    this.handleGetUser();
                    this.setState({ isError: false, checkpoint: true });                
                }
                else {
                    this.setState({ isError: true, checkpoint: true });
                }
                return response.text();
            })
            .then(result => {
                this.setState({ displayLoader: false });
                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                this.setState({ displayLoader: false });
                console.log('error', error);
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
    }


    componentDidMount = () => {
        this.handleGetUser();
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        console.log(process.env);
        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        // Get Roles
        fetch(`###REACT_APP_PLATFORM_URL###/access/roles`, requestOptions)
            .then(response => response.json())
            .then((findresponse) => {

                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ roles: findresponse });
                }
            })
            .catch(error => console.log('error', error));

        // Get Projects
        fetch(`###REACT_APP_PLATFORM_URL###/project/projects`, requestOptions)
            .then(response => response.json())
            .then((findresponse) => {
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ projectArr: findresponse });
                }
            })
            .catch(error => console.log('error', error));
    }

    handleGetUser = () => {
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
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
            .then((findresponse) => {

                this.setState({ displayLoader: false });
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ userArr: findresponse });
                    console.log(findresponse);
                }
            })
            .catch(error => {
                this.setState({ displayLoader: false });
                console.log('error', error);
            });
    }

    // Add User
    handleAddUser = () => {
        this.handleShowModal('adduserModal');
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        console.log(process.env);
        const addUserForm = document.getElementById('addUserForm');
        const formData = new FormData(addUserForm);
        const raw = JSON.stringify({ "email": formData.get('email'), "name": formData.get('name'), "project": formData.getAll('project')[0], "roles": formData.getAll('role')[0] });
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
        this.setState({ displayLoader: true });
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/access/users`, requestOptions)
            .then((response) => {
                console.log(response.status);
                if(response.status == 200){
                    this.setState({ isError: false, checkpoint: true });
                    this.handleGetUser();
                }
                else{
                    this.setState({ isError: true, checkpoint: true, status: 'There was an unknown error' });
                } 
                return response.text();
            })
            .then(result => {
                this.setState({ displayLoader: false });
                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                this.setState({ displayLoader: false });
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
                console.log('error', error);
            });
        document.getElementById('addUserForm').reset();
    }

    // Delete User
    handleDelete = () => {
        this.handleShowModal('deleteuserModal')
        this.setState({ disabledBtn: true });
        const raw = { email: this.state.delUser };
        console.log(JSON.stringify(raw));
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        console.log(process.env);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(raw),
        };
        this.setState({ displayLoader: true });
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/access/users`, requestOptions)
            .then((response) => {
                this.setState({ disabledBtn: false });
                console.log(response.status);
                if (response.status == 200) {
                    this.state.userArr.splice(this.state.delUserWithIndex, 1);
                    this.setState({ isError: false, checkpoint: true });
                }
                else {
                    this.setState({ isError: true, status: 'There was an unknown error', checkpoint: true });
                }
                return response.text();
            })
            .then(result => {
                this.setState({ displayLoader: false });
                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                this.setState({ displayLoader: false });
                console.log('error', error);
                this.setState({ disabledBtn: false });
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
    }

    handleDeleteBeforeConfirmation = (index, email) => {
        this.handleShowModal('deleteuserModal');
        this.setState({ delUser: email, delUserWithIndex: index });
    }

    contactSubmit = (e) => {
        console.log('inside contactSubmit');
        e.preventDefault();
        this.handleShowModal('edituserModal');
        this.handleEditData();
    }

    contactSubmit1 = (e) => {
        console.log('inside contactSubmit1');
        e.preventDefault();
        if (this.handleValidation()) {
            this.handleShowModal('adduserModal');
            this.handleAddUser();
        }
        else {
            alert("Form has errors.")
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
        console.log('inside handle validations');
        const fields = this.state.fields;
        const errors = {};
        let formIsValid = true;

        // null email              
        if (!fields.email) {
            formIsValid = false;
            errors.email = "Cannot be empty";
        }
        // invalid email
        if (typeof fields.email !== "undefined") {
            const lastAtPos = fields.email.lastIndexOf('@');
            const lastDotPos = fields.email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields.email.indexOf('@@') == -1 && lastDotPos > 2 && (fields.email.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors.email = "Email is not valid";
            }
        }

        // Name             
        if (!fields.name) {
            formIsValid = false;
            errors.name = "Cannot be empty";
        }
        if (typeof fields.name !== "undefined") {
            if (!fields.name.match(/^[A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.name = "Invalid Input";
            }
            if(fields.name.length < 4 ){
                formIsValid = false;
                errors.name = "Minimum Length is 4";}
        }
        // Role
        if (!fields.role) {
            formIsValid = false;
            errors.role = "Cannot be empty";
        }
        // Project
        if (!fields.project) {
            formIsValid = false;
            errors.project = "Cannot be empty";
        }
        this.setState({ errors });
        console.log('formIsValid', formIsValid)
        return formIsValid;
    }

    render() {
        console.log("this.state.userArr", this.state.userArr)
        // Style for modal
        const showModalStyle = {
            display: 'block'
        };
        const hideModalStyle = {
            display: 'none'
        };
        /* Search Functionality */
        let result = [];
        if (this.state.userArr.length > 0) {
            result = this.state.userArr.filter(userArr => userArr.email.toLowerCase().indexOf(this.state.searchResult) != -1);
        }
        /* Table Body */
        let name = '', editBox = '';
        if (this.state.userArr.length > 0) {
            name = result.map((value, index) => {
                return <tr key={index} className="tight">
                    <td>{value.name}</td>
                    <td>{value.email}</td>
                    <td>{value.project}</td>
                    <td>{value.roles}</td>
                    <td className="text-center">
                    <div class="dev-actions">
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#myEditModal" onClick={() => this.handleEditUser(value, index)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                        <a href="javascript:void(0)" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.email)} ><img src={require("images/delete.svg")} alt="Delete" /></a>
                    </div>
                    </td>
                </tr>;
            });
        }
        else name = <tr><td className="text-center text-primary" colSpan="4">{this.state.response}</td></tr>;

        // Edit User Form
        const modalEditContent = <form className="modalbody" id='editUserForm'>
            <label className="form-label" htmlFor="name">Email<span style={{ color: "red" }}>*</span></label>
            <input type="email" name="email"
                id="email" className="form-control" value={this.state.editContent.email}
                readOnly placeholder="Enter Email" />
            <br />
            <label className="form-label" htmlFor="name">Project<span style={{ color: "red" }}>*</span></label>
            <select className="form-control" name="projectArr">
                <option disabled>Select Project</option>
                {this.state.projectArr && this.state.projectArr.map((item, key) => {   // here I call other options
                    return (<option key={key} selected={this.state.editContent.project === item.project_name ? true : false} directory={item}>{item.project_name}</option>);
                })}
            </select>

            <br />
            <label className="form-label" htmlFor="name">Role<span style={{ color: "red" }}>*</span></label>
            <select className="form-control" name="roles">
                <option disabled>Select Role</option>
                {this.state.roles && this.state.roles.map((item, key) => {   // here I call other options
                    return (<option key={key} selected={this.state.editContent.roles === item.role ? true : false} directory={item}>{item.role}</option>);
                })}
            </select>
        </form>;

        // Add User Form
        const modalAddContent = <form className="modalbody" id='addUserForm'>
            <label className="form-label" htmlFor="email">Email<span style={{ color: "red" }}>*</span></label>
            <input type="email" name="email"
                id="email" className="form-control" placeholder="Enter Email" onChange={this.handleChange.bind(this, "email")}  />
            <span style={{ color: "red" }}>{this.state.errors.email}</span>

            <br />
            <label className="form-label" htmlFor="email">Name<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="name"
                id="name" className="form-control" placeholder="Enter Name" onChange={this.handleChange.bind(this, "name")} maxLength="24" />
            <span style={{ color: "red" }}>{this.state.errors.name}</span>

            <br />
            <label className="form-label" htmlFor="email">Projects<span style={{ color: "red" }}>*</span></label>
            <select name="project" id="project" className="form-control" onChange={this.handleChange.bind(this, "project")} >
                <option>Select Project</option>
                {this.state.projectArr && this.state.projectArr.map((item, key) => {   // here I call other options
                    return (<option key={key} directory={item}>{item.project_name}</option>);
                })}
            </select>
            <span style={{ color: "red" }}>{this.state.errors.project}</span>

            <br />
            <label className="form-label" htmlFor="email">Roles<span style={{ color: "red" }}>*</span></label>
            <select name="role" id="role" className="form-control" onChange={this.handleChange.bind(this, "role")} >
                <option>Select Role</option>
                {this.state.roles && this.state.roles.map((item, key) => {   // here I call other options
                    return (<option key={key} directory={item}>{item.role}</option>);
                })}
            </select>
            <span style={{ color: "red" }}>{this.state.errors.role}</span>

        </form>;

        return (
            <>
                <div className="col dev-AI-infused-container dev-analytics">
                    <div className="py-4 myw-container">
                        <div className="d-flex align-items-center">
                            <div className="dev-page-title">User Configuration</div>
                            <div className="ml-auto dev-actions">
                                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#adduserModal" onClick={() => { this.handleShowModal('adduserModal'); }}><img src={require("images/add.svg")} alt="Add" /> <span>Add</span></button>
                            </div>
                        </div>
                        <div className="dev-section my-4">
                            <div style={this.state.checkpoint ? showModalStyle : hideModalStyle}>
                                {this.state.checkpoint && <div className={`alert myw-toast myw-alert alert-dismissible show ${this.state.isError ? 'alert-failed' : 'alert-success'}`} role="alert" >
                                    <div>{this.state.status}</div>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleShowModal('checkpoint') }}></button>
                                </div>}
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped dev-anlytics-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Projects</th>
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
                        <div className="modal" id="adduserModal" tabIndex="-1" role="dialog" aria-labelledby="adduserModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="adduserModaltitle">Add User</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('adduserModal'); }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {modalAddContent}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('adduserModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={(e) => this.contactSubmit1(e)} >Submit</button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* <!-- modal - Edit User --> */}
                        <div className="modal" id="edituserModal" tabIndex="-1" role="dialog" aria-labelledby="edituserModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="edituserModaltitle">Edit User</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('edituserModal'); }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {modalEditContent}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('edituserModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" aria-label="Close" onClick={this.contactSubmit.bind(this)} >Submit</button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* <!-- modal - Delete User --> */}
                        <div className="modal" id="deleteuserModal" tabIndex="-1" role="dialog" aria-labelledby="deleteuserModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deleteuserModaltitle">Delete User</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deleteuserModal'); }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                    Do you want to delete User?
                                          </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={(event) => this.handleDelete(event)}>Submit</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    }
}
export default User;
