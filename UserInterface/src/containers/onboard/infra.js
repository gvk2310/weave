import React from 'react';

class Infra extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: '',
            infra: [],
            delInfraName: '',
            name: '',
            fields: {},
            errors: {},
            isHiddenSearchBox: true,
            cloud: '',
            access: '',
            secret: '',
            rcfile: '',
            password: '',
            url: '',
            next: false,
            previous: false,
            searchResult: '',
            response: '',
            conditionCloud: '',
            showAddModal: false,
            showEditModal: false,
            showDelModal: false,
            orcurl: '',
            orcusername: '',
            orcpassword: '',
            conditionOrchestrator: '',
            infra_name: '',
            cloud_type: '',
            environment: '',
            orchestrator: '',
            access_key: '',
            secret_key: '',
            infra_id: '',
            checkpoint: false,
            msgClass: '',
            alertmessage: '',
            editErrors: {},
            editFields: {},
            isError: false
        };
        this.handleCloud = this.handleCloud.bind(this);
        this.handleOrchestrator = this.handleOrchestrator.bind(this);

    }

    handleNext = () => {
        this.setState({ next: true });
    }

    handleCloud = () => {
        this.setState({ conditionCloud: this.refs.cloudType.value });
    }

    handleOrchestrator = () => {
        this.setState({
            conditionOrchestrator: this.refs.orchestrator.value,
            orcurl: '',
            orcusername: '',
            orcpassword: '',
        });
    }

    handleShowModal = (modalId) => {
        if (modalId === 'addinfraModal') {
            const clear = this.state.showAddModal;
            this.setState({ showAddModal: !this.state.showAddModal });
            if (!clear) {
                document.getElementById('addInfraForm').reset();
                const errors = {};
                this.setState({ errors });
            }
        }
        if (modalId === 'editinfraModal') {
            const clear = this.state.showEditModal;
            this.setState({ showEditModal: !this.state.showEditModal });
            if (!clear) {
                const editErrors = {};
                this.setState({ editErrors });
            }
        }
        if (modalId === 'deleteinfraModal') this.setState({ showDelModal: !this.state.showDelModal })
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }

    componentDidMount = () => {
       this.handleGetInfra();
    }

    handleGetInfra = () => {
        let API_URL = process.env.REACT_APP_ONBOARDING;
        // console.log(process.env);
        let token = sessionStorage.getItem('tokenStorage');

        let myHeaders = new Headers();
        //          myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', 'http:// localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            // redirect: 'follow'
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then(response => {
                // console.log(response.status);
                // console.log(typeof (response));
                // console.log(response);
                if (response.status != 200) { this.setState({ response: (`${response.status}  ${response.statusText}`) }); };
                return response.json();
            })
            .then((findresponse) => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ infra: findresponse });
                }
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
            });

    }

    handleAddInfra = () => {
        //  require('dotenv').config();    
        let API_URL = process.env.REACT_APP_ONBOARDING;
        let token = sessionStorage.getItem('tokenStorage');
        let addInfraForm1 = document.getElementById('addInfraForm');
        let formData = new FormData(addInfraForm1);
        formData.append('action', 'create');
        var raw = JSON.stringify({ "infra_name": formData.get('infra_name'), "cloud_type": formData.get('cloud_type'), "environment": formData.get('environment'), "orchestrator": formData.get('orchestrator'), "access_key": formData.get('access_key'), "secret_key": formData.get('secret_key'), "action": formData.get('action') });
        // console.log(formData);
        // console.log(raw);
        // console.log([...this.state.infra, JSON.parse(raw)]);

        /*Add Infra*/
        var myHeaders = new Headers();
        //        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then((response) => {
                // console.log(response);
                // console.log(response.status);
                if (response.status == 200) {
                    this.handleGetInfra();
                    var duplicateIndex = '';
                    const checkDuplicate = this.state.infra.filter((task, index) => {
                        if (task.infra_name == formData.get('infra_name')) {
                            duplicateIndex = index;
                            return true;
                        }
                    });
                    if (checkDuplicate !== '') this.state.infra.splice(duplicateIndex, 1);
                    this.setState({ msgClass: 'successMessage', infra: [...this.state.infra, JSON.parse(raw)],  isError: false, checkpoint: true });
                }
                else {
                    this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error',  isError: true, checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                if (result.msg) { this.setState({ status: result.msg }); }
                setTimeout(() => { this.setState({ msgClass: '' }); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log(`error${error}`);
                setTimeout(() => { this.setState({ msgClass: '' }); }, 3000);
            });
        document.getElementById("addInfraForm").reset();

    }

    handleUpdateInfra = () => {
        this.handleShowModal('editinfraModal')
        //  require('dotenv').config();    
        // let API_URL = process.env.REACT_APP_ONBOARDING;
        // let token = sessionStorage.getItem('tokenStorage');
        let updateInfraForm1 = document.getElementById('updateInfraForm');
        let formData = new FormData(updateInfraForm1);
        formData.append('infra_name', this.state.infra_name);
        formData.append('edit_infra_cloud_type', this.state.edit_infra_cloud_type);
        formData.append('edit_infra_orchestrator', this.state.edit_infra_orchestrator);
        formData.append('action', 'modify');
        var raw = JSON.stringify({ "infra_name": formData.get('edit_infra_name'), "cloud_type": formData.get('edit_infra_cloud_type'),
        "environment": formData.get('edit_infra_environment'), "orchestrator": formData.get('edit_infra_orchestrator'),
        "access_key": formData.get('edit_infra_access_key'),"secret_key": formData.get('edit_infra_secret_key'), "action": formData.get('action') });
        // console.log(formData);
        // console.log(raw);
        // console.log([...this.state.infra, JSON.parse(raw)]);

        /*Update Infra*/
        let myHeaders = new Headers();
        //        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then((response) => {
                // console.log(response);
                // console.log(response.status);
                if (response.status == 200) {
                    // console.log('editin infra 200k');
                    this.handleGetInfra();
                    this.setState({ msgClass: 'successMessage', isError: false, checkpoint: true });
                }
                else {
                    this.setState({ isError: true, checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                if (result.msg) { this.setState({ status: result.msg }); }
                setTimeout(() => { this.setState({ msgClass: '' }); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log(`error${error}`);
                setTimeout(() => { this.setState({ msgClass: '' }); }, 3000);
            });
        document.getElementById("updateInfraForm").reset();

    }

    handleEditInfra = (data) => {
        this.handleShowModal('editinfraModal');
        this.setState({
            edit_infra_name: data.infra_name,
            edit_infra_cloud_type: data.cloud_type,
            edit_infra_environment: data.environment,
            edit_infra_orchestrator: data.orchestrator,
            conditionCloud1: data.cloud_type,
            conditionOrchestrator1: data.orchestrator,
            edit: true,
        });
    }

    hadleDelete = (event) => {
        this.handleShowModal('deleteinfraModal')
        this.setState({ disabledBtn: true });
        // console.log(this.state.delInfraName);
        let raw = {
            infra_name: this.state.delInfraName,
        };
        // console.log(raw);
        const updatedArray = this.state.infra.filter(task => task.infra_name !== this.state.delInfraName);
        // console.log("updated Array", updatedArray);
        //  require('dotenv').config();    
        // let API_URL = process.env.REACT_APP_ONBOARDING;
        // console.log(process.env);
        // let token = sessionStorage.getItem('tokenStorage');
        var myHeaders = new Headers();
        //  myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(raw),
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then((response) => {
                // console.log(response)
                this.setState({ disabledBtn: false });
                // console.log(response.status);
                (response.status == 200) ? this.setState({ infra: updatedArray, isError: false, checkpoint: true }) : this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error', isError: true, checkpoint: true });
                return response.text();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                // console.log(result);
                if (JSON.parse(result).msg) { this.setState({ status: JSON.parse(result).msg }); }
                setTimeout(() => { this.setState({ msgClass: '' }); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
                this.setState({ disabledBtn: false });
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => { this.setState({ msgClass: '' }); }, 3000);
            });
    }

    hadleDeleteBeforeConfirmation = (name) => {
        this.handleShowModal('deleteinfraModal')
        this.setState({ delInfraName: name });
    }

    contactSubmit = (e) => {
        // console.log('inside contactSubmit');
        e.preventDefault();
        if (this.handleValidation()) {
            this.handleShowModal('addinfraModal')
            this.handleAddInfra();
        } else {
            alert("Form has errors.");
        }
    }

    contactSubmit1 = (e) => {
        // console.log('inside contactSubmit1');
        e.preventDefault();
        if (this.handleValidationEdit()) {
            // console.log('validation successful');
            this.handleShowModal('editinfraModal')
            this.handleUpdateInfra();
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

    toggleHiddenSearchBox = () => {
        this.setState({ isHiddenSearchBox: !this.state.isHiddenSearchBox });
    }

    handleSearchEvent = (event) => {
        this.setState({ searchResult: this.refs.searchKey.value });
    }


    handleValidation = () =>{
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        // Name
        if (!fields["infra_name"]) {
            formIsValid = false;
            errors["infra_name"] = "Cannot be empty";
        }

        // invalid name
        if (typeof fields.infra_name !== "undefined") {
            if (!fields.infra_name.match(/^[A-Za-z][A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.infra_name = "Invalid Input";
            }
            if(fields.infra_name.length < 4 ){
                formIsValid = false;
                errors.infra_name = "Minimum Length is 4";}
        }
        // cloud_type
        if (!fields["cloud_type"]) {
            formIsValid = false;
            errors["cloud_type"] = "Cannot be empty";
        }
        //  environment
        if (!fields["environment"]) {
            formIsValid = false;
            errors["environment"] = "Cannot be empty";
        }
        // orchestrator
        if (!fields["orchestrator"]) {
            formIsValid = false;
            errors["orchestrator"] = "Cannot be empty";
        }

        if (fields["cloud_type"] == 'AWS') {
            // Access Key
            if (!fields["access_key"]) {
                formIsValid = false;
                errors["access_key"] = "Cannot be empty";
            }
            //  Secret Key
            if (!fields["secret_key"]) {
                formIsValid = false;
                errors["secret_key"] = "Cannot be empty";
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleValidationEdit = () => {
        let editFields = {
            edit_infra_environment: this.state.editFields.edit_infra_environment ? this.state.editFields.edit_infra_environment : this.state.edit_infra_environment,
             edit_infra_access_key: this.state.editFields.edit_infra_access_key,
            edit_infra_secret_key: this.state.editFields.edit_infra_secret_key
        }
        const editErrors = {};
        let editForm = true;
        // console.log('editFields inside Validation', editFields);
        if (!editFields.edit_infra_environment) {
            editForm = false;
            editErrors.edit_infra_environment = "Cannot be empty";
        }
        // Access Key
        if (!editFields.edit_infra_access_key) {
            editForm = false;
            editErrors.edit_infra_access_key = "Cannot be empty";
        }
        //  Secret Key
        if (!editFields.edit_infra_secret_key) {
            editForm = false;
            editErrors.edit_infra_secret_key = "Cannot be empty";
        }
        this.setState({ editErrors: editErrors });
        return editForm;
    }

    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ ...fields, fields });
        const errors = {};
        const checkDuplicate = this.state.infra.filter(task => task.infra_name.toLowerCase() == fields["infra_name"].toLowerCase());
        // console.log(checkDuplicate);
        if (checkDuplicate.length > 0) {
            errors["infra_name"] = "Infra name already exists, Do you want to update?";
            this.setState({ errors: errors });
        }
        else {
            errors["infra_name"] = "";
            this.setState({ errors: errors });
        }

        //  Call handleCloud based on user choice of cloud_type
        if (fields["cloud_type"] != undefined) {
            this.handleCloud();
        }
        //  Call handleDictionary based on user choice of orchestrator
        if (fields["orchestrator"] != undefined) {
            this.handleOrchestrator();
        }
    }

    render() {
        // Style for modal
        let showModalStyle = {
            display: 'block'
        }
        let hideModalStyle = {
            display: 'none'
        }
        /*Display Infra Details in the Table*/
        let infra = '';
        let resultingInfra = [];
        // console.log(this.state.infra);
        if (this.state.infra.length >= 1) {
            infra = this.state.infra.map((value, index) => {
                return <tr className="" key={index}>
                    <td>{value.infra_name}</td>
                    <td>{value.cloud_type}</td>
                    <td>{value.environment}</td>
                    <td>{value.orchestrator}</td>
                    <td class="text-center">
                        <div class="dev-actions">
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myUpdateInfraModal" onClick={() => this.handleEditInfra(value)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myDeleteConfirmationModal" onClick={() => this.hadleDeleteBeforeConfirmation(value.infra_name)} ><img src={require("images/delete.svg")} alt="Delete" /></a>
                        </div>
                    </td>
                </tr>
            });
        }
        else if (this.state.infra.length == 0) { infra = <tr><td className="text-center text-primary" colSpan="5">{this.state.response}</td></tr>; }
        else { infra = <tr><td className="text-center text-primary" colSpan="5">No Data To Display</td></tr>; }

        /* Display Infra Details in the Table */
        /* Add Infra Modal Body */
        let addInfraModal = <form className="modalbody" id='addInfraForm' onSubmit={this.contactSubmit.bind(this)}>
            <div>
                <label className="form-label">Name<span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-control" name="infra_name" onChange={this.handleChange.bind(this, "infra_name")} placeholder="Enter Name" maxLength="24" />
                <span style={{ color: "red" }}>{this.state.errors["infra_name"]}</span>
                <br />

                <label className="form-label">Cloud<span style={{ color: "red" }}>*</span></label>
                <select ref="cloudType" name="cloud_type" onChange={this.handleChange.bind(this, "cloud_type")} className="form-control">
                    <option selected>Select Cloud</option>
                    <option>AWS</option>
                    {/* <option>Openstack</option> */}
                </select>
                <span style={{ color: "red" }}>{this.state.errors["cloud_type"]}</span>
                <br />

                {this.state.conditionCloud == 'AWS' && <> <label className="form-label">Access Key<span style={{ color: "red" }}>*</span></label>
                    <input type="password" className="form-control" name="access_key" onChange={this.handleChange.bind(this, "access_key")} placeholder="Enter Access Key" />
                    <span style={{ color: "red" }}>{this.state.errors["access_key"]}</span>
                    <br />

                    <label className="form-label">Secret Key<span style={{ color: "red" }}>*</span></label>
                    <input type="password" className="form-control" name="secret_key" onChange={this.handleChange.bind(this, "secret_key")} placeholder="Enter Secret Key" />
                    <span style={{ color: "red" }}>{this.state.errors["secret_key"]}</span>
                    <br /> </>}
                {/* }
                { this.state.conditionCloud == 'Openstack' &&
            <><label className="w-25 px-3" for="email">Rcfile :</label>
            <textarea
                type="text"
                // value={this.state.rcfile}
                multiline
                name="RcFile"
                onChange={this.handleChange.bind(this, "RcFile")}
                // rows={4}
                rows="4"
                cols="30"
            />
                <span style={{color: "red"}}>{this.state.errors["RcFile"]}</span>
                <br/> 
            </> */}
                {/* } */}
                <label className="form-label">Environment<span style={{ color: "red" }}>*</span></label>
                <select ref="infraName" name="environment" onChange={this.handleChange.bind(this, "environment")} className="form-control">
                    <option selected>Select Environment</option>
                    <option>Demo</option>
                    <option>Test</option>
                    <option>Development</option>
                    <option>Stage</option>
                    <option>Production</option>
                </select>
                <span style={{ color: "red" }}>{this.state.errors["environment"]}</span>
                <br />
                {this.state.conditionCloud == 'AWS' &&
                    <><label className="form-label">Orchestrator<span style={{ color: "red" }}>*</span></label>
                        <select ref="orchestrator" name="orchestrator" onChange={this.handleChange.bind(this, "orchestrator")} className="form-control">
                            <option selected disabled>Select Orchestrator</option>
                            <option>Cloudformation</option>
                        </select>
                        <span style={{ color: "red" }}>{this.state.errors["orchestrator"]}</span>
                        <br />
                    </>
                }
                {/* {this.state.conditionCloud == 'Openstack' &&
                    <><label className="w-25 px-3" htmlFor="email">Orchestrator :<span style={{ color: "red" }}>*</span></label>
                        <select ref="orchestrator" name="orchestrator" onChange={this.handleChange.bind(this, "orchestrator")} className="input-group-text my-2 w-50">
                            <option selected disabled>Select Orchestrator</option>
                            <option>OSM</option>
                            <option>Cloudify</option>
                        </select>
                        <span style={{ color: "red" }}>{this.state.errors["orchestrator"]}</span>
                        <br /> </>} */}

            </div>
        </form>;
        /* Add Infra Modal Body */

        /* Update Infra Modal Body */
        let updateInfraModal = <form className="modalbody" id='updateInfraForm'>
            <div>
                <label className="form-label" htmlFor="email">Name<span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-control" name="edit_infra_name" value={this.state.edit_infra_name} onChange={this.handleChangeEdit.bind(this, "edit_infra_name")} maxLength="24" readOnly />
                <br />
                <label className="form-label" htmlFor="email">Cloud <span style={{ color: "red" }}>*</span></label>
                <select name="edit_infra_cloud_type" value={this.state.edit_infra_cloud_type} className="form-control" disabled>
                    <option selected>{this.state.edit_infra_cloud_type}</option>
                </select>
                <br />
                {this.state.conditionCloud1 == 'AWS' &&
                    <><label className="form-label" htmlFor="email">Access Key<span style={{ color: "red" }}>*</span></label>
                        <input type="password" className="form-control" name="edit_infra_access_key" placeholder="Enter Access Key" onChange={this.handleChangeEdit.bind(this, "edit_infra_access_key")} />
                        <span style={{ color: "red" }}>{this.state.editErrors["edit_infra_access_key"]}</span>
                        <br />
                        <label className="form-label" htmlFor="email">Secret Key<span style={{ color: "red" }}>*</span></label>
                        <input type="password" className="form-control" name="edit_infra_secret_key" placeholder="Enter Secret Key" onChange={this.handleChangeEdit.bind(this, "edit_infra_secret_key")} />
                        <span style={{ color: "red" }}>{this.state.editErrors["edit_infra_secret_key"]}</span>
                        <br /></>
                }
                {/* {this.state.conditionCloud1 == 'Openstack' &&
                    <><label className="w-25 px-3" htmlFor="email">Rcfile </label>
                        <input type="text" className="form-control" multiline
                            name="RcFile" rows="4"
                            cols="30" />

                        <span style={{ color: "red" }}>{this.state.errors["RcFile"]}</span>
                        <br />
                    </>
                } */}
                <label className="form-label" htmlFor="email">Environment <span style={{ color: "red" }}>*</span></label>
                <select name="edit_infra_environment" value={this.state.edit_infra_environment} className="form-control" onChange={this.handleChangeEdit.bind(this, "edit_infra_environment")}>
                    <option disabled>Select Environment</option>
                    <option>Demo</option>
                    <option>Test</option>
                    <option>Development</option>
                    <option>Stage</option>
                    <option>Production</option>
                </select>
                <span style={{ color: "red" }}>{this.state.editErrors["edit_infra_environment"]}</span>
                <br />
                {this.state.conditionCloud1 == 'AWS' &&
                    <><label className="form-label" htmlFor="email">Orchestrator <span style={{ color: "red" }}>*</span></label>
                        <select ref="orchestrator" name="edit_infra_orchestrator" className="form-control" disabled >
                            <option selected>{this.state.edit_infra_orchestrator}</option>
                        </select>
                        <br />
                    </>
                }
                {/* {this.state.conditionCloud1 == 'Openstack' &&
                    <><label className="form-label" htmlFor="email">Orchestrator<span style={{ color: "red" }}>*</span> </label>
                        <select name="edit_infra_orchestrator" className="form-control">
                            <option selected disabled>Select Orchestrator</option>
                            <option>OSM</option>
                            <option>Cloudify</option>
                        </select>

                        <br /> </>} */}

                {/* {((this.state.conditionOrchestrator1 == 'OSM' || this.state.conditionOrchestrator == 'Cloudify') && this.state.conditionCloud == 'Openstack') &&
                    <><label className="w-25 px-3" htmlFor="email">Url :</label>
                        <input type="text" className="form-control" name="orchestrator_url" onChange={this.handleChangeEdit.bind(this, "orchestrator_url")} />

                        <span style={{ color: "red" }}>{this.state.errors["orchestrator_url"]}</span>
                        <br />
                        <label className="w-25 px-3" htmlFor="email">User Name :</label>
                        <input type="text" className="form-control" name="orchestrator_username" onChange={this.handleChangeEdit.bind(this, "orchestrator_username")} maxLength="24" />
                        <span style={{ color: "red" }}>{this.state.errors["orchestrator_username"]}</span>
                        <br />
                        <label className="w-25 px-3" htmlFor="email">Password :</label>
                        <input type="password" className="form-control" name="orchestrator_password" onChange={this.handleChangeEdit.bind(this, "orchestrator_username")} />

                        <span style={{ color: "red" }}>{this.state.errors["orchestrator_password"]}</span>
                        <br /> </>
                } */}

            </div>
        </form>;
        /*Update Infra Modal Body*/

        return (
            <>
                {/* <!-- content --> */}

                <div className="col dev-AI-infused-container">
                    <div className="myw-container py-4 ">
                        <div className="d-flex align-items-center">
                            <div className="dev-page-title">Infrastructure</div>
                            <div className="ml-auto dev-actions">
                                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#addinfraModal" onClick={() => { this.handleShowModal('addinfraModal') }}><img src={require("images/add.svg")} alt="Add" /> <span>Add</span></button>
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
                                            <th scope="col">Cloud</th>
                                            <th scope="col">Environment</th>
                                            <th scope="col">Orchestrator</th>
                                            <th scope="col" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {infra}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- /content --> */}

                {/* addinframodal */}
                <div className="modal" id="addinfraModal" tabIndex="-1" role="dialog" aria-labelledby="addinfraModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal ? showModalStyle : hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content infra_submit">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addinfraModaltitle">Add Infrastructure</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('addinfraModal') }}>
                                    <span aria-hidden="true">&nbsp;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {addInfraModal}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('addinfraModal') }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={this.contactSubmit.bind(this)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* addinframodal */}
                {/* editinframodal */}
                <div className="modal" id="editinfraModal" tabIndex="-1" role="dialog" aria-labelledby="editinfraModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content infra_submit">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editinfraModaltitle">Edit Infrastructure</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('editinfraModal') }}>
                                    <span aria-hidden="true">&nbsp;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {updateInfraModal}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('editinfraModal') }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={this.contactSubmit1}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* editinframodal */}
                {/* deleteinframodal */}
                <div className="modal" id="deleteinfraModal" tabIndex="-1" role="dialog" aria-labelledby="deleteinfraModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteinfraModaltitle">Delete Infrastructure</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deleteinfraModal') }}>
                                    <span aria-hidden="true">&nbsp;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Do you want to delete Infrastructure?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('deleteinfraModal') }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={(event) => this.hadleDelete(event)} disabled={this.state.disabledBtn}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* deleteinframodal */}

                {/* </div> */}
            </>
        );
    }
}
export default Infra;
