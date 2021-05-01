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
            environment: ['dev', 'test', 'production', 'stage', 'demo'],
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
        };
        this.selectedId = '';
    }

    handleMywStatus = (modalId) => {

    }

    getSpreadsheet = () => {
        console.log('inside get spreadsheet');
        let API_URL = '###REACT_APP_PLATFORM_URL###/deploy' + "/" + 'config';
        console.log(this.refs.depOrchestrator.value);
        console.log(this.refs.changeCloudType.value);
        console.log(this.refs.assets.value);
        if (this.refs.depOrchestrator && this.refs.changeCloudType && this.refs.assets) {
            API_URL += "/" + this.refs.depOrchestrator.value + "/" + this.refs.changeCloudType.value + "/" + this.refs.assets.value.split("=").pop();
            console.log(API_URL);

            const myHeaders = new Headers();
            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };
            fetch(`${API_URL}`, requestOptions)
                .then((response) => {
                    console.log(response);
                    console.log(response.status);
                    (response.status == 200) ? this.setState({ msgClass: '' }) : alert(response.status + '  ' + response.statusText);
                    return response.blob();
                })
                .then(result => {
                    console.log(result);
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(result);
                    a.setAttribute("download", 'Config');
                    a.click();
                })
                .catch(error => {
                    console.log('error', error);
                });
        }
        else {
            alert('You have not made correct selection');
        }
    }

    componentDidMount = () => {

        // require('dotenv').config();    
        const API_URL = process.env.REACT_APP_DEPLOYMENT;
        const API_URL1 = process.env.REACT_APP_ASSETONBOARDING;
        console.log(process.env);
        const token = sessionStorage.getItem('tokenStorage');

        const myHeaders = new Headers();
        //        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch("###REACT_APP_PLATFORM_URL###/deploy/", requestOptions)
            .then(response => {
                console.log(response);
                if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
                return response.json();
            })
            .then((findresponse) => {

                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ deploy: findresponse });
                    console.log(this.state.deploy);
                }
            })
            .catch(error => {

                console.log('error', error);
            });
        //Fetch Assets
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/asset`, requestOptions)
            .then(response => {
                console.log(response);
                //   if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)});};
                return response.json();
            })
            .then((findresponse) => {
                // console.log("asset",this.state.asset)

                if (findresponse.msg) {
                    console.log(findresponse.msg);
                } else {
                    console.log("assets", findresponse);
                    this.setState({ assets: findresponse });
                }
            })
            .catch(error => {

                console.log('error', error);
            });

        //Fetch Infra
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then(response => {
                console.log(response);
                //   if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)});};
                return response.json();
            })
            .then((findresponse) => {
                // console.log("asset",this.state.asset)

                if (findresponse.msg) {
                    console.log(findresponse.msg);
                } else {
                    console.log("infra", findresponse);
                    this.setState({ infra: findresponse });
                }
            })
            .catch(error => {

                console.log('error', error);
            });

        //SSE
        const es = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/deploy");
        es.onopen = function (event) {
            console.log('open message');
        };
        es.addEventListener("deploy", e => {
            console.log('inside event listner');
            console.log(e.data);
            console.log(JSON.parse(e.data).message);
            this.updateDeploymentArray(JSON.parse(e.data));

        });
    }

    getNewDeploymentDetails = () => {
        // require('dotenv').config();    
        const API_URL = process.env.REACT_APP_DEPLOYMENT;
        const API_URL1 = process.env.REACT_APP_ASSETONBOARDING;
        console.log(process.env);
        const token = sessionStorage.getItem('tokenStorage');

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch("###REACT_APP_PLATFORM_URL###/deploy/", requestOptions)
            .then(response => {
                console.log(response);
                // if(response.status != 200){this.setState({response: (response.status + "  " + response.statusText)})};
                return response.json();
            })
            .then((findresponse) => {

                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ deploy: findresponse });
                    console.log(this.state.deploy);
                }
            })
            .catch(error => {

                console.log('error', error);
            });
    }

    updateDeploymentArray = (data) => {
        console.log(data, 'testing');
        if (this.state.deploy) {
            this.state.deploy.map((value, index) => {
                if (value.id == data.deployment_id) {
                    console.log('Value Matched');
                    this.state.deploy[index].status = data.status;
                    this.state.deploy[index].stage_info = data.stage_info;
                }
            });
            console.log(this.state.deploy);
            this.setState({ deploy: this.state.deploy });
            if (this.selectedId == data.deployment_id) { this.setState({ currentDep: data }); }
        }
    }

    handleGetDeploySSE = () => {
        //SSE
        const es = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/deploy");
        es.onopen = function (event) {
            console.log('open message');
        };
        es.addEventListener("deploy", e => {
            console.log('inside event listner');
            console.log(e.data);
            console.log(JSON.parse(e.data).message);
            this.updateDeploymentArray(JSON.parse(e.data));

        });
    }

    handleGetDeploy = () => {

        console.log(process.env);

        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch("###REACT_APP_PLATFORM_URL###/deploy/", requestOptions)
            .then(response => {
                console.log(response);
                if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
                return response.json();
            })
            .then((findresponse) => {

                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg });
                } else {
                    this.setState({ deploy: findresponse });
                    console.log(this.state.deploy);
                }
            })
            .catch(error => {

                console.log('error', error);
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
        console.log(fileInput);
        formData.append("config", fileInput.files[0], fileInput.files[0].name);
        console.log(Object.fromEntries(formData));
        const raw = JSON.stringify(Object.fromEntries(formData));
        console.log(Object.fromEntries(formData));
        console.log(formData);
        console.log(raw);

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
                console.log(response);
                console.log(response.status);
                //   (response.status == 200) ? this.setState({msgClass:'successMessage',asset: [...this.state.asset, JSON.parse(raw)]}) : alert(response.status + '  ' +response.statusText);
                (response.status == 200) ? this.handleGetDeploy() : alert(response.status + '  ' + response.statusText);
                this.displayDeploymentStages();
                return response.json();
            })
            .then(result => {

                console.log(result);
                console.log(typeof (result));
                if (typeof (result) == 'object') {
                    //   alert(result.msg);
                }
                else {
                    this.setState({ status: JSON.parse(result).message });
                    setTimeout(() => { this.setState({ status: '' }); }, 3000);
                }
            })
            .catch(error => {
                console.log('error', error);
                //  alert('error', error);
            });
        // document.getElementById("addDeployForm").reset();
        this.setState({ fileStatus: 'No file chosen' });
    }

    handleDeployNow = () => {
        const addDeployForm = document.getElementById('addDeploymentForm');
        const formData = new FormData(addDeployForm);
        console.log(formData);
        // var raw = JSON.stringify(Object.fromEntries(formData));
        const raw = Object.fromEntries(formData);
        console.log(raw);
        console.log(formData.getAll('VNF'));
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
        console.log(this.refs.changeCloudType.value);
        this.setState({ changeCloudType: this.refs.changeCloudType.value });
    }

    handledeleteSSE = () => {
        const es = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/deploy");
        es.onopen = function (event) {
            console.log('open message');
        };
        es.addEventListener("deploy", e => {
            console.log('inside event listner');
            console.log(e.data);
            //   while((JSON.parse(e.data).status) == "DELETE_IN_PROGRESS")
            //   { this.state.deleteDeployment = false; };
            //   console.log(e.data);
            if ((JSON.parse(e.data).status) == "DELETE_IN_PROGRESS")
                this.handleGetDeploy();
            {
                this.state.deploy.splice(this.state.delDeployWithIndex, 1);
            };

            //   if((JSON.parse(e.data).status) == "DELETE_COMPLETE")
            //   {
            //       this.state.deploy.splice(this.state.delDeployWithIndex, 1);
            //   };
        });
    }

    //   handledeleteSSE = () => {        
    //       var es = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/deploy");
    //       es.onopen = function(event){
    //           console.log('open message');
    //       };  
    //       es.addEventListener("deploy", e => {
    //           console.log('inside event listner');
    //           console.log(e.data);
    //            if(JSON.parse(e.data).status =="DELETE_COMPLETE"){                  
    //               this.state.deploy.splice(this.state.delDeployWithIndex, 1);
    //           };
    //       });
    //   } 

    handleDelete = () => {
        this.handleShowModal('deletedeployModal');
        console.log(this.state.delDeploy);
        this.setState({ disabledBtn: true });
        const raw = {
            id: this.state.delDeploy,
            force_delete: this.state.forceDelete
        };
        console.log(JSON.stringify(raw));
        console.log(process.env);
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
                // document.querySelector('#myDeleteConfirmationModal .close').click();    
                //   if(response.status==200) {
                //       this.handledeleteSSE();
                //       //   this.state.deploy.splice(this.state.delDeployWithIndex, 1);
                //       this.setState({msgClass:'successMessage'});
                //   }
                if (response.status == 200) {
                    const delrow = this.state.deploy[this.state.delDeployWithIndex];
                    delrow.status = 'DELETE_IN_PROGRESS';
                    this.setState({ deploy: [...this.state.deploy, { ...delrow }] });
                    this.handledeleteSSE();
                    this.handleGetDeploy();
                    this.state.deploy.splice(this.state.delDeployWithIndex, 1);
                    this.setState({ msgClass: 'successMessage' });
                }
                else {
                    this.setState({ msgClass: 'errorMessage', status: 'There was an unknown error' });
                };
                return response.text();
            })
            .then(result => {

                console.log(result);
                const result1 = JSON.parse(result);
                this.setState({ status: result1.msg });
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
            })
            .catch(error => {

                console.log('error', error);
                this.setState({ disabledBtn: false });
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => { this.setState({ status: '', msgClass: '' }); }, 3000);
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
        console.log(currDeployment);
        this.selectedId = currDeployment.id;
        console.log(this.selectedId);
        console.log(currDeployment);
        // this.setState({ currentDep: currDeployment, currentDepName: currDeployment.name });
        this.setState({ currentDep: currDeployment, currentDepName: currDeployment.name, currentDepTime : currDeployment["created (utc)"] });
    }

    getDeploymentData = (data) => {
        this.getNewDeploymentDetails();
    }

    handleShowModal = (modalId) => {
        if (modalId === 'adddeployPage') this.setState({ showAddPage: !this.state.showAddPage });
        if (modalId === 'editdeployModal') this.setState({ showEditModal: !this.state.showEditModal });
        if (modalId === 'deletedeployModal') this.setState({ showDelModal: !this.state.showDelModal });
    }

    handleBackScreen = () => {
        console.log(this.state.currScreen);
        this.setState({ currScreen: --this.state.currScreen });
    }

    handleNextScreen = () => {
        console.log(this.state.currScreen);
        this.setState({ currScreen: ++this.state.currScreen });
    }
    handleFileUpload = () => {
        this.setState({ fileStatus: document.getElementById('config').files[0].name });
    }

    contactSubmit1 = (e) => {
        console.log('inside contactSubmit1');
        e.preventDefault();
        if (this.handleValidation1()) {
            this.handleShowModal('adddeployPage');
            this.handleAddDeploy();
            this.handleNextScreen();
        } else {
            alert("Form has errors.");
        }
    }

    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ fields });
        const errors = {};
        this.setState({ errors });
        if (this.refs.changeCloudType) {
            this.handleChangeCloudType();
        }
    }

    handleValidation1() {
        console.log('inside handle validations');
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
            if (!fields.name.match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors.name = "Only letters";
            }
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
        if (!fields.type) {
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
        console.log("fields values", this.state.fields);
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
                    <div className="form-label">{val}</div>
                    <div>{this.state.fields[val]}</div>
                </div>
            </div>
            );
        });
        console.log("abc", thirdScreen);

        let deploy = '';
        if (this.state.deploy.length > 0) {
            deploy = this.state.deploy.map((value, index) => {
                if (index == 1) {
                    console.log(value.logs);
                }
                return <tr className="deploymentRows" key={index} onClick={() => this.displayDeploymentStages(value)}>
                    <td className="DepName">{value.name}</td>
                    <td>{value.environment}</td>
                    <td>{value.infra}</td>
                    <td className="font_statusdeploy">{value.status}</td>
                    {/* <td align="center" onClick={() => {this.handleShowModal('editdeployModal')}}><img src={require("images/edit.svg")} alt="Edit"/></td> */}
                    {/* <td align="center" onClick={() => {this.handleDeleteBeforeConfirmation(index, value.id, true);}}><img src={require("images/delete-icon.svg")} alt="Delete"/></td> */}
                    <td align="center" onClick={() => { this.handleDeleteBeforeConfirmation(index, value.id, true); }}><img src={require("images/delete-icon.svg")} alt="Delete" /></td>
                </tr>;
            });
        }
        else if (this.state.deploy.length == 0) { deploy = <tr><td className="text-center text-primary" colSpan="8">{this.state.response}</td></tr>; }
        else deploy = <tr><td className="text-center text-primary" colSpan="6">No Data To Display</td></tr>;

        console.log("deploy", deploy);

        /*Add Deployment Modal Body*/
        let addDeploymentMainPage = <form className="modalbody" id="addDeployForm" onSubmit={this.contactSubmit1.bind(this)}>
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
                                <label className="form-label">Infrastructure_cloud<span style={{ color: "red" }}>*</span></label>
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
                                <select className="form-control" name="environment" ref="infraName" onChange={this.handleChange.bind(this, "environment")}>
                                    <option>Select Environment</option>
                                    {this.state.environment.map((item, index) => {
                                        return (<option value={item} key={index} directory={item}>{item}</option>);
                                    })}
                                </select>
                                <span style={{ color: "red" }}>{this.state.errors.environment}</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Orchestrator<span style={{ color: "red" }}>*</span></label>
                                <select className="form-control" ref="depOrchestrator" name="orchestrator" onChange={this.handleChange.bind(this, "orchestrator")}>
                                    <option>Select Orchestrator</option>
                                    <option value="cloudformation">cloudformation</option>
                                    <option value="OSM">OSM</option>
                                </select>
                                <span style={{ color: "red" }}>{this.state.errors.orchestrator}</span>
                            </div>
                        </div>

                        <div className="col-6 col-lg-4">
                            <div className="form-group">
                                <label className="form-label">Type<span style={{ color: "red" }}>*</span></label>
                                <select className="form-control" ref="changeCloudType" name="type" onChange={this.handleChangeCloudType}>
                                    <option>Select Type</option>
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
                                    <option selected disabled>Select Asset</option>
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
                        {/* <div className="col-6 col-lg-4">
                        <div className="form-group">
                            <label className="form-label">Download Predefined template</label>
                            <div><button type="button" className="btn btn-secondary"><img src={require("images/excel-icon.svg")} alt="" /><span download="Sample.xlsx" data-placement="top" onClick={this.getSpreadsheet}>Download Template.xls</span><img src={require("images/down.svg")} alt="" /></button></div>
                        </div>
                    </div> */}
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
                                {/* <button type="button" className="btn">
                              <img src={require("images/search.svg")} alt="Search"/>
                              <span>Search</span>
                          </button>
                          <button type="button" className="btn">
                              <img src={require("images/filter.svg")} alt="Filter"/>
                              <span>Filter</span>
                          </button> */}
                                <button type="button" className="btn btn-secondary" data-toggle="tab" data-target="#adddeployPage"
                                    aria-controls="adddeployPage" onClick={() => { this.handleShowModal('adddeployPage'); }}><img src={require("images/add.svg")} alt="Add" /> <span>Add</span></button>
                            </div>
                        </div>
                        <div className="dev-section my-4">
                            <div className="row">
                                <div className="col-9">
                                    <div className="table-responsive">
                                        <table className="table table-striped dev-anlytics-table devnet-deploy-table">
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
                                                <nav className="devnet-steps d-none">
                                                    <a href="javascript:;" className="completed">
                                                        <span>Deploy</span>
                                                        <p>Done</p>
                                                    </a>
                                                    <a href="javascript:;" className="completed">
                                                        <span>Security Check</span>
                                                        <p>Checked</p>
                                                    </a>
                                                    <a href="javascript:;" className="completed">
                                                        <span>Device Creation</span>
                                                        <p>Done</p>
                                                    </a>
                                                    <a href="javascript:;" className="completed">
                                                        <span>Stage Branches</span>
                                                        <p>Done</p>
                                                    </a>
                                                    <a href="javascript:;" className="completed">
                                                        <span>Test</span>
                                                        <p>No Errors</p>
                                                    </a>
                                                    <a href="javascript:;" className="active">
                                                        <span>Certify</span>
                                                        <p>InProgress</p>
                                                    </a>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    {this.state.currentDep && <>
                                        {/* <p className="DepName dn-capital">{this.state.currentDepName}</p> */}
                                        {/* <DeploymentStages currentDep={this.state.currentDep} currDepName={this.state.currentDepName} /> */}
                                        <DeploymentStages currentDep={this.state.currentDep} currDepName={this.state.currentDepName} currDepTime={this.state.currentDepTime}/>
                                    </>
                                    }
                                </div>


                            </div>
                        </div>
                        {/* <nav className="mt-4">
                            <div className="pagination justify-content-end">
                                <a href="javascript:;" className="page-link disabled" tabIndex="-1" aria-disabled="true">&lt;</a>
                                <a href="javascript:;" className="page-link active" aria-current="page">1 <span className="sr-only">(current)</span></a>
                                <a href="javascript:;" className="page-link">2</a>
                                <a href="javascript:;" className="page-link">3</a>
                                <span className="page-link disabled">...</span>
                                <a href="javascript:;" className="page-link">7</a>
                                <a href="javascript:;" className="page-link">&gt;</a>
                                <span className="page-link p-0">
                                    <select className="form-control form-control-sm">
                                        <option>10/ Page</option>
                                    </select>
                                </span>
                            </div>
                        </nav> */}
                        {/* Add deploy modal */}


                        {/*}  <div className="modal devnet-modal" id="adddeployModal" tabIndex="-1" role="dialog" aria-labelledby="adddeployModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal?showModalStyle:hideModalStyle}>
  <div className="modal-backdrop show"></div>
    <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="adddeployModaltitle">Add Deployment</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {this.handleShowModal('adddeployModal')}}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                {addDeploymentModalPage}
            </div>
            <div className="modal-footer">
                {this.state.currScreen != 1 && <button type="button" className="btn btn-secondary" data-dismiss="modal" data-toggle="modal" data-target="#adddeployModal" onClick={this.handleBackScreen}>Back</button>}
                {this.state.currScreen != 3 && <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#devnetConfigureModal" onClick={this.handleNextScreen}>Next</button>}
                {this.state.currScreen == 3 && <><button type="button" className="btn btn-secondary">Deploy Later</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handleAddDeploy}>Deploy Now</button></>}
            </div>
        </div>
    </div>
   </div> */}

                        {/* Edit deploy modal */}
                        <div className="modal devnet-modal" id="editdeployModal" tabIndex="-1" role="dialog" aria-labelledby="editdeployModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editdeployModaltitle">Edit Deployment</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('editdeployModal') }}>
                                            <span aria-hidden="true">&times;</span>
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
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        are you sure?
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
                            <div className="dev-sub-head-title py-4"><a href="javascript:;"><img src={require("images/back-arrow.svg")} alt="Back" /></a> <span class="ml-2">Add Deployment</span></div>
                        </div>
                    </div>
                    <div className="modal-body">
                        {addDeploymentMainPage}
                    </div>
                    <div className="modal-footer">
                        {this.state.currScreen != 1 && <button type="button" className="btn btn-secondary" data-dismiss="modal" data-toggle="modal" data-target="#adddeployPage" onClick={this.handleBackScreen}>Back</button>}
                        {this.state.currScreen != 3 && <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#devnetConfigureModal" onClick={this.handleNextScreen}>Next</button>}
                        {this.state.currScreen == 3 && <><button type="button" className="btn btn-secondary">Deploy Later</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handleAddDeploy}>Deploy</button></>}
                    </div>
                </div>
            </>
        );
    }
}
export default Deployment;
