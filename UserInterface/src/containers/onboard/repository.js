import React from 'react';

class Repository extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            isHiddenSearchBox: true,
            username: '',
            url: '',
            type: '',
            currentAssetName: '',
            repoType: '',
            repo: [],
            msgClass: '',
            response: '',
            fields: {},
            errors: {},
            currentRepo: '',
            delRepoName: '',
            delConfirmation: 'yes',
            modal: '',
            showAddModal: false,
            showEditModal: false,
            showDelModal: false,
            disabledBtn: false,
            checkpoint: false,
            status: '',
            editErrors: {},
            editFields: {},
            isError: false
        };
    }

    componentDidMount = () => {
        this.handleGetRepository();
    }

    handleGetRepository = () => {
        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        fetch(`###REACT_APP_PLATFORM_URL###/onboard/repo`, requestOptions)
            .then(response => {
                // console.log(typeof (response), response);
                if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ repo: findresponse });
                    // console.log(repo)
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    handleShowModal = (modalId) => {
        if (modalId === 'addrepositoryModal') {
            const clear = this.state.showAddModal;
            this.setState({ showAddModal: !this.state.showAddModal });
            if (!clear) {
                document.getElementById('addRepositoryForm').reset();
                const editErrors = {};
                this.setState({ editErrors });
                const errors = {};
                this.setState({ errors });
            }
        }
        if (modalId === 'editrepositoryModal') {
            const clear = this.state.showEditModal;
            this.setState({ showEditModal: !this.state.showEditModal });
            if (!clear) {
                const editErrors = {};
                this.setState({ editErrors });
            }
        }
        if (modalId === 'deleterepositoryModal') this.setState({ showDelModal: !this.state.showDelModal })
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }

    handleAddRepository = () => {
        const addServicesForm = document.getElementById('addRepositoryForm');
        const formData = new FormData(addServicesForm);
        formData.append('action', 'create');
        const raw = JSON.stringify(Object.fromEntries(formData));
        const raw1 = JSON.stringify(Object.assign(Object.fromEntries(formData), { 'assets_info': [] }));

        /* Add Repository */
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            dataType: "json",
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/repo`, requestOptions)
            .then((response) => {
                // console.log(response);
                // console.log(response.status);
                if (response.status == 200) {
                    let duplicateIndex = '';
                    const checkDuplicate = this.state.repo.filter((task, index) => {
                        if (task.repo_name == formData.get('repo_name')) {
                            duplicateIndex = index;
                            return true;
                        }
                    });
                    // console.log(checkDuplicate);
                    if (checkDuplicate.length > 0) this.state.repo.splice(duplicateIndex, 1);
                    this.handleGetRepository();
                    this.setState({ isError: false, checkpoint: true });
                    // this.setState({ msgClass: 'successMessage', repo: [...this.state.repo, JSON.parse(raw1)], checkpoint: true });
                }
                else {
                    this.setState({ isError: true, status: 'There was an unknown error', checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                // console.log(result);
                if (result.msg) { this.setState({ status: result.msg }); }
                setTimeout(() => { this.setState({  checkpoint: false }); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
        document.getElementById("addRepositoryForm").reset();
    }

    handleUpdateRepository = () => {
        this.handleShowModal('editrepositoryModal')
        // console.log('inside update repo');
        // require('dotenv').config();    
        // const API_URL = REACT_APP_ONBOARDING;
        // console.log(process.env);
        // const token = sessionStorage.getItem('tokenStorage');

        const updateRepositoryForm = document.getElementById('updateRepositoryForm');
        const formData = new FormData(updateRepositoryForm);
        formData.append('action', 'modify');
        formData.append('edit_repo_vendor', this.state.edit_repo_vendor);
        const raw = JSON.stringify({
            "repo_name": formData.get('edit_repo_name'), "repo_vendor": formData.get('edit_repo_vendor'), "repo_url": formData.get('edit_repo_url'),
            "repo_username": formData.get('edit_repo_username'), "repo_password": formData.get('edit_repo_password'), "action": formData.get('action')
        });
        const raw1 = JSON.stringify({
            "repo_name": formData.get('edit_repo_name'), "repo_vendor": formData.get('edit_repo_vendor'), "repo_url": formData.get('edit_repo_url'),
            "repo_username": formData.get('edit_repo_username'), "repo_password": formData.get('edit_repo_password'), "action": formData.get('action'), 'assets_info': []
        });
        // console.log(raw1);
        // console.log(raw);
        /* Update Repository */
        const myHeaders = new Headers();
        //       myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            dataType: "json",
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/repo`, requestOptions)
            .then((response) => {
                // console.log(response.status);
                if (response.status == 200) {
                    let duplicateIndex = '';
                    const checkDuplicate = this.state.repo.filter((task, index) => {
                        if (task.repo_name == formData.get('repo_name')) {
                            duplicateIndex = index;
                            return true;
                        }
                    });
                    // console.log(checkDuplicate);
                    if (checkDuplicate.length > 0) this.state.repo.splice(duplicateIndex, 1);
                    this.handleGetRepository();
                    // this.setState({ msgClass: 'successMessage', repo: [...this.state.repo, JSON.parse(raw1)] });
                    this.setState({ isError: false, checkpoint: true });
                }
                else {
                    this.setState({ isError: true, status: 'There was an unknown error', checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                // console.log(result);
                if (result.msg) { this.setState({ status: result.msg }); }
                setTimeout(() => { this.setState({ checkpoint: false}); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
    }

    handleDelete = (event) => {
        this.handleShowModal('deleterepositoryModal');
        // this.setState({ disabledBtn: true });
        // console.log(this.state.delRepoName);
        const deleteData = this.state.repo.filter(task => task.repo_name === this.state.delRepoName);
        // console.log(deleteData,'deleteData')
        if(deleteData[0].assets_info.length > 0){
            this.setState({ status: 'Repository has associated assets so cannot be deleted', isError: true, checkpoint: true })
            setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
        } else{
            const raw = {
                repo_name: this.state.delRepoName,
                delete_assets: event.target.value
            };
            // console.log(raw);
            const updatedArray = this.state.repo.filter(task => task.repo_name !== this.state.delRepoName);
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(raw),
            };
            fetch(`###REACT_APP_PLATFORM_URL###/onboard/repo`, requestOptions)
            .then((response) => {
                // console.log(response)
                // this.setState({ disabledBtn: false });
                // console.log(response.status);
                 // (response.status == 200) ? this.setState({ repo: updatedArray, checkpoint: true }) : this.setState({ status: 'There was an unknown error', msgClass: 'errorMessage', checkpoint: true });
                 if(response.status == 200) {
                    this.setState({ repo: updatedArray, checkpoint: true , isError: false});
                }
                else{
                    this.setState({ status: 'There was an unknown error', isError: true, checkpoint: true })
                }
                return response.text();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                // console.log(result);
                if (JSON.parse(result).msg) { this.setState({ status: JSON.parse(result).msg }); }
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
                // this.setState({ disabledBtn: false });
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
        }
    }

    handleDeleteBeforeConfirmation = (name) => {
        this.handleShowModal('deleterepositoryModal')
        this.setState({ delRepoName: name });
    }

    displayAssetList = (currRepo) => {
        // console.log(currRepo.assets_info);
        // console.log(currRepo.assets_info.length);
        let currentAssetName = '';
        if (currRepo.assets_info.length > 0) {
            // console.log('inside if');
            currentAssetName = currRepo.assets_info.map((value1, index1) => {
                return (<>
                    <div className="statusTable row">
                        <span className="depStageBar col-sm-1"><vr className="verticalLine" /></span>
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
                </>);
            });
        }
        else {
            // console.log('inside else');
            currentAssetName =
                <>
                    <div className="statusTable row">
                        <span className="depStageBar col-sm-1"><vr className="verticalLine" /></span>
                        <span className="assetBlank col-sm-10">
                            <span className="stage" id="AssetName">No assets to display</span>
                        </span>
                    </div>
                </>;
        }
        // console.log(currentAssetName);
        this.setState({ currentRepo: currRepo.repo_name, currentAssetName: currentAssetName });
    }

    handleEditRepository = (name, vendor, url) => {
        this.setState({
            edit_repo_name: name,
            edit_repo_vendor: vendor,
            edit_repo_url: url,
            edit: true,
        });
        this.handleShowModal('editrepositoryModal')
    }

    handleChange(field, e) {
        const fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ ...fields, fields });
        const errors = {};
        const checkDuplicate = this.state.repo.filter(task => task.repo_name == fields.repo_name);
        // console.log(checkDuplicate);
        if (checkDuplicate.length > 0) {
            errors.repo_name = "Repo name already exists, Do you want to update?";
            this.setState({ errors: errors });
        }
        else {
            errors.repo_name = "";
            this.setState({ errors: errors });
        }
    }

    contactSubmit = (e) => {
        // console.log('inside contactSubmit');
        e.preventDefault();
        if (this.handleValidation()) {
            // console.log('validation successful')
            this.handleShowModal('addrepositoryModal')
            this.handleAddRepository();
        } else {
            alert("Form has errors.");
        }
    }

    contactSubmit1 = (e) => {
        // console.log('inside contactSubmit1');
        e.preventDefault();
        if (this.handleValidationEdit()) {
            // console.log('validation successful')
            this.handleShowModal('editrepositoryModal')
            this.handleUpdateRepository();
        } else {
            alert("Form has errors.");
        }
    }

    handleChangeEdit(field, e) {
        const { editFields } = this.state;
        editFields[field] = e.target.value;
        this.setState({ ...editFields, editFields });
        const editErrors = {};
        this.setState({ editErrors });
    }

    handleValidationEdit = () => {
        let editFields = {
            edit_repo_url: this.state.editFields.edit_repo_url ? this.state.editFields.edit_repo_url : this.state.edit_repo_url,
            edit_repo_username: this.state.editFields.edit_repo_username ? this.state.editFields.edit_repo_username : this.state.edit_repo_username,
            edit_repo_password: this.state.editFields.edit_repo_password ? this.state.editFields.edit_repo_password : this.state.edit_repo_password
        }
        // console.log(editFields, 'editFields1 obj')
        const editErrors = {};
        let editForm = true;
        if (!editFields.edit_repo_url) {
            editForm = false;
            editErrors.edit_repo_url = "Cannot be empty";
        }
        if (editFields.edit_repo_url) {
            const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            const formElements = document.forms.updateRepositoryForm.elements.edit_repo_url.value;
            if (!regexp.test(formElements)) {
                editForm = false;
                editErrors.edit_repo_url = "Not a valid URL";
            }
        }
        // Repo UserName
        if (!editFields.edit_repo_username) {
            editForm = false;
            editErrors.edit_repo_username = "Cannot be empty";
        }
        // Password              
        if (!editFields.edit_repo_password) {
            editForm = false;
            editErrors.edit_repo_password = "Cannot be empty";
        }
        this.setState({ editErrors: editErrors });
        return editForm;
    }

    handleValidation = () => {
        const fields = this.state.fields;
        const errors = {};
        let formIsValid = true;
        // console.log('fields inside Validation', fields)
        // Name
        if (!fields.repo_name) {
            formIsValid = false;
            errors.repo_name = "Cannot be empty";
        }
        // invalid name
        if (typeof fields.repo_name !== "undefined") {
            if (!fields.repo_name.match(/^[A-Za-z][A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.repo_name = "Invalid Input";
            }
            if(fields.repo_name.length < 4 ){
                formIsValid = false;
                errors.repo_name = "Minimum Length is 4";}
        
            }
        // Vendor
        if (!fields.repo_vendor) {
            formIsValid = false;
            errors.repo_vendor = "Cannot be empty";
        }
        // URL
        if (!fields.repo_url) {
            formIsValid = false;
            errors.repo_url = "Cannot be empty";
        }
        // INVALID URL
        if (fields.repo_url) {
            const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            const formElements = document.forms.addRepositoryForm.elements.repo_url.value;
            if (!regexp.test(formElements)) {
                formIsValid = false;
                errors.repo_url = "Not a valid URL";
            }
        }
        // Repo UserName
        if (!fields.repo_username) {
            formIsValid = false;
            errors.repo_username = "Cannot be empty";
        }
        // Password              
        if (!fields.repo_password) {
            formIsValid = false;
            errors.repo_password = "Cannot be empty";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    render() {
        //Style for modal
        let showModalStyle = {
            display: 'block'
        }
        let hideModalStyle = {
            display: 'none'
        }

        // /*Display Repository Details in the Table*/
        let repository = '';
        // console.log(this.state.repo)
        if (this.state.repo.length > 0) {
            repository = this.state.repo.map((value, index) => {
                return <tr className="" key={index} >
                    <td>{value.repo_name}</td>
                    <td>{value.repo_vendor}</td>
                    <td>{value.repo_url}</td>
                    <td>{value.assets_info.length}</td>
                    <td class="text-center repo_alignment">
                        <div class="dev-actions">
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myUpdateRepositoryModal" onClick={() => this.handleEditRepository(value.repo_name, value.repo_vendor, value.repo_url)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myDeleteConfirmationModal" onClick={() => this.handleDeleteBeforeConfirmation(value.repo_name)} ><img src={require("images/delete.svg")} alt="Delete" /></a>
                        </div>
                    </td>
                </tr>;
            });
        }
        else if (this.state.repo.length == 0) { repository = <tr><td class="text-center text-primary" colSpan="5">{this.state.response}</td></tr>; }
        else repository = <tr><td class="text-center text-primary" colSpan="5">No Data To Display</td></tr>;

        /* Add Repository Modal Body */
        const addRepositoryModal = <form className="modalbody" id='addRepositoryForm'>
            <div>
                <label className="form-label">Name<span style={{ color: "red" }}>*</span></label>
                <input type="text" name="repo_name" onChange={this.handleChange.bind(this, "repo_name")} className="form-control" placeholder="Enter Name" maxLength="24" />
                <span style={{ color: "red" }}>{this.state.errors.repo_name}</span>
                <br />
                <label className="form-label">Repository Type<span style={{ color: "red" }}>*</span></label>
                <select name="repo_vendor" onChange={this.handleChange.bind(this, "repo_vendor")} className="form-control" required>
                    <option selected>Select Repository Type</option>
                    <option value="JFrog">JFrog</option>
                    <option value="Nexus">Nexus</option>
                </select>
                <span style={{ color: "red" }}>{this.state.errors.repo_vendor}</span>
                <br />
                <label className="form-label">URL<span style={{ color: "red" }}>*</span></label>
                <input type="url" name="repo_url" className="form-control" placeholder="Enter URL" onChange={this.handleChange.bind(this, "repo_url")} />
                <span style={{ color: "red" }}>{this.state.errors.repo_url}</span>
                <br />
                <label className="form-label">Username<span style={{ color: "red" }}>*</span></label>
                <input type="text" name="repo_username" className="form-control" placeholder="Enter Username" onChange={this.handleChange.bind(this, "repo_username")} maxLength="24" />
                <span style={{ color: "red" }}>{this.state.errors.repo_username}</span>
                <br />
                <label className="form-label">Password<span style={{ color: "red" }}>*</span></label>
                <input type="password" name="repo_password" className="form-control" placeholder="Enter Password" onChange={this.handleChange.bind(this, "repo_password")} />
                <span style={{ color: "red" }}>{this.state.errors.repo_password}</span>
                <br />
                <br />
            </div>
        </form>;

        /* Update Repository Modal Body */
        const updateRepositoryModal = <form className="modalbody" id='updateRepositoryForm'>
            <div>
                <label className="form-label">Name<span style={{ color: "red" }}>*</span></label>
                <input type="text" name="edit_repo_name" value={this.state.edit_repo_name} className="form-control" placeholder="Enter Name" readOnly />
                <br />
                <label className="form-label">Repository Type<span style={{ color: "red" }}>*</span></label>
                <select className="form-control" name="edit_repo_vendor" defaultValue={this.state.edit_repo_vendor} disabled>
                    <option selected value={this.state.edit_repo_vendor}>{this.state.edit_repo_vendor}</option>
                </select>
                <br />
                <label className="form-label">URL<span style={{ color: "red" }}>*</span></label>
                <input type="url" name="edit_repo_url" className="form-control" placeholder="Enter URL" value={this.state.edit_repo_url} onChange={this.handleChangeEdit.bind(this, "edit_repo_url")} />
                <span style={{ color: "red" }}>{this.state.editErrors.edit_repo_url}</span>
                <br />
                <label className="form-label">Username<span style={{ color: "red" }}>*</span></label>
                <input type="text" name="edit_repo_username" className="form-control" placeholder="Enter Username" onChange={this.handleChangeEdit.bind(this, "edit_repo_username")} maxLength="24" />
                <span style={{ color: "red" }}>{this.state.editErrors.edit_repo_username}</span>
                <br />
                <label className="form-label">Password<span style={{ color: "red" }}>*</span></label>
                <input type="password" name="edit_repo_password" className="form-control" placeholder="Enter Password" onChange={this.handleChangeEdit.bind(this, "edit_repo_password")} />
                <span style={{ color: "red" }}>{this.state.editErrors.edit_repo_password}</span>
                <br />
                <br />
            </div>
        </form>;

        return (
            <>
                {/* <!-- content --> */}
                <div className="col dev-AI-infused-container">
                    <div className="myw-container py-4 ">
                        <div className="d-flex align-items-center">
                            <div className="dev-page-title">Repository</div>
                            <div className="ml-auto dev-actions">
                                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#addrepositoryModal" onClick={() => { this.handleShowModal('addrepositoryModal') }}><img src={require("images/add.svg")} alt="" /><span>Add</span></button>
                            </div>
                        </div>
                        <div className="dev-section my-4">
                            <div style={this.state.checkpoint ? showModalStyle : hideModalStyle}>
                                {this.state.checkpoint && <div className={`alert myw-toast myw-alert alert-dismissible show ${this.state.isError ? 'alert-failed':'alert-success'}`} role="alert" >
                                    <div>{this.state.status}</div>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleShowModal('checkpoint') }}></button>
                                </div>}
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped dev-anlytics-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col" className="repository_type">Repository Type</th>
                                            <th scope="col">URL</th>
                                            <th scope="col">Associated Assets</th>
                                            <th scope="col" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {repository}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <nav className="mt-4">
                        </nav>
                    </div>
                </div>

                {/* My Update Modal */}
                <div className="modal" id="editrepositoryModal" tabIndex="-1" role="dialog" aria-labelledby="editeositoryModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editrepositoryModaltitle">Edit Repository</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('editrepositoryModal') }}>
                                    <span aria-hidden="true">&nbsp;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {updateRepositoryModal}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('editrepositoryModal') }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={this.contactSubmit1}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Repo Modal */}
                <div className="modal" id="addrepositoryModal" tabIndex="-1" role="dialog" aria-labelledby="addrepositoryModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal ? showModalStyle : hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addrepositoryModaltitle">Add Repository</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('addrepositoryModal') }}>
                                    <span aria-hidden="true">&nbsp;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {addRepositoryModal}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('addrepositoryModal') }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={this.contactSubmit.bind(this)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete repo modal */}
                <div className="modal" id="deleterepositoryModal" tabIndex="-1" role="dialog" aria-labelledby="deleterepositoryModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleterepositoryModaltitle">Delete Repository</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deleterepositoryModal') }}>
                                    <span aria-hidden="true">&nbsp;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                             Do you want to delete Repository?
                                </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('deleterepositoryModal') }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={(event) => this.handleDelete(event)} disabled={this.state.disabledBtn}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default Repository;
