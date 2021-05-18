import React from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            test: [],
            showAddModal: false,
            showEditModal: false,
            showDelModal: false,
            response: '',
            delTestName: '',
            radioVal: 1,
            repo: [],
            fileStatus: 'No file chosen',
            listening: true,
            test_id: '',
            editErrors: {},
            editFields: {},
            status: '',
            checkpoint: false,
            fields: {},
            errors: {},
            isError: false,
            lableChange: 'Upload to'
        };
    }

    handleShowModal = (modalId) => {
        if (modalId === 'addtestModal') {
            const clear = this.state.showAddModal;
            this.setState({ showAddModal: !this.state.showAddModal });
            if (!clear) {
                document.getElementById('addTestForm').reset();
                this.setState({ fileStatus: 'No file chosen' });
                const errors = {};
                this.setState({ errors });
            }
        }
        if (modalId === 'edittestModal') {
            const clear = this.state.showEditModal;
            this.setState({ showEditModal: !this.state.showEditModal });
            if (!clear) {
                const editErrors = {};
                this.setState({ editErrors });
            }
        }
        if (modalId === 'deletetestModal') this.setState({ showDelModal: !this.state.showDelModal });
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }

    componentDidMount = () => {
        this.handleGetTest();
        this.handleGetRepository();
    }

    handleGetRepository = () => {
        const API_URL = process.env.REACT_APP_ONBOARDING;
        console.log(process.env);
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
                console.log(response.status);
                console.log(typeof (response));
                console.log(response);
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ repo: findresponse });
                    console.log(repo);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleGetTest = () => {
        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/tests`, requestOptions)
            .then(response => {
                console.log(typeof (response));
                // console.log(response);
                if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ test: findresponse });
                    console.log(this.state.test);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleSSE = (testArrCopy) => {
        console.log("testArrCopy", testArrCopy)
        let eventSource, remValue = {};
        if (this.state.listening) {
            eventSource = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/tests");
            eventSource.onopen = function (event) {
                console.log('open message')
            }
            eventSource.addEventListener("tests", event => {
                console.log("event", event)
                const usage = JSON.parse(event.data);
                console.log("usage", usage)
                if (usage.test_id) {
                    if (testArrCopy.length) {
                        let remtest = this.state.test.filter(task => {
                            if (!(task.test_id == usage.test_id)) {
                                return task
                            } else {
                                remValue = task
                            }
                        })
                        console.log(remtest)
                        console.log("testArrCopy", remValue)
                        this.setState({ listening: false, test: [...remtest, { ...remValue, ...usage }] })
                    }
                }
            })
            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                eventSource.close();
                this.setState({ listening: false })
            }
        }
    }

    handleAddTest = () => {
        this.handleShowModal('addtestModal')
        let addTestForm1 = document.getElementById('addTestForm');
        const fileInput = document.getElementById('test_file');
        let formData = new FormData(addTestForm1);
        var raw = JSON.stringify(Object.fromEntries(formData));
        console.log([...this.state.test, JSON.parse(raw)])
        console.log(fileInput.files[0])
        if (this.state.radioVal == 1) {
            formData.append("test_file", fileInput.files[0], fileInput.files[0].name);
        }
        /*AddÂ Test*/
        var myHeaders = new Headers();
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
        };

        fetch(`###REACT_APP_PLATFORM_URL###/onboard/tests`, requestOptions)
            .then((response) => {
                // console.log(response);
                // console.log(response.status);
                if (response.status == 200) {
                    this.setState({ listening: true });
                    this.setState({ isError: false, checkpoint: true });
                } else {
                    this.setState({ isError: true, checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                console.log(result);
                console.log(typeof (result));
                if (typeof (result) === 'object') {
                    const jsonData = JSON.parse(raw);
                    this.setState({ status: 'Test Onboarded Successfully' });
                    this.setState({ test: [...this.state.test, { ...jsonData, test_id: result.test_id }] });
                    // this.handleGetTest();
                    this.handleSSE(this.state.test);
                    console.log(JSON.parse(result).msg);
                }
                else { this.setState({ status: JSON.parse(result).msg }); }
                setTimeout(() => { this.setState({ checkpoint: false}); }, 3000);
            })
            .catch(error => {
                console.log('error' + error)
                setTimeout(() => { this.setState({ checkpoint: false}); }, 3000);
            });
        document.getElementById("addTestForm").reset();
        this.setState({ fileStatus: 'No file chosen' });

    }

    handleUpdateTest = () => {
        this.handleShowModal('edittestModal');
        const updateTestForm = document.getElementById('updateTestForm');
        const formData = new FormData(updateTestForm);
        formData.append('test_id', this.state.test_id);
        const raw = JSON.stringify({ "test_id": formData.get('test_id'), "test_category": formData.get('edit_test_category'), "test_description": formData.get('edit_test_description') });
        // console.log(raw);
        /* UpdateÂ Test */
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
        };

        fetch(`###REACT_APP_PLATFORM_URL###/onboard/tests`, requestOptions)
            .then((response) => {
                console.log(response.status);
                if (response.status == 200) {
                    console.log('response in edit project', response);
                    this.handleGetTest();
                    this.setState({ isError: false, checkpoint: true });
                }
                else {
                    this.setState({ isError: true, checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log(result);
                if (result.msg) { this.setState({ status: result.msg }); }
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
    }

    handleDelete = (event) => {
        this.handleShowModal('deletetestModal');
        this.setState({ disabledBtn: true });
        console.log(this.state.delTestName);
        const raw = {
            test_id: this.state.delTestName,
            delete_from_repo: false
        };
        // console.log(raw);
        const updatedArray = this.state.test.filter(task => task.test_id !== this.state.delTestName);
        console.log("updatedArray", updatedArray);
        const API_URL = process.env.REACT_APP_ONBOARDING;
        console.log(process.env);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(raw),
        };

        fetch(`###REACT_APP_PLATFORM_URL###/onboard/tests`, requestOptions)
            .then((response) => {
                this.setState({ disabledBtn: false });
                console.log(response.status);
                if(response.status == 200){
                    this.setState({ isError: false, test: updatedArray, checkpoint: true })
                } else {
                    this.setState({ status: 'There was an unknown error', isError: true, checkpoint: true })
                }
                return response.text();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log(result);
                if (JSON.parse(result).msg) { this.setState({ status: JSON.parse(result).msg }); }
                setTimeout(() => { this.setState({  checkpoint: false }); }, 3000);
            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
                this.setState({ disabledBtn: false });
                setTimeout(() => { this.setState({  checkpoint: false }); }, 3000);
            });
    }

    handleDeleteBeforeConfirmation = (name) => {
        this.handleShowModal('deletetestModal');
        this.setState({ delTestName: name });
    }

    handleRadio = (event) => {
        console.log('value:'+event.target.value);
        this.setState({ radioVal: event.target.value });
        if (event.target.value == 1) {
            this.setState({ lableChange: 'Upload to' })
        }
        else {
            this.setState({ lableChange: 'Upload from' })
        }
    }

    handleScriptType = (event) => {
        console.log('onclick ScriptType',+event.target.value);
        event.target.value == 'ansible' ? this.setState({ showCommands: true }) : this.setState({ showCommands: false });
    }

    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ ...fields, fields });
        const errors = {};
        const checkDuplicate = this.state.test.filter(task => task.test_name == fields.test_name);
        console.log(checkDuplicate);
        if (checkDuplicate.length > 0) {
            errors.test_name = "Test name already exists, Do you want to update?";
            this.setState({ errors: errors });
        }
        else {
            errors.test_name = "";
            this.setState({ errors: errors });
        }
    }
    handleEditTest = (data) => {
        this.setState({
            test_id: data.test_id,
            edit_test_name: data.test_name,
            edit_test_category: data.test_category,
            edit_test_description: data.test_description,
            edit_test_scripttype: data.test_scripttype,
            edit: true,
        });
        this.handleShowModal('edittestModal');
    }
    handleFileUpload = () => {
        this.setState({ fileStatus: document.getElementById('test_file').files[0].name });
        const errors = {};
        this.setState({ errors });
    }

    contactSubmit = (e) => {
        console.log('inside contactSubmit');
        e.preventDefault();
        if (this.handleValidation()) {
            console.log('validation successful');
            this.handleShowModal('addtestModal');
            this.handleAddTest();
        } else {
            alert("Form has errors.");
        }
    }

    handleValidation = () => {
        console.log('inside handle validations');
        const { fields } = this.state;
        const errors = {};
        let formIsValid = true;
        this.setState({ fields });
        console.log(fields, this.state.fields, 'fileds in Validation')
        // Name
        if (!fields.test_name) {
            formIsValid = false;
            errors.test_name = "Cannot be empty";
        }
        // invalid name
        if (typeof fields.test_name !== "undefined") {
            if (!fields.test_name.match(/^[A-Za-z][A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.test_name = "Invalid Input";
            }
            if(fields.test_name.length < 4 ){
                formIsValid = false;
                errors.test_name = "Minimum Length is 4";}
        }
        // test_description
        if (!fields.test_description) {
            formIsValid = false;
            errors.test_description = "Cannot be empty";
        }
        // invalid test_description
        if (typeof fields.test_description !== "undefined") {
            if (!fields.test_description.match(/^[A-Za-z0-9_-]/)) {
                formIsValid = false;
                errors.test_description = "Only letters";
            }
            if(fields.test_description.length < 4 ){
                formIsValid = false;
                errors.test_description = "Minimum Length is 4";}
        }
        if (!fields.test_category) {
            formIsValid = false;
            errors.test_category = "Cannot be empty";
        }
        if (!fields.test_scripttype) {
            formIsValid = false;
            errors.test_scripttype = "Cannot be empty";
        }
        if (!fields.test_repository) {
            formIsValid = false;
            errors.test_repository = "Cannot be empty";
        }
        if (this.state.radioVal == 1 && this.state.fileStatus === 'No file chosen') {
            formIsValid = false;
            errors.fileStatus = "Cannot be empty";
        }
        if (this.state.radioVal == 2 && !fields.test_path) {
            formIsValid = false;
            errors.fileStatus = "Cannot be empty";
        }
        if (this.state.radioVal == 2 && fields.test_path) {
            const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            const formElements = document.forms.addTestForm.elements.test_path.value;
            if (!regexp.test(formElements)) {
                formIsValid = false;
                errors.test_path = "Not a valid URL";
            }
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChangeEdit(field, e) {
        const { editFields } = this.state;
        editFields[field] = e.target.value;
        this.setState({ ...editFields, editFields });
        const editErrors = {};
        this.setState({ editErrors });
    }

    contactSubmit1 = (e) => {
        console.log('inside contactSubmit1');
        e.preventDefault();
        if (this.handleValidationEdit()) {
            console.log('validation successful');
            this.handleShowModal('edittestModal');
            this.handleUpdateTest();
        } else {
            alert("Form has errors.");
        }
    }

    handleValidationEdit = () => {
        let editFields = {
            edit_test_description: this.state.editFields.edit_test_description ? this.state.editFields.edit_test_description : this.state.edit_test_description,
            edit_test_category: this.state.editFields.edit_test_category ? this.state.editFields.edit_test_category : this.state.edit_test_category
        }
        const editErrors = {};
        let editForm = true;
        console.log('editFields inside Validation', editFields);
        // test_description
        if (!editFields.edit_test_description) {
            editForm = false;
            editErrors.edit_test_description = "Cannot be empty";
        }
        // invalid test_description
        if (typeof editFields.edit_test_description !== "undefined") {
            if (!editFields.edit_test_description.match(/^[A-Za-z0-9_-]/)) {
                editForm = false;
                editErrors.edit_test_description = "Only letters";
            }
            if(editFields.edit_test_description.length < 4 ){
                editForm = false;
                editErrors.edit_test_description = "Minimum Length is 4";}
                
        }
        this.setState({ editErrors: editErrors });
        return editForm;
    }

    render() {
        // console.log("test inside render", this.state.test)
        //Style for modal
        let showModalStyle = {
            display: 'block'
        };
        let hideModalStyle = {
            display: 'none'
        };

        /*Display testsitory Details in the Table*/
        let test = '';

        if (this.state.test.length > 0) {
            test = this.state.test.map((value, index) => {
                return <tr className="" key={index} >
                    {/* <td>{value.test_id}</td> */}
                    <td>{value.test_name}</td>
                    <td>{value.test_category}</td>
                    <td>{value.test_scripttype}</td>
                    <td>{value.test_description}</td>
                    <td align="center"><div className={(value.scan_result ? (value.scan_result == 'Safe' ? "dev-net-status done" : "dev-net-status fail") : "dev-net-status wip")}>&nbsp;</div></td>
                    <td>{value.onboard_status}</td>
                    <td class="text-center">
                        <div class="dev-actions">
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myUpdateRepositoryModal" onClick={() => this.handleEditTest(value)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myDeleteConfirmationModal" onClick={() => this.handleDeleteBeforeConfirmation(value.test_id)} ><img src={require("images/delete.svg")} alt="Delete" /></a>
                        </div>
                    </td>
                </tr>;
            });
        }
        else if (this.state.test.length == 0) { test = <tr><td class="text-center text-primary" colSpan="8">{this.state.response}</td></tr>; }
        else test = <tr><td class="text-center text-primary" colSpan="5">No Data To Display</td></tr>;

        let addTestModal = <form className="modalbody" id='addTestForm'>
            <div class="row">
                <div class="col-12 dev-templates">
                    <div class="form-group">
                        <label class="myw-checkbox myw-radio myw-inline">
                            <input type="radio" name="dev-asset-rd" value="1" onClick={(e) => this.handleRadio(e)} defaultChecked />
                            <span>New</span>
                        </label>
                        <label class="myw-checkbox myw-radio myw-inline">
                            <input type="radio" name="dev-asset-rd" value="2" onClick={(e) => this.handleRadio(e)} />
                            <span>Existing</span>
                        </label>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test Name<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="test_name" onChange={this.handleChange.bind(this, "test_name")} className="form-control" placeholder="Enter Name"  maxLength="24" />
                        <span style={{ color: "red" }}>{this.state.errors.test_name}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Test Description<span style={{ color: "red" }}>*</span></label>
                        <input name="test_description" type="text" onChange={this.handleChange.bind(this, "test_description")} className="form-control" placeholder="Enter Description" maxLength="120" />
                        <span style={{ color: "red" }}>{this.state.errors.test_description}</span>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Test category<span style={{ color: "red" }}>*</span></label>
                        <select name="test_category" className="form-control" onChange={this.handleChange.bind(this, "test_category")}>
                            <option selected>Select Type</option>
                            <option>performance</option>
                            <option>sanity</option>
                            <option>smoke</option>
                            <option>unit</option>
                            <option>regression</option>
                            <option>functional</option>
                            <option>integration</option>
                        </select>
                        <span style={{ color: "red" }}>{this.state.errors.test_category}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Script Type<span style={{ color: "red" }}>*</span></label>
                        <select name="test_scripttype" className="form-control" onChange={this.handleChange.bind(this, "test_scripttype")} onClick={(e) => this.handleScriptType(e)}>
                            <option selected>Select Type</option>
                            <option value="python">python</option>
                            <option value="ansible">ansible</option>
                        </select>
                        <span style={{ color: "red" }}>{this.state.errors.test_scripttype}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">{this.state.lableChange}<span style={{ color: "red" }}>*</span></label>
                        <select name="test_repository" className="form-control" onChange={this.handleChange.bind(this, "test_repository")}>
                            <option selected>Select Repository</option>
                            {this.state.repo.length > 0 && this.state.repo.map((item, key) => {
                                return (<option key={key} directory={item.repo_name} data-type={item.repo_type}>{item.repo_name}</option>);
                            })}
                        </select>
                        <span style={{ color: "red" }}>{this.state.errors.test_repository}</span>
                    </div>
                </div>
                {this.state.showCommands && <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Commands<span style={{ color: "red" }}>*</span></label>
                        <input name="test_commands" type="text" className="form-control"  onChange={this.handleChange.bind(this, "test_commands")} placeholder="Enter Entry Point" />
                        <span style={{ color: "red" }}>{this.state.errors.test_commands}</span>
                    </div>
                </div>}
                {this.state.radioVal == 1 && <div className="col-6 devnet-upload">
                    <div className="form-group">
                        <label className="form-label">Upload file<span style={{ color: "red" }}>*</span></label>
                        <div className="myw-upload-browse d-flex align-items-center">
                            <label className="btn btn-secondary">
                                <span>Browse</span>
                                <input id="test_file" type="file" onChange={this.handleFileUpload} />
                            </label>
                            <span className="ml-2 text-secondary">{this.state.fileStatus}</span>
                        </div>
                        <span style={{ color: "red" }}>{this.state.errors.fileStatus}</span>
                    </div>
                </div>}
                {this.state.radioVal == 2 && <div className="col-6 devnet-url">
                    <div className="form-group">
                        <label className="form-label">URL<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="test_path" className="form-control" placeholder="Enter URL"
                            onChange={this.handleChange.bind(this, "test_path")} />
                        <span style={{ color: "red" }}>{this.state.errors.test_path}</span>
                    </div>
                </div>}
            </div>
        </form>;

        let updateTestModal = <form className="modalbody" id='updateTestForm'>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test Name<span style={{ color: "red" }}>*</span></label>
                        <input name="edit_test_name" value={this.state.edit_test_name} type="text" class="form-control" placeholder="Enter Name" readOnly maxLength="24" />
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test Description<span style={{ color: "red" }}>*</span></label>
                        <input name="edit_test_description" type="text" value={this.state.edit_test_description} class="form-control" placeholder="Enter Description"
                            onChange={this.handleChangeEdit.bind(this, "edit_test_description")} maxLength="120" />
                        <span style={{ color: "red" }}>{this.state.editErrors.edit_test_description}</span>
                    </div>
                </div>

                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test category<span style={{ color: "red" }}>*</span></label>
                        <select name="edit_test_category" class="form-control" value={this.state.edit_test_category} onChange={this.handleChangeEdit.bind(this, "edit_test_category")}>
                            <option disabled>Select Type</option>
                            <option>performance</option>
                            <option>sanity</option>
                            <option>smoke</option>
                            <option>unit</option>
                            <option>regression</option>
                            <option>functional</option>
                            <option>integration</option>
                        </select>
                        <span style={{ color: "red" }}>{this.state.editErrors.edit_test_category}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Script Type<span style={{ color: "red" }}>*</span></label>
                        <select name="edit_test_scripttype" class="form-control" disabled>
                            <option selected>{this.state.edit_test_scripttype}</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>;
        return (
            <div class="col dev-AI-infused-container">
                <div class="myw-container py-4 ">
                    <div class="d-flex align-items-center">
                        <div class="dev-page-title">Test</div>
                        <div class="ml-auto dev-actions">
                            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#addtestModal" onClick={() => { this.handleShowModal('addtestModal'); }}><img src={require("images/add.svg")} alt="Add" /> <span>Add</span></button>
                        </div>
                    </div>
                    <div class="dev-section my-4">
                        <div style={this.state.checkpoint ? showModalStyle : hideModalStyle}>
                            {this.state.checkpoint && <div className={`alert myw-toast myw-alert alert-dismissible show ${this.state.isError ? 'alert-failed':'alert-success'}`} role="alert" >
                                <div>{this.state.status}</div>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleShowModal('checkpoint') }}></button>
                            </div>}
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped dev-anlytics-table">
                                <thead>
                                    <tr>
                                        {/* <th scope="col">Test Id</th> */}
                                        <th scope="col">Name</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Script Type</th>
                                        <th scope="col">Description</th>
                                        {/* <th scope="col">Parameter</th> */}
                                        <th scope="col">Security Scan</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" class="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {test}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* My Update Modal */}
                    <div className="modal" id="edittestModal" tabIndex="-1" role="dialog" aria-labelledby="editeositoryModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle} >
                        <div className="modal-backdrop show"></div>
                        {/* <div className="modal-backdrop show"></div> */}
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="edittestModaltitle">Edit Test</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('edittestModal') }}>
                                        <span aria-hidden="true">&nbsp;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {updateTestModal}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('edittestModal') }}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.contactSubmit1}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Add Test Modal */}
                    <div class="modal show" id="addtestModal" tabindex="-1" role="dialog" aria-labelledby="addtestModaltitle" data-backdrop="static" aria-modal="true" style={this.state.showAddModal ? showModalStyle : hideModalStyle}>
                        <div className="modal-backdrop show"></div>
                        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="addtestModaltitle">Add Test</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('addtestModal') }}>
                                        <span aria-hidden="true">&nbsp;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    {addTestModal}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('addtestModal') }}>Cancel</button>
                                    <button type="button" class="btn btn-primary" onClick={this.contactSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Delete Test modal */}
                    <div className="modal" id="deletetestModal" tabIndex="-1" role="dialog" aria-labelledby="deletetestModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle} >
                        <div className="modal-backdrop show"></div>
                        {/* <div className="modal-backdrop show"></div> */}
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="deletetestModaltitle">Delete Test</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deletetestModal') }}>
                                        <span aria-hidden="true">&nbsp;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    Do you want to delete Test?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('deletetestModal') }}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={(event) => this.handleDelete(event)}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Delete Test modal */}
                </div>
            </div>
        );
    }
}
export default Test;
