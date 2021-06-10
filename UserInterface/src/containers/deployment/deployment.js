import React from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Link } from 'react-router-dom';
import DeploymentStages from './deploymentStages';

class Deployment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deploy: [],
            assets: [],
            openDeploymentPage: false,
            isHiddenSearchBox: true,
            delDeploy: '',
            searchResult: '',
            disabledBtn: false,
            // environment: ['dev', 'test', 'production', 'stage', 'demo'],
            changeOrchestrator: '',
            changeCloudType: '',
            VNFList: [],
            VNFListOSM: [],
            CFTemplate: [],
            Config: [],
            ConfigCloud: [],
            VNFDList: [],
            NSDAsset: [],
            nameList: [],
            infraList: [],
            infra: [],
            deployNow: false,
            deployLater: false,
            expanded: false,
            currentDep: '',
            showAddPage: false,
            showEditModal: false,
            showDelModal: false,
            deleteDeployment: false,
            currScreen: 1,
            fields: {},
            errors: {},
            fileStatus: 'No file chosen',
            delDeployWithIndex: '',
            forceDelete: '',
            checkpoint: false,
            status: '',
            isError: false,
            environment: '',
            orchestrator: ''

        };
        this.selectedId = '';
    }

    getSpreadsheet = () => {
        // console.log('inside get spreadsheet');
        let API_URL = '###REACT_APP_PLATFORM_URL###/deploy' + "/" + 'config';
        // console.log(this.refs.depOrchestrator.value);
        // console.log(this.refs.changeCloudType.value, 'type');
        // console.log(this.refs.assets.value, 'assets');
        // console.log(this.state.orchestrator, 'orchestrator');
        if (this.state.orchestrator && this.refs.changeCloudType && this.refs.assets) {
            API_URL += "/" + this.state.orchestrator + "/" + this.refs.changeCloudType.value + "/" + this.refs.assets.value.split("=").pop();
            // console.log(API_URL);

            const myHeaders = new Headers();
            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };
            fetch(`${API_URL}`, requestOptions)
                .then((response) => {
                    // console.log(response);
                    // console.log(response.status);
                    if (response.status == 200) {
                        this.setState({ isError: false, checkpoint: true });
                    } else {
                        this.setState({ isError: true, checkpoint: true });
                        this.setState({ status: 'Download Failed' });
                    }
                    return response.blob();
                })
                .then(result => {
                    // console.log(result);
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(result);
                    a.setAttribute("download", 'Config');
                    a.click();
                    this.setState({ status: 'Downloaded Successfully' });
                    setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
                })
                .catch(error => {
                    console.log('error', error);
                    setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
                });
        }
        else {
            this.setState({ status: 'You have not made correct selection' ,isError: true, checkpoint: true});
            setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
        }
    }

    componentDidMount = () => {
        // require('dotenv').config(); 
        this.getNewDeploymentDetails();
        const API_URL = process.env.REACT_APP_DEPLOYMENT;
        const API_URL1 = process.env.REACT_APP_ASSETONBOARDING;
        // console.log(process.env);
        // const token = sessionStorage.getItem('tokenStorage');

        const myHeaders = new Headers();
        //myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        //Fetch Assets
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/asset`, requestOptions)
            .then(response => {
                // console.log(response);
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    // console.log(findresponse.msg);
                } else {
                    // console.log("assets", findresponse);
                    this.setState({ assets: findresponse });
                }
            })
            .catch(error => {
                console.log('error', error);
            });

        //Fetch Infra
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then(response => {
                // console.log(response);
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    // console.log(findresponse.msg);
                } else {
                    // console.log("infra", findresponse);
                    this.setState({ infra: findresponse });
                }
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    getNewDeploymentDetails = () => {
        // require('dotenv').config();    
        const API_URL = process.env.REACT_APP_DEPLOYMENT;
        const API_URL1 = process.env.REACT_APP_ASSETONBOARDING;
        // console.log(process.env);
        // const token = sessionStorage.getItem('tokenStorage');

        const myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch("###REACT_APP_PLATFORM_URL###/deploy/", requestOptions)
            .then(response => {
                // console.log(response);
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ deploy: findresponse });
                    // console.log(this.state.deploy);
                }
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    updateDeploymentArray = (data) => {
        // console.log(data, 'testing');
        // console.log(this.state.deploy);
        if (this.state.deploy) {
            this.state.deploy.map((value, index) => {
                if (value.id === data.id) {
                    // console.log('Value Matched');
                    this.state.deploy[index].status = data.status;
                    this.state.deploy[index].stage_info = data.stage_info;
                    // console.log( this.state.deploy[index],'matched record')
                }
            });
            this.setState({ deploy: this.state.deploy });
            if (this.selectedId === data.id) { this.setState({ currentDep: data }); }
        }
    }

    handleGetDeploySSE = () => {
        let es = {};
        es = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/deploy");
        es.onopen = function (event) {
            // console.log('open message');
        };
        es.addEventListener("deploy", e => {
            // console.log('inside event listner');
            // console.log(e.data);
            this.updateDeploymentArray(JSON.parse(e.data));
        });
    }

    handleAddDeploy = () => {
        // require('dotenv').config();    
        // let API_URL = process.env.REACT_APP_DEPLOYMENT;
        // let token = sessionStorage.getItem('tokenStorage');
        //  this.handleShowModal('adddeployModal');
        this.handleShowModal('adddeployPage');
        //   alert('handle add deploy');
        const addDeployForm1 = document.getElementById('addDeployForm');
        const formData = new FormData(addDeployForm1);
        const fileInput = document.getElementById('config');
        // console.log(fileInput);
        formData.append("config", fileInput.files[0], fileInput.files[0].name);
        // console.log(Object.fromEntries(formData));
        const raw = JSON.stringify(Object.fromEntries(formData));
        // console.log(Object.fromEntries(formData));
        // console.log(formData);
        // console.log(raw);

        /*Add Deploy*/
        const myHeaders = new Headers();
        //myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/deploy/`, requestOptions)
            .then((response) => {
                // console.log(response);
                // console.log(response.status);
                if (response.status == 200) {
                    this.getNewDeploymentDetails();
                    this.setState({ isError: false, checkpoint: true });
                } else {
                    this.setState({ isError: true, checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                // console.log(result);
                // console.log(typeof (result));
                if(result.msg){
                    this.setState({ status: result.msg });
                } else{
                    this.setState({ status: 'Deployment Successfully done' });
                }
                this.handleGetDeploySSE();
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                // console.log('error', error);
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
        // document.getElementById("addDeployForm").reset();
        this.setState({ fileStatus: 'No file chosen' });
    }

    handleDeployNow = () => {
        const addDeployForm = document.getElementById('addDeploymentForm');
        const formData = new FormData(addDeployForm);
        // var raw = JSON.stringify(Object.fromEntries(formData));
        const raw = Object.fromEntries(formData);
        // console.log(raw);
        // console.log(formData.getAll('VNF'));
    }

    handleDeployLater = () => {
        this.setState({ deployLater: !this.state.deployLater });
    }

    toggleDeployNowForm = () => {
        this.setState({ openDeploymentPage: !this.state.openDeploymentPage });
    }

    handleChangeOrchestrator = () => {
        this.setState({ changeOrchestrator: this.refs.depOrchestrator.value });
    }

    handleChangeCloudType = () => {
        // console.log(this.refs.changeCloudType.value);
        this.setState({ changeCloudType: this.refs.changeCloudType.value });
    }

    handledeleteSSE = () => {
        const es = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/deploy");
        es.onopen = function (event) {
            // console.log('open message');
        };
        es.addEventListener("deploy", e => {
            // console.log('inside event listner');
            // console.log(e.data);
            if ((JSON.parse(e.data).status) == "DELETE_IN_PROGRESS")
                this.handleGetDeploy();
            {
                this.state.deploy.splice(this.state.delDeployWithIndex, 1);
            };
        });
    } 

    handleDelete = () => {
        this.handleShowModal('deletedeployModal');
        // console.log(this.state.delDeploy);
        this.setState({ disabledBtn: true });
        const raw = {
            id: this.state.delDeploy,
            force_delete: this.state.forceDelete
        };
        // console.log(JSON.stringify(raw));
        // console.log(process.env);
        const token = sessionStorage.getItem('tokenStorage');
        const myHeaders = new Headers();
        //   myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(raw),
            //redirect: 'follow'
        };
        if (document.getElementById('loader')) { document.getElementById('loader').style.display = "block"; }
        fetch(`###REACT_APP_PLATFORM_URL###/deploy/`, requestOptions)
            .then((response) => {
                this.setState({ disabledBtn: false });
                if (response.status == 200) {
                    const delrow = this.state.deploy[this.state.delDeployWithIndex];
                    delrow.status = 'DELETE_IN_PROGRESS';
                    this.setState({ deploy: [...this.state.deploy, { ...delrow }] });
                    this.handledeleteSSE();
                    this.handleGetDeploy();
                    this.state.deploy.splice(this.state.delDeployWithIndex, 1);
                    this.setState({ isError: false, checkpoint: true });
                }
                else {
                    this.setState({ isError: true, checkpoint: true, status: 'There was an unknown error' });
                };
                return response.text();
            })
            .then(result => {
                // console.log(result);
                const result1 = JSON.parse(result);
                this.setState({ status: result1.msg });
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                console.log('error', error);
                this.setState({ disabledBtn: false });
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
    }

    handleDeleteBeforeConfirmation = (index, id, force) => {
        this.handleShowModal('deletedeployModal');
        this.setState({ delDeploy: id, delDeployWithIndex: index, forceDelete: force });
    }

    handleSearchEvent = (event) => {
        this.setState({ searchResult: this.refs.searchKey.value });
    }

    displayDeploymentStages = (currDeployment) => {
        // console.log(currDeployment);
        this.selectedId = currDeployment.id;
        // console.log(this.selectedId);
        this.setState({ currentDep: currDeployment, currentDepName: currDeployment.name, currentDepStatus: currDeployment.status, currentDepTime: currDeployment["created (utc)"] });
    }

    handleShowModal = (modalId) => {
        if (modalId === 'adddeployPage') {
            const clear = this.state.showAddPage;
            this.setState({ showAddPage: !this.state.showAddPage });
            if (!clear) {
                document.getElementById('addDeployForm').reset();
                this.setState({ fileStatus: 'No file chosen' });
                this.setState({ fields: {} });
                const errors = {};
                this.setState({ errors });
                this.setState({environment: '', orchestrator: '', currScreen: 1});
            }
        }
        if (modalId === 'editdeployModal') this.setState({ showEditModal: !this.state.showEditModal });
        if (modalId === 'deletedeployModal') this.setState({ showDelModal: !this.state.showDelModal });
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }

    handleBackScreen = () => {
        // console.log(this.state.currScreen);
        this.setState({ currScreen: --this.state.currScreen });
    }

    handleNextScreen = () => {
        // console.log(this.state.currScreen);
        if (this.state.currScreen === 1 && this.handleValidation1()) {
            // console.log('first screen')
            this.setState({ currScreen: ++this.state.currScreen });
        } else if (this.state.currScreen === 2 && this.handleValidationUpload()) {
            // console.log('second screen')
            this.setState({ currScreen: ++this.state.currScreen });
        } else {
            alert("Form has errors");
        }
    }
    handleFileUpload = () => {
        this.setState({ fileStatus: document.getElementById('config').files[0].name });
        const errors = {};
        this.setState({ errors });
    }

    contactSubmit1 = (e) => {
        // console.log('inside contactSubmit1');
        e.preventDefault();
        this.handleShowModal('adddeployPage');
        this.handleAddDeploy();
    }

    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ fields });
        const errors = {};
        this.setState({ errors });
        let infra_result = [];
        if (field === 'infra') {
            infra_result = this.state.infra.filter(item => item.infra_name === e.target.value)
            // console.log(infra_result);
            if (infra_result.length > 0) {
                this.setState({ environment: infra_result[0].environment.toLowerCase() });
                this.setState({ orchestrator: infra_result[0].orchestrator.toLowerCase() });
                fields['environment'] = infra_result[0].environment.toLowerCase();
                fields['orchestrator'] = infra_result[0].orchestrator.toLowerCase();
            } else {
                this.setState({ environment: '' });
                this.setState({ orchestrator: '' });
                fields['environment'] = '';
                fields['orchestrator'] = '';
            }
        }
        if (this.refs.changeCloudType) {
            this.handleChangeCloudType();
        }
    }

    handleValidationUpload = () => {
        // console.log('inside handle Validation Upload');
        const { fields } = this.state;
        const errors = {};
        let formIsValid = true;
        this.setState({ fields });

        if (this.state.changeCloudType === 'versa') {
            if (!fields.director_ip) {
                formIsValid = false;
                errors.director_ip = "Cannot be empty";
            }
            if (!fields.controller_ip) {
                formIsValid = false;
                errors.controller_ip = "Cannot be empty";
            }
        }
        if (this.state.fileStatus === 'No file chosen') {
            formIsValid = false;
            errors.fileStatus = "Cannot be empty";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    handleValidation1 = () => {
        // console.log('inside handle validations');
        // console.log(this.state.changeCloudType)
        const { fields } = this.state;
        const errors = {};
        let formIsValid = true;
        this.setState({ fields });

        // name              
        if (!fields.name) {
            formIsValid = false;
            errors.name = "Cannot be empty";
        }
        if (typeof fields.name !== "undefined") {
            if (!fields.name.match(/^[A-Za-z][A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.name = "Invalid Input";
            }
            if(fields.name.length < 4 ){
                formIsValid = false;
                errors.name = "Minimum Length is 4";}
        }
        // environment              
        if (!fields.environment) {
            formIsValid = false;
            errors.environment = "Cannot be empty";
        }
        // infra              
        if (!fields.infra) {
            formIsValid = false;
            errors.infra = "Cannot be empty";
        }
        // orchestrator             
        if (!fields.orchestrator) {
            formIsValid = false;
            errors.orchestrator = "Cannot be empty";
        }
        // type             
        if (this.state.changeCloudType === '' || this.state.changeCloudType === 'Select Type') {
            formIsValid = false;
            errors.type = "Cannot be empty";
        }
        // assets           
        if (!fields.assets) {
            formIsValid = false;
            errors.assets = "Cannot be empty";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    render() {
        // console.log("fields values", this.state.fields);
        // console.log('deploy', this.state.deploy)
        const dispFormData = '';
        const showModalStyle = {
            display: 'block'
        };
        const hideModalStyle = {
            display: 'none'
        };

        const thirdScreen = Object.keys(this.state.fields).map(val => {
            return (<div className="col-6 col-lg-4">
                <div className="form-group">
                    <div className="form-label" style={{ textTransform: 'capitalize' }}>{val}</div>
                    <div>{this.state.fields[val]}</div>
                </div>
            </div>
            );
        });

        let deploy = '';
        if (this.state.deploy.length > 0) {
            deploy = this.state.deploy.map((value, index) => {
                if (index == 1) {
                    // console.log(value.logs);
                }
                return <tr className="deploymentRows" key={index} onClick={() => this.displayDeploymentStages(value)}>
                    <td className="DepName">{value.name}</td>
                    <td>{value.environment}</td>
                    <td>{value.infra}</td>
                    <td>{value.status}</td>
                    {/* <td align="center" onClick={() => {this.handleShowModal('editdeployModal')}}><img src={require("images/edit.svg")} alt="Edit"/></td> */}
                    {/* <td align="center" onClick={() => {this.handleDeleteBeforeConfirmation(index, value.id, true);}}><img src={require("images/delete.svg")} alt="Delete"/></td> */}
                    <td align="center" onClick={() => { this.handleDeleteBeforeConfirmation(index, value.id, true); }}><img src={require("images/delete.svg")} alt="Delete" /></td>
                </tr>;
            });
        }
        else if (this.state.deploy.length == 0) { deploy = <tr><td className="text-center text-primary" colSpan="8">{this.state.response}</td></tr>; }
        else deploy = <tr><td className="text-center text-primary" colSpan="6">No Data To Display</td></tr>;

        /*Add Deployment Modal Body*/
        let addDeploymentMainPage = <form className="modalbody" id="addDeployForm">
            <div className="d-flex justify-content-center">
                <div className="myw-steps myw-dev-step">
                    <a className={`myw-step ${this.state.currScreen > 1 ? "completed" : "active"}`}><span>Enter Details</span></a>
                    <a className={`myw-step disabled ${this.state.currScreen > 2 ? "completed" : this.state.currScreen >= 2 ? "active" : "disabled"}`}><span>Add Configurations</span></a>
                    {/* <a className={`myw-step disabled ${this.state.currScreen > 3 ? "completed" : this.state.currScreen >= 3 ? "active" : "disabled"}`}><span>Select Security<br /> Scan</span></a>
                <a className={`myw-step disabled ${this.state.currScreen > 4 ? "completed" : this.state.currScreen >= 4 ? "active" : "disabled"}`}><span>Select Test<br /> Cases</span></a> */}
                    <a className={`myw-step disabled ${this.state.currScreen > 3 ? "completed" : this.state.currScreen >= 3 ? "active" : "disabled"}`}><span>Review &amp; Deploy</span></a>
                </div>
            </div>
            <div style={{ display: this.state.currScreen == 1 ? 'block' : 'none' }}>
                <div className="dev-section my-4" >
                    <div className="row">
                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Name<span style={{ color: "red" }}>*</span></label>
                                <input type="text" name="name" className="form-control" placeholder="Enter Name" onChange={this.handleChange.bind(this, "name")} maxLength="24" />
                                <span style={{ color: "red" }}>{this.state.errors.name}</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Infrastructure Cloud<span style={{ color: "red" }}>*</span></label>
                                <select name="infra" className="form-control" onChange={this.handleChange.bind(this, "infra")}>
                                    <option>Select Infra</option>
                                    {this.state.infra.map((item, index) => {
                                        return (<option value={item.infra_name} key={index} directory={item}>{item.infra_name}</option>);
                                    })}
                                </select>
                                <span style={{ color: "red" }}>{this.state.errors.infra}</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Environment<span style={{ color: "red" }}>*</span></label>
                                <input className="form-control" placeholder="Select Environment" name="environment" readOnly value={this.state.environment} />
                                <span style={{ color: "red" }}>{this.state.errors.environment}</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Orchestrator<span style={{ color: "red" }}>*</span></label>
                                <input className="form-control" placeholder="Select Orchestrator" name="orchestrator" readOnly value={this.state.orchestrator} />
                                <span style={{ color: "red" }}>{this.state.errors.orchestrator}</span>
                            </div>
                        </div>

                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Type<span style={{ color: "red" }}>*</span></label>
                                <select className="form-control" ref="changeCloudType" name="type" onChange={this.handleChangeCloudType}>
                                    <option selected>Select Type</option>
                                    <option value="generic">generic </option>
                                    <option value="versa">versa</option>
                                </select>
                                <span style={{ color: "red" }}>{this.state.errors.type}</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Asset<span style={{ color: "red" }}>*</span></label>
                                <select className="form-control" ref="assets" name="assets" onChange={this.handleChange.bind(this, "assets")}>
                                    <option selected>Select Asset</option>
                                    {this.state.assets && this.state.assets.map((item, index) => {
                                        return (<option value={`template=${item.asset_id}`} key={index} directory={item}>{item.asset_name}</option>);
                                    })}
                                </select>
                                <span style={{ color: "red" }}>{this.state.errors.assets}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: this.state.currScreen == 2 ? 'block' : 'none' }}>
                <div className="dev-section my-4">
                    <div className="row">

                        {this.state.changeCloudType == 'versa' &&
                            <>
                                <div className="col-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="form-label">Director IP<span style={{ color: "red" }}>*</span></label>
                                        <input type="text" name="director_ip" className="form-control" placeholder="Enter Director IP" onChange={this.handleChange.bind(this, "director_ip")} />
                                        <span style={{ color: "red" }}>{this.state.errors.director_ip}</span>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="form-label">Controller IP<span style={{ color: "red" }}>*</span></label>
                                        <input type="text" name="controller_ip" className="form-control" placeholder="Enter Controller IP" onChange={this.handleChange.bind(this, "controller_ip")} />
                                        <span style={{ color: "red" }}>{this.state.errors.controller_ip}</span>
                                    </div>
                                </div>
                            </>
                        }
                        <div className="col-6 col-lg-4 d-flex align-self-center">
                            <a href="javascript:;"><span download="Sample.xlsx" data-placement="top" onClick={this.getSpreadsheet} >Download Predefined template</span><img src={require("images/download-b.svg")} alt="" /></a>
                        </div>
                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Upload file<span style={{ color: "red" }}>*</span></label>
                                <div className="myw-upload-browse d-flex align-items-center">
                                    <label className="btn btn-secondary">
                                        <span>Browse</span>
                                        <input type="file" id="config" accept=".xlsx, .xls" onChange={this.handleFileUpload}></input>
                                    </label>
                                    <span className="ml-2 text-secondary">{this.state.fileStatus}</span>
                                </div>
                                <span style={{ color: "red" }}>{this.state.errors.fileStatus}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div style={{ display: this.state.currScreen == 3 ? 'block' : 'none' }}>
                <div className="dev-section my-4">
                    <div className="row">
                        {thirdScreen}
                    </div>
                </div>
            </div>
        </form>;


        /*Delete Deployment Modal Body*/
        const deleteDeploymentModal = <div className="modalbody">
            <div>
                <label className="w-25 px-3" htmlFor="email">Name :</label>
                <select name="depNewName" className="input-group-text my-2 w-50">
                    {this.state.nameList.map((item, index) => {
                        return (<option value={item} key={index} directory={item}>{item}</option>);
                    })}
                </select><br />
            </div>
        </div>;

        return (
            <>
                {!this.state.showAddPage && <div className="col dev-AI-infused-container" id="adddeployPage">
                    <div> <div className="myw-container py-4 ">
                        <div className="d-flex align-items-center">
                            <div className="dev-page-title">Deployment</div>
                            <div className="ml-auto dev-actions">
                                <button type="button" className="btn btn-secondary" data-toggle="tab" data-target="#adddeployPage"
                                    aria-controls="adddeployPage" onClick={() => { this.handleShowModal('adddeployPage'); }}><img src={require("images/add.svg")} alt="Add" /> <span>Add</span></button>
                            </div>
                        </div>
                        <div className="dev-section my-4">
                            <div style={this.state.checkpoint ? showModalStyle : hideModalStyle}>
                                {this.state.checkpoint && <div className={`alert myw-toast myw-alert alert-dismissible show ${this.state.isError ? 'alert-failed' : 'alert-success'}`} role="alert" >
                                    <div>{this.state.status}</div>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleShowModal('checkpoint') }}></button>
                                </div>}
                            </div>
                            <div className="row">
                                <div className="col-9">
                                    <div className="table-responsive">
                                        <table className="table table-striped dev-anlytics-table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Environment</th>
                                                    <th scope="col">Infrastructure_cloud</th>
                                                    <th scope="col">Status</th>
                                                    {/* <th scope="col" className="text-center" width="7%">Edit</th> */}
                                                    <th scope="col" className="text-center" width="7%">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deploy}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-3 dev-section">
                                    {!this.state.currentDep && <div>
                                        <div className="devnet-deploy-info">
                                            <div className="devnet-deploy-head">
                                                <div>Deployment Stages: <span>Deployment1</span></div>
                                                <div className="devnet-deploy-time">Deployed 14/10/2020 | 01:10 P.M.</div>
                                            </div>
                                            <div className="devnet-deploy-body">
                                                <div className="devnet-deploy-default mt-5">
                                                    Click on any Deployment to see the Deployment Stages.
                                               </div>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    {this.state.currentDep && 
                                        <DeploymentStages currentDep={this.state.currentDep} currDepName={this.state.currentDepName} currDepStatus={this.state.currentDepStatus} currDepTime={this.state.currentDepTime} />
                                    }
                                </div>


                            </div>
                        </div>
                  
                        {/* Edit deploy modal */}
                        <div className="modal devnet-modal" id="editdeployModal" tabIndex="-1" role="dialog" aria-labelledby="editdeployModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editdeployModaltitle">Edit Deployment</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('editdeployModal') }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('editdeployModal') }}>Cancel</button>
                                        <button type="button" className="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Delete deploy modal */}
                        <div className="modal" id="deletedeployModal" tabIndex="-1" role="dialog" aria-labelledby="deletedeployModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle} >
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deletedeployModaltitle">Delete Deploy</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deletedeployModal') }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                    Do you want to delete Deployment?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('deletedeployModal') }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={this.handleDelete}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delete deploy modal */}
                    </div>
                    </div>
                </div>}

                <div className="col dev-AI-infused-container" id="adddeployPage" style={this.state.showAddPage ? showModalStyle : hideModalStyle}>
                    <div className="py-4 myw-container">
                        <nav aria-label="breadcrumb" className="dev-breadcumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a data-toggle="tab" data-target="#adddeployPage" className="back_button" onClick={() => { this.handleShowModal('adddeployPage'); }}>Deployment</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Add Deployment</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="dev-sub-headbg">
                        <div className="myw-container">
                        <div className="dev-sub-head-title py-4"><a href="javascript:;"><img src={require("images/back-arrow.svg")} alt="Back" onClick={() => { this.handleShowModal('adddeployPage'); }}/></a> <span class="ml-2">Add Deployment</span></div>
                        </div>
                    </div>
                    <div className="modal-body">
                        {addDeploymentMainPage}
                    </div>
                    <div className="modal-footer">
                        {this.state.currScreen != 1 && <button type="button" className="btn btn-secondary" data-dismiss="modal" data-toggle="modal" data-target="#adddeployPage" onClick={this.handleBackScreen}>Back</button>}
                        {this.state.currScreen != 3 && <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#devnetConfigureModal" onClick={this.handleNextScreen}>Next</button>}
                        {this.state.currScreen == 3 && <><button type="button" className="btn btn-secondary" disabled>Deploy Later</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.contactSubmit1}>Deploy</button></>}
                    </div>
                </div>
            </>
        );
    }
}
export default Deployment;
