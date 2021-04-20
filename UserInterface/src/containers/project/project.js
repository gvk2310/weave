import React from 'react';

class Project extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectArr: [],
            project_name: '',
            project_details: '',
            project_id: '',
            fields: {},
            errors: {},
            showAddModal: false,
            showEditModal: false,
            showDelModal: false,
            response: '',
            checkpoint: false,
            disabledBtn: false,
            project: '',
            displayLoader: true,
            msgClass: '',
            status: '',
            alertmessage: '',
            delProject: '',
            delProjectWithIndex: '',
        };
    }

    componentDidMount = () => {
        console.log('didmount');
        this.handleGetProject();
        // const myHeaders = new Headers();
        // myHeaders.append('Access-Control-Allow-Origin', '*');
        // myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        // myHeaders.append('GET', 'POST', 'OPTIONS');

        // var requestOptions = {
        //     method: 'GET',
        //     headers: myHeaders,
        // };
        // fetch(`###REACT_APP_PLATFORM_URL###/project/projects`, requestOptions)
        //     .then(response => {
        //         console.log(response);
        //         if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
        //         return response.json();
        //     })
        //     .then((findresponse) => {
        //         console.log('find response in get', findresponse);
        //         if (findresponse.msg) {
        //             this.setState({ response: findresponse.msg });
        //         } else {
        //             this.setState({ projectArr: findresponse });
        //         }
        //     })
        //     .catch(error => {
        //         console.log('error', error);
        //     });
    }

    handleShowModal = (modalId) => {
        if (modalId === 'addprojectModal') this.setState({ showAddModal: !this.state.showAddModal });
        if (modalId === 'editprojectModal') this.setState({ showEditModal: !this.state.showEditModal });
        if (modalId === 'deleteprojectModal') this.setState({ showDelModal: !this.state.showDelModal });
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }
    handleGetProject = () => {
        console.log('getproject');
        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/project/projects`, requestOptions)
            .then(response => {
                console.log(response);
                if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ projectArr: findresponse });
                }
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    handleAddproject = () => {
        console.log('in addproject post');
        this.handleShowModal('addprojectModal');
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        console.log(process.env);
        const projectForm1 = document.getElementById('addProjectForm');
        const formData = new FormData(projectForm1);
        console.log(formData);
        console.log('form data', formData.get('project_name'));
        console.log('form data', formData.get('project_details'));
        var raw = JSON.stringify({ "project_name": formData.get('project_name'), "project_details": formData.get('project_details') });
        console.log(raw);

        const myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            dataType: "json",
        };
        fetch(`###REACT_APP_PLATFORM_URL###/project/projects`, requestOptions)
            .then((response) => {
                console.log(response.status);
                if (response.status == 200) {
                    this.setState({ alertmessage: 'success', checkpoint: true });
                    // this.setState({ msgClass: 'successMessage' });
                    this.handleGetProject();
                }
                else {
                    this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error' });
                }
                return response.text();
            })
            .then(result => {
                //   if (JSON.parse(result).message) { this.setState({ status: JSON.parse(result).message }); }
                //  this.setState({ displayLoader: false });
                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
            })
            .catch(error => {
                // this.setState({ displayLoader: false });
                console.log('error', error);
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
            });
    }

    handleUpdateProject = () => {
        // console.log(event);
        this.handleShowModal('editprojectModal');
        const editProjectForm1 = document.getElementById('editProjectForm');
        const formData = new FormData(editProjectForm1);
        formData.append('project_id', this.state.project_id);
        console.log('form data', formData.get('project_name'));
        console.log('form data', formData.get('project_details'));
        console.log('form data', formData.get('project_id'));
        var raw = JSON.stringify({ "project_name": formData.get('project_name'), "project_details": formData.get('project_details'), "project_id": formData.get('project_id') });
        // const raw = JSON.stringify(Object.fromEntries(formData));
        console.log(formData);
        console.log(raw);

        /* Edit User */
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            // dataType: "json",
        };
        //  this.setState({ displayLoader: true });
        fetch(`###REACT_APP_PLATFORM_URL###/project/projects`, requestOptions)
            .then((response) => {
                console.log(response.status);
                if (response.status == 200) {
                    console.log('response in edit project', response);
                    this.handleGetProject();
                }
                else {
                    this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error' });
                }
                return response.text();
            })
            .then(result => {

                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
            })
            .catch(error => {

                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
                console.log('error', error);
            });


    }

    handleEditProject = (name, details, project_id) => {
        this.setState({
            project_name: name,
            project_details: details,
            project_id: project_id,
            edit: true,
        });
        this.handleShowModal('editprojectModal');
    }

    handleDelete = () => {
        this.handleShowModal('deleteprojectModal');
        this.setState({ disabledBtn: true });
        const raw = { project_name: this.state.delProject };
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
        fetch(`###REACT_APP_PLATFORM_URL###/project/projects`, requestOptions)
            .then((response) => {
                this.setState({ disabledBtn: false });
                console.log(response.status);
                if (response.status == 200) {
                    this.state.projectArr.splice(this.state.delProjectWithIndex, 1);
                    this.setState({ msgClass: 'successMessage' });
                }
                else {
                    this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error' });
                }
                return response.text();
            })
            .then(result => {
                this.setState({ displayLoader: false });
                this.setState({ status: JSON.parse(result).message });
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
            })
            .catch(error => {
                this.setState({ displayLoader: false });
                console.log('error', error);
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
            });
    }

    handleDeleteBeforeConfirmation = (index, project) => {
        this.handleShowModal('deleteprojectModal');
        this.setState({ delProject: project, delProjectWithIndex: index });
    }
    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ ...fields, fields });
        const errors = {};
        this.setState({ errors });
    }

    contactSubmit = (e) => {
        console.log('inside contactSubmit');
        e.preventDefault();
        if (this.handleValidation()) {
            this.handleShowModal('addprojectModal');
            this.handleAddproject();
        } else {
            alert("Form has errors");
        }
    }
    contactSubmit1 = (e) => {
        console.log('inside contactSubmit1');
        e.preventDefault();
        //   if(this.handleValidation()){
        this.handleShowModal('editprojectModal');
        this.handleUpdateProject();
        //   }else{
        //       alert("Form has errors.")
        //   }
    }

    handleValidation() {
        console.log('inside handle validations');
        const { fields } = this.state;
        const errors = {};
        let formIsValid = true;
        this.setState({ fields });

        // project Name
        if (!fields.project_name) {
            formIsValid = false;
            errors.project_name = "Cannot be empty";
        }

        if (typeof fields.project_name !== "undefined") {
            if (!fields.project_name.match(/^[A-Za-z0-9_-]/)) {
                formIsValid = false;
                errors.project_name = "Invalid Input";
            }
        }


        if (!fields.project_details) {
            formIsValid = false;
            errors.project_details = "Cannot be empty";
        }

        if (typeof fields.project_details !== "undefined") {
            if (!fields.project_details.match(/^[A-Za-z0-9_-]/)) {
                formIsValid = false;
                errors.project_details = "Invalid Input";
            }
        }
        this.setState({ errors: errors });
        return formIsValid;

    }

    render() {
        console.log('render projectArr', this.state.projectArr);
        const showModalStyle = {
            display: 'block'
        };
        const hideModalStyle = {
            display: 'none'
        };
        /* Search Functionality */
        // if(this.state.projectArr.length>0){
        //     result = this.state.projectArr.filter(projectArr => projectArr.email.toLowerCase().indexOf(this.state.searchResult) != -1);
        // }  
        /* Table Body */

        let projectbody = '';
        if (this.state.projectArr.length > 0) {
            projectbody = this.state.projectArr.map((value, index) => {
                return (
                    <tr key={index} className="tight">
                        <td>{value.project_name}</td>
                        <td>{value.project_details}</td>
                        <td class="text-center">
                            <div class="dev-actions">
                                <a href="javascript:void(0)" data-toggle="modal" data-target="#editProjectForm" onClick={() => this.handleEditProject(value.project_name, value.project_details, value.project_id)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                                <a href="javascript:void(0)" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.project_name)} ><img src={require("images/delete-icon.svg")} alt="Delete" /></a>
                            </div>
                        </td>
                    </tr>);
            });
        }
        else if (this.state.projectArr.length == 0) { projectbody = <tr><td class="text-center text-primary" colSpan="3">{this.state.response}</td></tr>; }
        else projectbody = <tr><td className="text-center text-primary" colSpan="2">No Data To Display</td></tr>;
        // Edit project Form
        const editModelProject = <form className="modalbody" id='editProjectForm'>
            <div className="form-group">
                <label className="form-label">Project Name</label>
                <input type="text" name="project_name" value={this.state.project_name}
                    className="form-control" placeholder="Enter Project Name" onChange={this.handleChange.bind(this, "project_name")} readOnly />
                <span style={{ color: "red" }}>{this.state.errors.project_name}</span>
            </div>
            <br />
            <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" name="project_details" value={this.state.project_details}
                    className="form-control" placeholder="Enter Description" onChange={this.handleChange.bind(this, "project_details")} />
                <span style={{ color: "red" }}>{this.state.errors.project_details}</span>
            </div>
        </form>;
        // Add project Form
        const addModelProject = <form className="modalbody" id='addProjectForm'>
            <div className="form-group">
                <label className="form-label">Project Name</label>
                <input type="text" name="project_name"
                    className="form-control" placeholder="Enter Project Name" onChange={this.handleChange.bind(this, "project_name")} />
                <span style={{ color: "red" }}>{this.state.errors.project_name}</span>
            </div>
            <br />
            <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" name="project_details"
                    className="form-control" placeholder="Enter Description" onChange={this.handleChange.bind(this, "project_details")} />
                <span style={{ color: "red" }}>{this.state.errors.project_details}</span>
            </div>
        </form>;
        // Add project Form


        return (
            <>
                <div className="col dev-AI-infused-container dev-analytics">
                    <div className="py-4 myw-container">
                        <div className="d-flex align-items-center">
                            <div className="dev-page-title">Project</div>
                            <div className="ml-auto dev-actions">
                                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#addprojectModal" onClick={() => { this.handleShowModal('addprojectModal'); }}><img src={require("images/add.svg")} alt="Add" /> <span>Add</span></button>
                            </div>
                        </div>
                        <div className="dev-section my-4"> <div style={this.state.checkpoint ? showModalStyle : hideModalStyle}>
                            {this.state.checkpoint && <div className="alert myw-toast myw-alert alert-success alert-dismissible show" role="alert" >
                                <div>New Project added successfully.</div>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleShowModal('checkpoint') }}></button>
                            </div>}
                        </div>
                            <div className="table-responsive">
                                <table className="table table-striped dev-anlytics-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col" className="text-center" width="7%">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectbody}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <!-- modal - Add User --> */}
                        <div className="modal" id="addprojectModal" tabIndex="-1" role="dialog" aria-labelledby="addprojectModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="addprojectModaltitle">Add Project</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('addprojectModal'); }}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {addModelProject}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('addprojectModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={(e) => this.contactSubmit(e)} >Submit</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* <!-- /modal -  Add User --> */}
                        {/* <!-- modal - Edit User --> */}
                        <div className="modal" id="editprojectModal" tabIndex="-1" role="dialog" aria-labelledby="editprojectModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editprojectModaltitle">Edit Project</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('editprojectModal'); }}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {editModelProject}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('editprojectModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" aria-label="Close" onClick={this.contactSubmit1.bind(this)} >Submit</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* <!-- /modal -  Edit User --> */}
                        {/* <!-- modal - Delete User --> */}
                        <div className="modal" id="deleteprojectModal" tabIndex="-1" role="dialog" aria-labelledby="deleteprojectModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deleteprojectModaltitle">Delete Project</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deleteprojectModal'); }}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure?
                            </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('deleteprojectModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={(event) => this.handleDelete(event)}>Submit</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* <!-- /modal -  Delete User --> */}

                    </div>
                </div>
            </>
        );
    }

}
export default Project;