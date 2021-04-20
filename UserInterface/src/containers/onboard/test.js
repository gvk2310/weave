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
            fields: {},
            test_id: '',
            test_name:'',
            test_category: '',
            test_description: '',
            test_scripttype:'',
        };
    }

    handleShowModal = (modalId) => {
        if (modalId === 'addtestModal') this.setState({ showAddModal: !this.state.showAddModal });
        if (modalId === 'edittestModal') this.setState({ showEditModal: !this.state.showEditModal });
        if (modalId === 'deletetestModal') this.setState({ showDelModal: !this.state.showDelModal });
    }

    componentDidMount = () => {
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
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/tests`, requestOptions)
            .then(response => {
                console.log(typeof (response));
                console.log(response);
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
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/repo`, requestOptions)
            .then(response => {
                console.log(response.status);
                console.log(typeof (response));
                console.log(response);
                // if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)});};
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
                console.log(response);
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
        let eventSource, remValue = {};;
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
        /*Add Test*/
        var myHeaders = new Headers();
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
        };

        fetch(`###REACT_APP_PLATFORM_URL###/onboard/tests`, requestOptions)
            .then((response) => {
                console.log(response);
                console.log(response.status);
                if (response.status == 200) {
                    this.setState({ listening: true });
                } else {
                    this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error' });
                }
                return response.json();
            })
            .then(result => {
                // console.log(result )
                //         console.log(result);
                //         console.log(typeof(result));
                // if(result.msg){
                //     console.log(result.msg)
                //     this.setState({status:result.msg})}
                // else if(typeof(result) == 'object'){
                //     console.log("abc")
                //     const jsonData =  JSON.parse(raw);
                //     this.setState({status:result.msg, test: [...this.state.test, {...jsonData, test_id:result.test_id}]});
                //     this.handleSSE(this.state.test);
                // }
                //         setTimeout(() => {this.setState({status:'', msgClass:''})}, 3000);
                console.log(result);
                console.log(typeof (result));
                if (typeof (result) === 'object') {
                    const jsonData = JSON.parse(raw);
                    this.setState({ status: result.msg, test: [...this.state.test, { ...jsonData, test_id: result.test_id }] });
                    this.handleSSE(this.state.test);
                    console.log(JSON.parse(result).msg);
                }
                else { this.setState({ status: JSON.parse(result).msg }); }
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
            })
            .catch(error => {
                console.log('error' + error)
                setTimeout(() => { this.setState({ status: '', msgClass: '' }) }, 3000);
            });
        document.getElementById("addTestForm").reset();
        this.setState({ fileStatus: 'No file chosen' });

    }

    handleUpdateTest = () => {
        this.handleShowModal('edittestModal');
        const updateTestForm = document.getElementById('updateTestForm');
        const formData = new FormData(updateTestForm);
        formData.append('test_id', this.state.test_id);
        const raw =  JSON.stringify({ "test_id": formData.get('test_id'), "test_category": formData.get('test_category'), "test_description": formData.get('test_description') });
        console.log(raw);
        /* Update Test */
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
                    // let duplicateIndex = '';
                    // const checkDuplicate = this.state.test.filter((task, index) => {
                    //     // if(task.test_name == formData.get('test_name')){
                    //     if (task.test_id == this.state.testId) {
                    //         duplicateIndex = index;
                    //         return true;
                    //     }
                    // });
                    // console.log(checkDuplicate);
                    // if (checkDuplicate.length > 0) this.state.test.splice(duplicateIndex, 1);
                    // this.setState({ msgClass: 'successMessage', test: [...this.state.test, JSON.parse(raw)] });
                }
                else {
                    this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error' });
                }
                return response.json();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log(result);
                if (result.msg) { this.setState({ status: result.msg }); }

            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);

            });
        document.getElementById("updateTestForm").reset();
    }

    // handleDeleteBeforeConfirmation = (name) => {
    //     this.handleShowModal('deletetestModal');
    //     this.setState({delTestName: name});
    // }


    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ ...fields, fields });
        // const errors = {};
        // this.setState({ errors: errors });
    }

    handleDelete = (event) => {
        this.handleShowModal('deletetestModal');
        this.setState({ disabledBtn: true });
        console.log(this.state.delTestName);
        const raw = {
            test_id: this.state.delTestName,
            delete_from_repo: false
        };
        console.log(raw);
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
                (response.status == 200) ? this.setState({ msgClass: 'successMessage', test: updatedArray }) : this.setState({ status: 'There was an unknown error', msgClass: 'errorMessage' });
                return response.text();
            })
            .then(result => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log(result);
                if (JSON.parse(result).msg) { this.setState({ status: JSON.parse(result).msg }); }

            })
            .catch(error => {
                if (document.getElementById('loader')) { document.getElementById('loader').style.display = "none"; }
                console.log('error', error);
                this.setState({ disabledBtn: false });

            });
    }

    handleDeleteBeforeConfirmation = (name) => {
        this.handleShowModal('deletetestModal');
        this.setState({ delTestName: name });
    }

    handleRadio = (event) => {
        console.log(event.target.value);
        this.setState({ radioVal: event.target.value });
    }

    handleScriptType = (event) => {
        console.log(event.target.value);
        event.target.value == 'Ansible' ? this.setState({ showCommands: true }) : this.setState({ showCommands: false });
    }
    handleEditTest = (id, name,category, description,scripttype) => {
        this.setState({
            test_id: id,
            test_name:name,
            test_category: category,
            test_description: description,
            test_scripttype:scripttype,
            edit: true,
        });

        this.handleShowModal('edittestModal');
    }
    handleFileUpload = () => {
        this.setState({ fileStatus: document.getElementById('test_file').files[0].name });
    }

    render() {
        console.log("test inside render", this.state.test)
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
                    <td>{value.test_id}</td>
                    <td>{value.test_name}</td>
                    <td>{value.test_category}</td>
                    <td>{value.test_scripttype}</td>
                    <td>{value.test_description}</td>
                    <td align="center"><div className={(value.scan_result ? (value.scan_result == 'Safe' ? "dev-net-status done" : "dev-net-status fail") : "dev-net-status progress")}>&nbsp;</div></td>
                    <td>{value.onboard_status}</td>
                    <td class="text-center">
                        <div class="dev-actions">
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myUpdateRepositoryModal" onClick={() => this.handleEditTest(value.test_id, value.test_name,value.test_category, value.test_description,value.test_scripttype)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#myDeleteConfirmationModal" onClick={() => this.handleDeleteBeforeConfirmation(value.test_id)} ><img src={require("images/delete-icon.svg")} alt="Delete" /></a>
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
                            <input type="radio" name="dev-asset-rd" value="1" onClick={(e) => this.handleRadio(e)} />
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
                        <label class="form-label">Test Name</label>
                        <input name="test_name" type="text" class="form-control" placeholder="Enter Name" />
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test Description</label>
                        <input name="test_description" type="text" class="form-control" placeholder="Enter Name" />
                    </div>
                </div>

                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test category</label>
                        <select name="test_category" class="form-control">
                            <option>Select Type</option>
                            <option>performance</option>
                            <option>sanity</option>
                            <option>smoke</option>
                            <option>unit</option>
                            <option>regression</option>
                            <option>functional</option>
                            <option>integration</option>
                        </select>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Script Type</label>
                        <select name="test_scripttype" class="form-control" onClick={(e) => this.handleScriptType(e)}>
                            <option>Select Type</option>
                            <option value="python">python</option>
                            <option value="ansible">ansible</option>
                        </select>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Upload from</label>
                        <select name="test_repository" class="form-control">
                            <option>Select</option>
                            {this.state.repo.length > 0 && this.state.repo.map((item, key) => {
                                return (<option key={key} directory={item.repo_name} data-type={item.repo_type}>{item.repo_name}</option>);
                            })}
                        </select>
                    </div>
                </div>
                {this.state.showCommands && <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Commands</label>
                        <input name="test_commands" type="text" class="form-control" placeholder="Enter Entry Point" />
                    </div>
                </div>}
                {this.state.radioVal == 1 && <div class="col-6 devnet-upload">
                    <div class="form-group">
                        <label class="form-label">Upload file</label>
                        <div class="myw-upload-browse d-flex align-items-center">
                            <label class="btn btn-secondary">
                                <span>Browse</span>
                                <input id="test_file" type="file" onChange={this.handleFileUpload} />
                            </label>
                            <span class="ml-2 text-secondary">{this.state.fileStatus}</span>
                        </div>
                    </div>
                </div>}
                {this.state.radioVal == 2 && <div class="col-6 devnet-url">
                    <div class="form-group">
                        <label class="form-label">URL</label>
                        <input type="text" name="test_path" class="form-control" placeholder="Enter URL" />
                    </div>
                </div>}
            </div>
        </form>;

        let updateTestModal = <form className="modalbody" id='updateTestForm'>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test Name</label>
                        <input value={this.state.test_name} type="text" class="form-control" placeholder="Enter Name" readOnly/>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test Description</label>
                        <input name="test_description" type="text" value={this.state.test_description} class="form-control" placeholder="Enter Name" 
                        onChange={this.handleChange.bind(this, "test_description")}/>
                    </div>
                </div>

                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Test category</label>
                        <select name="test_category" class="form-control" value={this.state.test_category} onChange={this.handleChange.bind(this, "test_category")}>
                            <option>Select Type</option>
                            <option>performance</option>
                            <option>sanity</option>
                            <option>smoke</option>
                            <option>unit</option>
                            <option>regression</option>
                            <option>functional</option>
                            <option>integration</option>
                        </select>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label">Script Type</label>
                        <select name="test_scripttype" class="form-control" disabled>
                            <option selected>{this.state.test_scripttype}</option>
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
                        <div class="table-responsive">
                            <table class="table table-striped dev-anlytics-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Test Id</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Script Type</th>
                                        <th scope="col">Description</th>
                                        {/* <th scope="col">Parameter</th> */}
                                        <th scope="col">Scan</th>
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
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {updateTestModal}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('edittestModal') }}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.handleUpdateTest}>Submit</button>
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
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    {addTestModal}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('addtestModal') }}>Cancel</button>
                                    <button type="button" class="btn btn-primary" onClick={this.handleAddTest}>Submit</button>
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
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    are you sure?
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
