import React from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

class Asset extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            radioVal: 1,
            group: '',
            name: '',
            type: '',
            vendor: '',
            version: '',
            uploadto: '',
            uploadfile: '',
            isHiddenSearchBox: true,
            fields: {},
            errors: {},
            security: '',
            asset: [],
            repo: [],
            delAsset: '',
            msgClass: '',
            selectedFile: null,
            delAssetWithIndex: '',
            loaded: 0,
            disabledBtn: false,
            repoType: '',
            searchResult: '',
            response: '',
            showAddModal: false,
            showEditModal: false,
            showDelModal: false,
            listening: true,
            radioNew: "existing",
            nameList: [],
            vendorList: [],
            groupList: [],
            typeList: [],
            sizeList: [],
            versionList: [],
            editFields: {},
            editErrors: {},
            securityList: [],
            fileStatus: 'No file chosen',
            asset_id: '',
            checkpoint: false,
            isError: false,
            lableChange: 'Upload to'

        };
        this.handleRepoType = this.handleRepoType.bind(this);
    }

    componentDidMount = () => {


        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/asset`, requestOptions)
            .then(response => {
                // console.log(response);
                if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
                return response.json();
            })
            .then((findresponse) => {

                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg, asset: [] });
                } else {
                    this.setState({ asset: findresponse });
                }
            })
            .catch(error => {

                console.log('error', error);
            });

        // Fetch Repo
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/repo`, requestOptions)
            .then(response => {
                // console.log(response.status);
                // console.log(typeof (response));
                return response.json();
            })
            .then((findresponse) => {
                // console.log(findresponse);
                this.setState({ repo: findresponse });
            })
            .catch(error => console.log('error', error));
    }

    handleGetAsset = () => {
        // console.log('in getasset');
        const myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/asset`, requestOptions)
            .then(response => {
                // console.log(response);
                if (response.status != 200) { this.setState({ response: (response.status + "  " + response.statusText) }); };
                return response.json();
            })
            .then((findresponse) => {
                if (findresponse.msg) {
                    this.setState({ response: findresponse.msg , asset: []});
                } else {
                    this.setState({ asset: findresponse });
                }
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    handleRepoType = () => {
        var e = document.getElementById("SelectAsset");
        var option = e.options[e.selectedIndex];
        var repoType = option.getAttribute("data-type");
        this.setState({ repoType: repoType });
        // console.log(repoType);
    }

    handleSSE = (assetArrCopy) => {
        // console.log(assetArrCopy);
        //New 
        let eventSource, remValue = {};
        if (this.state.listening) {
            eventSource = new EventSourcePolyfill("###REACT_APP_PLATFORM_URL###/events/asset");
            eventSource.onopen = function (event) {
                // console.log('open message');
            };
            eventSource.addEventListener("asset", event => {
                const usage = JSON.parse(event.data);
                // console.log(usage);
                if (usage.asset_id) {
                    if (assetArrCopy.length) {
                        const remAsset = this.state.asset.filter(task => {
                            if (!(task.asset_id == usage.asset_id)) {
                                return task;
                            } else {
                                remValue = task;
                            }
                        });
                        // console.log(remAsset);
                        // console.log("assetArrCopy", remValue);
                        this.setState({ listening: false, asset: [...remAsset, { ...remValue, ...usage }] });
                    }
                }
            });
            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                eventSource.close();
                this.setState({ listening: false });
            };
        }
    }

    handleShowModal = (modalId) => {
        if (modalId === 'addassetModal') {
            const clear = this.state.showAddModal;
            this.setState({ showAddModal: !this.state.showAddModal });
            if (!clear) {
                document.getElementById('addAssetForm').reset();
                this.setState({ fileStatus: 'No file chosen' });
                const errors = {};
                this.setState({ errors });
            }
        }
        if (modalId === 'editassetModal') {
            const clear = this.state.showEditModal;
            this.setState({ showEditModal: !this.state.showEditModal });
            if (!clear) {
                const editErrors = {};
                this.setState({ editErrors });
            }
        }
        if (modalId === 'deleteassetModal') this.setState({ showDelModal: !this.state.showDelModal });
        if (modalId === 'checkpoint') this.setState({ checkpoint: !this.state.checkpoint });
    }

    handleAddAsset = () => {
        this.handleShowModal('addassetModal');
        const addAssetForm1 = document.getElementById('addAssetForm');
        const fileInput = document.getElementById('asset_file');
        // console.log(fileInput);
        const formData = new FormData(addAssetForm1);
        var raw = JSON.stringify(Object.fromEntries(formData));
        // console.log("raw", raw);
        if (this.state.radioVal == 1) {
            formData.append("asset_file", fileInput.files[0], fileInput.files[0].name);
        }
        // console.log("new Array", Object.fromEntries(formData));
        // console.log("file data", formData.getAll('asset_file'));
        // console.log(formData);

        /*Add Asset*/
        var myHeaders = new Headers();
        //       myHeaders.append("Authorization", `Bearer ${token}`);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/asset`, requestOptions)
            .then((response) => {
                // console.log(response);
                // console.log(response.status);
                if (response.status == 200) {
                    this.setState({ listening: true });
                    this.setState({ isError: false, checkpoint: true });
                    this.setState({ status: 'Asset Onboarded Successfully' });

                } else {
                    this.setState({ isError: true, checkpoint: true });
                    this.setState({ status: 'Asset Onboard Failed' });
                }
                return response.json();
            })
            .then(result => {
                // console.log(result);
                // console.log(typeof (result));
                if (typeof (result) === 'object') {
                    // const jsonData = JSON.parse(raw);
                    // this.setState({ status: JSON.parse(result).message });
                    this.handleGetAsset();
                    // this.setState({asset: [...this.state.asset, { ...jsonData, asset_id: result.asset_id }] });
                    this.handleSSE(this.state.asset);
                    // console.log(JSON.parse(result).msg);
                }
                else { this.setState({ status: JSON.parse(result).message }); }
                setTimeout(() => { this.setState({ checkpoint: false}); }, 3000);
            })
            .catch(error => {
                console.log('error' + error);
                setTimeout(() => { this.setState({ checkpoint: false}); }, 3000);
            });
        document.getElementById("addAssetForm").reset();
        this.setState({ fileStatus: 'No file chosen' });
    }

    handleUpdateAsset = () => {
        this.handleShowModal('editassetModal');

        const updateAssetForm1 = document.getElementById('updateAssetForm');
        const formData = new FormData(updateAssetForm1);
        formData.append('asset_id', this.state.asset_id);
        var raw = JSON.stringify({ "asset_id": formData.get('asset_id'), "asset_group": formData.get('asset_group'), "asset_version": formData.get('asset_version') });
        // console.log(Object.fromEntries(formData));
        // console.log(raw);

        /*Update Asset */
        var myHeaders = new Headers();
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formData,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/asset`, requestOptions)
            .then((response) => {
                // console.log(response.status);
                if (response.status == 200) {
                    // console.log('response in edit asset', response);
                    this.handleGetAsset();
                    this.setState({ isError: false, checkpoint: true });      
                }
                else {
                   this.setState({ isError: true, checkpoint: true });
                }
                return response.json();
            })
            .then(result => {
                // console.log(typeof (result));
                // console.log(result);
                if (typeof (result) === 'object') {
                    this.setState({ status: result.msg });
                }
                else { this.setState({ status: JSON.parse(result).msg }); }
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            })
            .catch(error => {
                console.log('error', error);
                setTimeout(() => { this.setState({ checkpoint: false }); }, 3000);
            });
        document.getElementById("addAssetForm").reset();
    }

    handleDelete = (event) => {
        this.handleShowModal('deleteassetModal');
        // console.log(this.state.delAsset);
        this.setState({ disabledBtn: true });
        const raw = {
            asset_id: this.state.delAsset,
            delete_from_repo: false
        };
        // console.log(JSON.stringify(raw));


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(raw),
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/asset`, requestOptions)
            .then((response) => {
                this.setState({ disabledBtn: false });
                // console.log(response.status, response.statusText);
                if (response.status == 200) {
                    this.state.asset.splice(this.state.delAssetWithIndex, 1);
                   this.setState({ isError: false, checkpoint: true })
                }
                else {
                    this.setState({ status: 'There was an unknown error', isError: true, checkpoint: true })
                };
                return response.text();
            })
            .then(result => {

                // console.log(result);
                if (JSON.parse(result).msg) { this.setState({ status: JSON.parse(result).msg }); }
               setTimeout(() => { this.setState({  checkpoint: false }); }, 3000);
            })
            .catch(error => {

                console.log('error', error);
                this.setState({ disabledBtn: false });
                document.querySelector('#myDeleteConfirmationModal .close').click();
               setTimeout(() => { this.setState({  checkpoint: false }); }, 3000);
            });
    }

    handleDeleteBeforeConfirmation = (index, name) => {
        this.handleShowModal('deleteassetModal');
        this.setState({ delAsset: name, delAssetWithIndex: index });
    }

    toggleHiddenSearchBox = () => {
        this.setState({ isHiddenSearchBox: !this.state.isHiddenSearchBox });
    }

    handleSearchEvent = (event) => {
        this.setState({ searchResult: this.refs.searchKey.value });
    }

    groupBy(array, property) {
        var hash = {};
        for (var i = 0; i < array.length; i++) {
            if (!hash[array[i][property]]) hash[array[i][property]] = [];
            hash[array[i][property]].push(array[i]);
        }
        return hash;
    }

    handleEditAsset = (assetName, assetId, assetType, assetGroup, assetVersion,assetVendor) => {
        this.handleShowModal('editassetModal');
        this.setState({
            asset_name: assetName,
            asset_id: assetId,
            asset_type: assetType,
            asset_group: assetGroup,
            asset_version: assetVersion,
            asset_vendor: assetVendor,
            edit: true,
        });
    }

    handleChangeRepoType = (repotype) => {
        this.setState({ repoType1: repotype });
    }

    handleChange(field, e) {
        const { fields } = this.state;
        fields[field] = e.target.value;
        this.setState({ ...fields, fields });
        const errors = {};

        const checkDuplicate = this.state.asset.filter(task => task.asset_name.toLowerCase() == fields.asset_name.toLowerCase());
        // console.log(checkDuplicate);
        if (checkDuplicate.length > 0) {
            errors.asset_name = "asset name already exists, Do you want to update?";
            this.setState({ errors: errors });
        }
        else {
            errors.asset_name = "";
            this.setState({ errors: errors });
        }

        // Call handleRepoType based on user choice of Upload To
        if (fields.asset_repository != undefined) {
            this.handleRepoType();
        }
    }

    handleValidation() {
        const fields = this.state.fields;
        const errors = {};
        let formIsValid = true;

        // Name
        if (!fields.asset_group) {
            formIsValid = false;
            errors.asset_group = "Cannot be empty";
        }

        // invalid name
        if (typeof fields.asset_group !== "undefined") {
            if (!fields.asset_group.match(/^[A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.asset_group = "Invalid Input";
            }
            if(fields.asset_group.length < 4 ){
            formIsValid = false;
            errors.asset_group = "Minimum Length is 4";
            }
        }
        // asset_name
        if (!fields.asset_name) {
            formIsValid = false;
            errors.asset_name = "Cannot be empty";
        }
        // invalid asset name
        if (typeof fields.asset_name !== "undefined") {
            if (!fields.asset_name.match(/^[A-Za-z][A-Za-z0-9_-]*$/)) {
                formIsValid = false;
                errors.asset_name = "Invalid Input";
            }
            if(fields.asset_name.length < 4 ){
            formIsValid = false;
            errors.asset_name = "Minimum Length is 4";
            }
        }
        // asset_type
        if (!fields.asset_type) {
            formIsValid = false;
            errors.asset_type = "Cannot be empty";
        }
        // asset_vendor
        if (!fields.asset_vendor) {
            formIsValid = false;
            errors.asset_vendor = "Cannot be empty";
        }

        // invalid vendor name
        if (typeof fields.asset_vendor !== "undefined") {
            if (!fields.asset_vendor.match(/^[A-Za-z][A-Za-z0-9_-]*$/)) { 
                formIsValid = false;
                errors.asset_vendor = "Invalid Input";
            }
            if(fields.asset_vendor.length < 4 ){
                formIsValid = false;
                errors.asset_vendor = "Minimum Length is 4";}
        }
        // asset_repository
        if (!fields.asset_repository) {
            formIsValid = false;
            errors.asset_repository = "Cannot be empty";
        }
        // asset_version 
        if (!fields.asset_version) {
            formIsValid = false;
            errors.asset_version = "Cannot be empty";
        }
        // invalid asset_version
        if (typeof fields.asset_version !== "undefined") {
            if (!fields.asset_version.match(/^\d+(\.\d{1,2})?$/)) {
                formIsValid = false;
                errors.asset_version = "Only Float value";
            }
        }
        if (this.state.radioVal == 1 && this.state.fileStatus === 'No file chosen') {
            formIsValid = false;
            errors.fileStatus = "Cannot be empty";
        }
        if (this.state.radioVal == 2 && !fields.asset_path) {
            formIsValid = false;
            errors.fileStatus = "Cannot be empty";
        }
        if (this.state.radioVal == 2 && fields.asset_path) {
            const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            const formElements = document.forms.addAssetForm.elements.asset_path.value;
            if (!regexp.test(formElements)) {
                formIsValid = false;
                errors.asset_path = "Not a valid URL";
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

    handleValidationEdit = () => {
        let editFields = {
            asset_group: this.state.editFields.asset_group ? this.state.editFields.asset_group : this.state.asset_group,
            asset_vendor: this.state.editFields.asset_vendor ? this.state.editFields.asset_vendor : this.state.asset_vendor,
            asset_version: this.state.editFields.asset_version ? this.state.editFields.asset_version : this.state.asset_version
        }
        const editErrors = {};
        let formIsValid = true;
        // console.log('editFields inside Validation', editFields);

        // Asset Group name
        if (!editFields.asset_group) {
            formIsValid = false;
            editErrors.asset_group = "Cannot be empty";
        }

        // invalid Asset Group name
        if (typeof editFields.asset_group !== "undefined") {
            if (!editFields.asset_group.match(/^[A-Za-z0-9_-]/)) {
                formIsValid = false;
                editErrors.asset_group = "Only letters";
            }
            if(editFields.asset_group.length < 4 ){
                formIsValid = false;
                editErrors.asset_group = "Minimum Length is 4";}
        }

        //asset_version 
        if (!editFields.asset_version) {
            formIsValid = false;
            editErrors.asset_version = "Cannot be empty";
        }
        // invalid asset_version
        if (typeof editFields.asset_version !== "undefined") {
            if (!editFields.asset_version.match(/^\d+(\.\d{1,2})?$/)) {
                formIsValid = false;
                editErrors.asset_version = "Only float";
            }
        }
        this.setState({ editErrors: editErrors });
        return formIsValid;
    }

    contactSubmit = (e) => {
        e.preventDefault();
        if (this.handleValidation()) {
            this.handleAddAsset();
        }
    }

    contactSubmit1 = (e) => {
        e.preventDefault();
        if (this.handleValidationEdit()) {
            this.handleUpdateAsset();
        } 
    }

    handleRadio = (event) => {
        // console.log('value:' + event.target.value);
        this.setState({ radioVal: event.target.value });
        if (event.target.value == 1) {
            this.setState({ lableChange: 'Upload to' })
        }
        else {
            this.setState({ lableChange: 'Upload from' })
        }

    }

    handleFileUpload = () => {
        this.setState({ fileStatus: document.getElementById('asset_file').files[0].name });
        const errors = {};
        this.setState({ errors });
    }

    render() {
        // console.log('repo' + this.state.repo);
        // console.log('asset', this.state.asset);
        // Style for modal
        const showModalStyle = {
            display: 'block'
        };
        const hideModalStyle = {
            display: 'none'
        };

        // Get asset type for new form
        var obj = {};
        for (var i = 0, len = this.state.asset.length; i < len; i++) {
            var currElement = this.state.asset[i];
            obj[currElement.asset_type] = currElement.asset_type;
        }
        const assetType = Object.keys(obj);
        // Get asset type for new form
        // Count Vendor Length
        var obj1 = {};

        for (var i = 0, len = this.state.asset.length; i < len; i++)
            obj1[this.state.asset[i].asset_vendor] = this.state.asset[i];

        const asset1 = new Array();
        for (var key in obj1)
            asset1.push(obj1[key]);

        /*Display Asset Details in the Table */
        let Asset = '';
        let resultingAsset = [];
        if (this.state.asset.length > 0) {
            resultingAsset = this.state.asset.filter(asset => asset.asset_name.toLowerCase().indexOf(this.state.searchResult.toLowerCase()) != -1);
        }


        if (this.state.asset.length > 0) {
            Asset = this.state.asset.map((value, index) => {
                return (
                    <tr key={index}>
                        <td>{value.asset_name}</td>
                        <td>{value.asset_group}</td>
                        <td>{value.asset_type}</td>
                        <td>{value.asset_vendor}</td>
                        <td>{value.asset_repository}</td>
                        <td>{value.asset_size}</td>
                        <td>{value.asset_version}</td>
                        <td align="center"><div className={(value.scan_result ? (value.scan_result == 'Safe' ? "dev-net-status done" : "dev-net-status fail") : "dev-net-status wip")}>&nbsp;</div></td>
                        <td>{value.onboard_status}</td>
                        <td class="text-center">
                            <div class="dev-actions">
                                <a href="javascript:void(0)" data-toggle="modal" data-target="#myUpdateAssetModal" onClick={() => this.handleEditAsset(value.asset_name, value.asset_id, value.asset_type, value.asset_group, value.asset_version, value.asset_vendor)}><img src={require("images/edit.svg")} alt="Edit" /></a>
                                <a href="javascript:void(0)" data-target="#myDeleteConfirmationModal" data-toggle="modal" onClick={() => this.handleDeleteBeforeConfirmation(index, value.asset_id)} ><img src={require("images/delete.svg")} alt="Delete" /></a>
                            </div>
                        </td>
                    </tr>);
            });

        }
        else if (this.state.asset.length == 0) { Asset = <tr><td className="text-center text-primary" colSpan="8">{this.state.response}</td></tr>; }
        else Asset = <tr><td className="text-center text-primary" colSpan="8">No Data To Display</td></tr>;
        /* Add Asset Modal Body */
        const addAssetModal = <form className="modalbody" id='addAssetForm' onSubmit={this.contactSubmit.bind(this)}>
            <div className="row">
                <div className="col-12 dev-templates">
                    <div className="form-group">
                        <label className="myw-checkbox myw-radio myw-inline">
                            <input type="radio" name="dev-asset-rd" value="1" onClick={(e) => this.handleRadio(e)} defaultChecked />
                            <span>New</span>
                        </label>
                        <label className="myw-checkbox myw-radio myw-inline">
                            <input type="radio" name="dev-asset-rd" value="2" onClick={(e) => this.handleRadio(e)} />
                            <span>Existing</span>
                        </label>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Name<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_name" className="form-control" placeholder="Enter Name" onChange={this.handleChange.bind(this, "asset_name")} maxLength="24" />
                        <span style={{ color: "red" }}>{this.state.errors.asset_name}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Asset Group<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_group" className="form-control" placeholder="Enter Asset Group" onChange={this.handleChange.bind(this, "asset_group")} maxLength="24" />
                        <span style={{ color: "red" }}>{this.state.errors.asset_group}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Type<span style={{ color: "red" }}>*</span></label>
                        <select name="asset_type" className="asset_type form-control" onChange={this.handleChange.bind(this, "asset_type")}>
                            <option>Select Type</option>
                            <option value="key files">Key files</option>
                            <option value="template">Cloudformation Template</option>
                            <option value="terraform">Terraform Template</option>
                        </select>
                        <span style={{ color: "red" }}>{this.state.errors.asset_type}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Vendor<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_vendor" className="form-control" placeholder="Enter Vendor" onChange={this.handleChange.bind(this, "asset_vendor")} maxLength="24" />
                        <span style={{ color: "red" }}>{this.state.errors.asset_vendor}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">{this.state.lableChange}<span style={{ color: "red" }}>*</span></label>
                        <select name="asset_repository" className="form-control" onChange={this.handleChange.bind(this, "asset_repository")}>
                            <option selected>Select Repository</option>
                            {this.state.repo.length > 0 && this.state.repo.map(item => {
                                return (<option key={item} directory={item.repo_name} data-type={item.repo_type}>{item.repo_name}</option>);
                            })}
                        </select>
                        <span style={{ color: "red" }}>{this.state.errors.asset_repository}</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Version<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_version"
                            className="form-control" placeholder="Enter Version" onChange={this.handleChange.bind(this, "asset_version")} />
                        <span style={{ color: "red" }}>{this.state.errors.asset_version}</span>
                    </div>
                </div>

                {this.state.radioVal == 1 && <div className={`col-6 devnet-upload ${this.state.radioVal == '1' ? "" : "d-none"}`}>

                    <div className="form-group">
                        <label className="form-label">Upload file<span style={{ color: "red" }}>*</span></label>
                        <div className="myw-upload-browse d-flex align-items-center">
                            <label className="btn btn-secondary">
                                <span>Browse</span>
                                <input id="asset_file" type="file" onChange={this.handleFileUpload}></input>
                            </label>
                            <span className="ml-2 text-secondary">{this.state.fileStatus}</span><br></br>
                        </div>
                        <span style={{ color: "red" }}>{this.state.errors.fileStatus}</span>
                    </div>
                </div>}
                {this.state.radioVal == 2 && <div className={`col-6 devnet-url ${this.state.radioVal == '2' ? "" : "d-none"}`}>
                    <div className="form-group">
                        <label className="form-label">URL<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_path" className="form-control" placeholder="Enter URL"
                        onChange={this.handleChange.bind(this, "asset_path")} />
                        <span style={{ color: "red" }}>{this.state.errors.asset_path}</span>
                    </div>
                </div>}
            </div>
        </form>;

        /* Update Asset Modal Body */
        const updateAssetModal = <form className="modalbody" id='updateAssetForm' onSubmit={this.contactSubmit1.bind(this)}>
            <div className="row">
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Name<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_name" value={this.state.asset_name} className="form-control" placeholder="Enter Name" maxLength="24" readOnly />
                        <br />
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Asset Group<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_group" className="form-control" value={this.state.asset_group} placeholder="Enter Asset Group" onChange={this.handleChangeEdit.bind(this, "asset_group")} maxLength="24" />
                        <span style={{ color: "red" }}>{this.state.editErrors.asset_group}</span>
                        <br />
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Type<span style={{ color: "red" }}>*</span></label>
                        <select name="asset_type" className="asset_type form-control" disabled>
                            <option selected disabled>{this.state.asset_type}</option>
                        </select>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Vendor<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_vendor" value={this.state.asset_vendor} className="form-control" placeholder="Enter Vendor" onChange={this.handleChangeEdit.bind(this, "asset_vendor")} maxLength="24"  readOnly />
                        <span style={{ color: "red" }}>{this.state.editErrors.asset_vendor}</span>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="form-label">Version<span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="asset_version" value={this.state.asset_version}
                            className="form-control" placeholder="Enter Version" onChange={this.handleChangeEdit.bind(this, "asset_version")} />
                        <span style={{ color: "red" }}>{this.state.editErrors.asset_version}</span>
                    </div>
                </div>
                <div className="col-6 devnet-url d-none">
                    <div className="form-group">
                        <label className="form-label">URL<span style={{ color: "red" }}>*</span></label>
                        <input type="text" id="remoteRepoFile" name="asset_path" className="form-control" placeholder="Enter URL" onChange={this.handleChange.bind(this, "asset_path")} />
                        <span style={{ color: "red" }}>{this.state.editErrors.asset_path}</span>
                    </div>
                </div>
            </div>
        </form>;

        return (
            <>
                {/* <!-- content --> */}
                <div className="col dev-AI-infused-container">
                    <div className="myw-container py-4 ">
                        <div className="d-flex align-items-center">
                            <div className="dev-page-title">Asset</div>
                            <div className="ml-auto dev-actions">

                                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#addassetModal" onClick={() => { this.handleShowModal('addassetModal'); }}><img src={require("images/add.svg")} alt="Add" /> <span>Add</span></button>
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
                                            <th scope="col">Group</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Vendor</th>
                                            <th scope="col">Repository</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Version</th>
                                            <th scope="col" className="text-center">Security Scan</th>
                                            <th scope="col">Status</th>
                                            <th scope="col" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Asset}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        {/* My Add Asset */}
                        <div className="modal" id="addassetModal" tabIndex="-1" role="dialog" aria-labelledby="addassetModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="addassetModaltitle">Add Asset</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('addassetModal'); }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {addAssetModal}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('addassetModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={this.contactSubmit.bind(this)}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* My Update Asset */}
                        <div className="modal" id="updateassetModal" tabIndex="-1" role="dialog" aria-labelledby="updateassetModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal ? showModalStyle : hideModalStyle}>
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="updateassetModaltitle">Edit Asset</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('editassetModal'); }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {updateAssetModal}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('editassetModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={this.contactSubmit1}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* /*My Delete Popup Modal*/}
                        <div className="modal" id="deleteassetModal" tabIndex="-1" role="dialog" aria-labelledby="deleteassetModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal ? showModalStyle : hideModalStyle} >
                            <div className="modal-backdrop show"></div>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deleteassetModaltitle">Delete Confirmation</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.handleShowModal('deleteassetModal'); }}>
                                            <span aria-hidden="true">&nbsp;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Do you want to delete Asset?
                                                </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.handleShowModal('deleteassetModal'); }}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={(event) => this.handleDelete(event)} disabled={this.state.disabledBtn}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* /*My Delete Popup Modal*/}

                    </div>
                </div>
                {/* <!-- /content --> */}
            </>
        );
    }
    }

export default Asset;
