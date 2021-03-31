import React from 'react';

class Infra extends React.Component{

    constructor(props){
        super(props);
        this.state={
            status:'',
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
            environment: '',
            orchestrator: '',
            password: '',
            url: '',
            next: false,
            previous: false,
            searchResult:'',
            response: '',
            conditionCloud: '',
            showAddModal:false,
            showEditModal:false,
            showDelModal:false,
            orcurl: '',
            orcusername: '',
            orcpassword: '',
            conditionOrchestrator: '',
        };
        this.handleCloud = this.handleCloud.bind(this);
        this.handleOrchestrator = this.handleOrchestrator.bind(this);
        
    }

    handleNext = () => {
        this.setState({next:true});
    }

    handleCloud = () => {
        this.setState({conditionCloud: this.refs.cloudType.value});
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
        if(modalId === 'addinfraModal')this.setState({showAddModal:!this.state.showAddModal})
        if(modalId === 'editinfraModal')this.setState({showEditModal:!this.state.showEditModal})
        if(modalId === 'deleteinfraModal')this.setState({showDelModal:!this.state.showDelModal})   
    }

    componentDidMount = () => {
        //  require('dotenv').config();    
        let API_URL = process.env.REACT_APP_ONBOARDING;
        console.log(process.env);
        let token = sessionStorage.getItem('tokenStorage');

        let myHeaders = new Headers();
        //          myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Access-Control-Allow-Origin', 'http:// localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            // redirect: 'follow'
        };
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then(response =>
            {console.log(response.status);
                console.log(typeof(response));
                console.log(response);
                if(response.status != 200){this.setState({response: (`${response.status  }  ${  response.statusText}`)});};
                return response.json();
            })
            .then((findresponse)=>{
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                if(findresponse.msg){
                    this.setState({response:findresponse.msg});
                }else{
                    this.setState({infra:findresponse});
                }
            })
            .catch(error => {
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                console.log('error', error);
            });

    }

    handleAddInfra = () => {
        //  require('dotenv').config();    
        let API_URL = process.env.REACT_APP_ONBOARDING;
        let token = sessionStorage.getItem('tokenStorage');
        let addInfraForm1 = document.getElementById('addInfraForm');
        let formData = new FormData(addInfraForm1);
        formData.append('action', 'create');
        var raw = JSON.stringify(Object.fromEntries(formData));
        console.log(formData);
        console.log(raw);
        console.log([...this.state.infra, JSON.parse(raw)]);

        /*Add Infra*/
        var myHeaders = new Headers();
        //        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then((response) => {
                console.log(response);
                console.log(response.status);
                if(response.status == 200){
                    var duplicateIndex = '';
                    const checkDuplicate = this.state.infra.filter((task,index) => {
                        if(task.infra_name == formData.get('infra_name')){
                            duplicateIndex = index;
                            return true;
                        }
                    });
                    if(checkDuplicate !== '')this.state.infra.splice(duplicateIndex, 1);
                    this.setState({msgClass:'successMessage',infra: [...this.state.infra, JSON.parse(raw)]});
                }
                else{ 
                    this.setState({status:'There was an unknown error',msgClass:'errorMessage'});
                }
                return response.json();
            })
            .then(result => {
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                if(result.msg){this.setState({status:result.msg});}
                setTimeout(() => {this.setState({status:'', msgClass:''});}, 3000);
            })
            .catch(error => {
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                console.log(`error${ error}`);
                setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
            });
        document.getElementById("addInfraForm").reset();
        
    }

    handleUpdateInfra = () => {
        this.handleShowModal('editinfraModal')
        //  require('dotenv').config();    
        // let API_URL = process.env.REACT_APP_ONBOARDING;
        // let token = sessionStorage.getItem('tokenStorage');
        let updateInfraForm1 = document.getElementById('updateInfraForm');
        let formData = new FormData(updateInfraForm1);
        formData.append('action', 'modify');
        var raw = JSON.stringify(Object.fromEntries(formData));
        console.log(formData);
        console.log(raw);
        console.log([...this.state.infra, JSON.parse(raw)]);

        /*Update Infra*/
        var myHeaders = new Headers();
        //        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then((response) => {
                console.log(response);
                console.log(response.status);
                if(response.status == 200){
                    var duplicateIndex = '';
                    const checkDuplicate = this.state.infra.filter((task,index) => {
                        if(task.infra_name == formData.get('infra_name')){
                            duplicateIndex = index;
                            return true;
                        }
                    });
                    if(checkDuplicate !== '')this.state.infra.splice(duplicateIndex, 1);
                    this.setState({msgClass:'successMessage',infra: [...this.state.infra, JSON.parse(raw)]});
                }
                else{ 
                    this.setState({status:'There was an unknown error',msgClass:'errorMessage'});
                }
                return response.json();
            })
            .then(result => {
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                if(result.msg){this.setState({status:result.msg});}
                setTimeout(() => {this.setState({status:'', msgClass:''});}, 3000);
            })
            .catch(error => {
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                console.log(`error${ error}`);
                setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
            });
        document.getElementById("updateInfraForm").reset();
      
    }

    hadleDelete = (event) => {
        this.handleShowModal('deleteinfraModal')
        this.setState({disabledBtn:true});
        console.log(this.state.delInfraName);
        // let raw = '{"infra_name" : "' + this.state.delInfraName + '"}';
        let raw={
            infra_name : this.state.delInfraName,
        };
        console.log(raw);
        const updatedArray = this.state.infra.filter(task => task.infra_name !== this.state.delInfraName);
        console.log("updated Array",updatedArray);
        //  require('dotenv').config();    
        // let API_URL = process.env.REACT_APP_ONBOARDING;
        // console.log(process.env);
        // let token = sessionStorage.getItem('tokenStorage');
        var myHeaders = new Headers();
        //  myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
      
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(raw),
            // redirect: 'follow'
        };
        if(document.getElementById('loader')){document.getElementById('loader').style.display = "block";}
        fetch(`###REACT_APP_PLATFORM_URL###/onboard/infra`, requestOptions)
            .then((response) => {
                console.log(response)
                this.setState({disabledBtn:false});
                // document.querySelector('#myDeleteConfirmationModal .close').click();
                console.log(response.status);
                (response.status == 200) ? this.setState({infra:updatedArray}) : this.setState({msgClass:'errorMessage',status:'There was an unknown error'});     
                return response.text();
            })
            .then(result => {
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                console.log(result);
                if(JSON.parse(result).msg){this.setState({status:JSON.parse(result).msg});}
                setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
            })
            .catch(error => {
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                console.log('error', error);
                this.setState({disabledBtn:false});
                document.querySelector('#myDeleteConfirmationModal .close').click();
                setTimeout(() => {this.setState({status:'',msgClass:''});}, 3000);
            });
    } 

    hadleDeleteBeforeConfirmation = (name) => {
        this.handleShowModal('deleteinfraModal')
        this.setState({delInfraName: name});
    } 

    contactSubmit = (e) => {
        console.log('inside contactSubmit');
        e.preventDefault();
        if(this.handleValidation()){
            // document.querySelector('#myAddInfraModal .close').click();
            this.handleShowModal('addinfraModal')
            this.handleAddInfra();
        }else{
            alert("Form has errors.");
        }
    }

    contactSubmit1 = (e) => {
        console.log('inside contactSubmit1');
        e.preventDefault();
        if(this.handleValidation1()){
            // document.querySelector('#myAddInfraModal .close').click();
            this.handleShowModal('editinfraModal')
            this.handleUpdateInfra();
        }else{
            alert("Form has errors.");
        }
    }

    toggleHiddenSearchBox = () => {
        this.setState({isHiddenSearchBox: !this.state.isHiddenSearchBox});
    }

    handleSearchEvent = (event) => {
        this.setState({searchResult:this.refs.searchKey.value});
    }

    handleEditInfra = (infraName,infraCloud,infraEnvironment,infraOrchestrator) => {
        this.handleShowModal('editinfraModal')
        this.setState({
            infraName:infraName,
            infraCloud:infraCloud,
            infraEnvironment:infraEnvironment,
            infraOrchestrator:infraOrchestrator,
            conditionCloud1:infraCloud,
            conditionOrchestrator1:infraOrchestrator,
            edit:true,
        });
    }

    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
      
        // Name
        if(!fields["infra_name"]){
            formIsValid = false;
            errors["infra_name"] = "Cannot be empty";
        }

        // invalid name
        if(typeof fields.infra_name !== "undefined"){
            if(!fields.infra_name.match(/^[A-Za-z0-9_-]/)){
                formIsValid = false;
                errors.infra_name = "Only letters";
            }        
        }
        // cloud_type
        if(!fields["cloud_type"]){
            formIsValid = false;
            errors["cloud_type"] = "Cannot be empty";
        }
        //  environment
        if(!fields["environment"]){
            formIsValid = false;
            errors["environment"] = "Cannot be empty";
        }
        // orchestrator
        if(!fields["orchestrator"]){
            formIsValid = false;
            errors["orchestrator"] = "Cannot be empty";
        }

        if(fields["cloud_type"] == 'AWS'){
            // Access Key
            if(!fields["access_key"]){
                formIsValid = false;
                errors["access_key"] = "Cannot be empty";
            }
            //  Secret Key
            if(!fields["secret_key"]){
                formIsValid = false;
                errors["secret_key"] = "Cannot be empty";
            }
        }
        if(fields["cloud_type"] == 'Openstack'){
            // RcFile
            if(!fields["RcFile"]){
                formIsValid = false;
                errors["RcFile"] = "Cannot be empty";
            }
            // URL
            if(!fields["orchestrator_url"]){
                let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                if(fields["orchestrator_url"]){var formElements = document.forms['addInfraForm'].elements['orchestrator_url'].value;
                    if (!regexp.test(formElements)){
                        formIsValid = false;
                        errors["orchestrator_url"] = "Not a valid URL";
                    }}}
            // orchestrator_username
            if(!fields["orchestrator_username"]){
                formIsValid = false;
                errors["orchestrator_username"] = "Cannot be empty";
            }
            // orchestrator_password
            if(!fields["orchestrator_password"]){
                formIsValid = false;
                errors["orchestrator_password"] = "Cannot be empty";
            }
        }
      
        this.setState({errors: errors});
        return formIsValid;
    }

    handleValidation1(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
      
        // Name
        if(!fields["infra_name"]){
            formIsValid = false;
            errors["infra_name"] = "Cannot be empty";
        }

        // invalid name
        if(typeof fields.infra_name !== "undefined"){
            if(!fields.infra_name.match(/^[A-Za-z0-9_-]/)){
                formIsValid = false;
                errors.infra_name = "Only letters";
            }        
        }
        // cloud_type
        if(!fields["cloud_type"]){
            formIsValid = false;
            errors["cloud_type"] = "Cannot be empty";
        }
        //  environment
        if(!fields["environment"]){
            formIsValid = false;
            errors["environment"] = "Cannot be empty";
        }
        // orchestrator
        if(!fields["orchestrator"]){
            formIsValid = false;
            errors["orchestrator"] = "Cannot be empty";
        }
        // Access Key
        if(!fields["access_key"]){
            formIsValid = false;
            errors["access_key"] = "Cannot be empty";
        }
        //  Secret Key
        if(!fields["secret_key"]){
            formIsValid = false;
            errors["secret_key"] = "Cannot be empty";
        }

        if(fields["cloud_type"] == 'AWS'){
            // Access Key
            if(!fields["access_key"]){
                formIsValid = false;
                errors["access_key"] = "Cannot be empty";
            }
            //  Secret Key
            if(!fields["secret_key"]){
                formIsValid = false;
                errors["secret_key"] = "Cannot be empty";
            }
        }
        if(fields["cloud_type"] == 'Openstack'){
            // RcFile
            if(!fields["RcFile"]){
                formIsValid = false;
                errors["RcFile"] = "Cannot be empty";
            }
            // URL
            if(!fields["orchestrator_url"]){
                let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                if(fields["orchestrator_url"]){var formElements = document.forms['addInfraForm'].elements['orchestrator_url'].value;
                    if (!regexp.test(formElements)){
                        formIsValid = false;
                        errors["orchestrator_url"] = "Not a valid URL";
                    }}}
            // orchestrator_username
            if(!fields["orchestrator_username"]){
                formIsValid = false;
                errors["orchestrator_username"] = "Cannot be empty";
            }
            // orchestrator_password
            if(!fields["orchestrator_password"]){
                formIsValid = false;
                errors["orchestrator_password"] = "Cannot be empty";
            }
        }
      
        this.setState({errors: errors});
        return formIsValid;
    }

    handleChange(field, e){        
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
        let errors = {};

        //  Call handleCloud based on user choice of cloud_type
        if(fields["cloud_type"] != undefined){
            this.handleCloud();
        }
        //  Call handleDictionary based on user choice of orchestrator
        if(fields["orchestrator"] != undefined){
            this.handleOrchestrator();
        }

        const checkDuplicate = this.state.infra.filter(task => task.infra_name == fields["infra_name"]);
        console.log(checkDuplicate);
        if(checkDuplicate.length>0){
            errors["infra_name"] = "Infra name already exists, Do you want to update?";
            this.setState({errors: errors});
        }
        else{
            errors["infra_name"] = "";
            this.setState({errors: errors});
        }
    }
    
    render(){         
        // Style for modal
        let showModalStyle={
            display:'block'
        }
        let hideModalStyle={
            display:'none'
        }
        /*Display Infra Details in the Table*/
        let infra = '';
        let resultingInfra = []; 
        console.log(this.state.infra);
        if(this.state.infra.length >= 1) 
        {
            infra = this.state.infra.map((value,index) => {
                return <tr className="" key={index}>
                    <td>{value.infra_name}</td>
                    <td>{value.cloud_type}</td>
                    <td>{value.environment}</td>
                    <td>{value.orchestrator}</td>
                    <td class="text-center">
                        <div class="dev-actions">
                                <a href="javascript:void(0)" data-toggle="modal" data-target="#myUpdateInfraModal" onClick={() => this.handleEditInfra(value.infra_name,value.cloud_type,value.environment,value.orchestrator)}><img src={require("images/edit.svg")} alt="Edit"/></a>
                                <a href="javascript:void(0)" data-toggle="modal" data-target="#myDeleteConfirmationModal" onClick={() => this.hadleDeleteBeforeConfirmation(value.infra_name)} ><img src={require("images/delete-icon.svg")} alt="Delete"/></a>
                        </div>
                    </td>
                </tr>
            });
        }
        else if(this.state.infra.length == 0){infra = <tr><td className="text-center text-primary" colSpan="5">{this.state.response}</td></tr>;}
        else { infra = <tr><td className="text-center text-primary" colSpan="5">No Data To Display</td></tr>;}  
      
        /* Display Infra Details in the Table */
        /* Add Infra Modal Body */
        let addInfraModal = <form className="modalbody" id='addInfraForm' onSubmit= {this.contactSubmit.bind(this)}> 
            <div>
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="infra_name" onChange={this.handleChange.bind(this, "infra_name")} placeholder="Enter Name"/>             
                <span style={{color: "red"}}>{this.state.errors["infra_name"]}</span>
                <br/> 

                <label className="form-label">Cloud</label>
                <select ref="cloudType" name="cloud_type" onChange={this.handleChange.bind(this, "cloud_type")} className="form-control">
                    <option selected disabled>Select Cloud</option>
                    <option>AWS</option>
                    <option>Openstack</option>
                </select>
                <span style={{color: "red"}}>{this.state.errors["cloud_type"]}</span>
                <br/>

                {this.state.conditionCloud == 'AWS' && <> <label className="form-label">Access Key</label>
                <input type="password" className="form-control" name="access_key" onChange={this.handleChange.bind(this,"access_key")} placeholder="Enter Access Key"/>
            <span style={{color: "red"}}>{this.state.errors["access_key"]}</span>
            <br/> 

            <label className="form-label">Secret Key</label>
            <input type="password" className="form-control"  name="secret_key" onChange={this.handleChange.bind(this, "secret_key")} placeholder="Enter Secret Key"/>
            <span style={{color: "red"}}>{this.state.errors["secret_key"]}</span>
            <br/> </>} 
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
                <label className="form-label">Environment</label>
                <select ref="infraName" name="environment"  onChange={this.handleChange.bind(this, "environment")} className="form-control">
                    <option selected disabled>Select Environment</option>
                    <option>Demo</option>
                    <option>Test</option>
                    <option>Dev</option>
                    <option>Stage</option>
                    <option>Production</option>
                </select>
                <span style={{color: "red"}}>{this.state.errors["environment"]}</span>
                <br/>  
                { this.state.conditionCloud == 'AWS' &&
              <><label className="form-label">Orchestrator</label>
              <select  ref="orchestrator" name="orchestrator" onChange={this.handleChange.bind(this, "orchestrator")} className="form-control">
                  <option selected disabled>Select Orchestrator</option>
                  <option>Cloudformation</option>
              </select>
              <span style={{color: "red"}}>{this.state.errors["orchestrator"]}</span>
              <br/>
               </>
                }
                { this.state.conditionCloud == 'Openstack' &&
        <><label className="w-25 px-3" htmlFor="email">Orchestrator :</label>
            <select ref="orchestrator" name="orchestrator" onChange={this.handleChange.bind(this, "orchestrator")} className="input-group-text my-2 w-50">
                <option selected disabled>Select Orchestrator</option>
                <option>OSM</option>
                <option>Cloudify</option>
            </select>
            <span style={{color: "red"}}>{this.state.errors["orchestrator"]}</span>
            <br/> </>}
          
            </div>
        </form>;
        /* Add Infra Modal Body */

        /* Update Infra Modal Body */
        let updateInfraModal = <form className="modalbody" id='updateInfraForm' onSubmit= {this.contactSubmit.bind(this)}> 
            <div>             
                <label className="form-label" htmlFor="email">Name </label>
                <input type="text" className="form-control"  name="infra_name" value={this.state.infraName} onChange={this.handleChange.bind(this, "infra_name")}/>

                <br/> 
                <label className="form-label" htmlFor="email">Cloud </label>
                <select name="cloud_type" className="form-control">
                    <option selected>{this.state.infraCloud}</option>
                </select>

                <br/>
                { this.state.conditionCloud1 == 'AWS' &&
                <><label className="form-label" htmlFor="email">Access Key </label>
                <input type="password" className="form-control"  name="access_key" onChange={this.handleChange.bind(this, "access_key")}/>

            <span style={{color: "red"}}>{this.state.errors["access_key"]}</span>
            <br/> 
        <label className="form-label" htmlFor="email">Secret Key</label>
        <input type="password" className="form-control"  name="secret_key" onChange={this.handleChange.bind(this, "secret_key")} />

            <span style={{color: "red"}}>{this.state.errors["secret_key"]}</span>
            <br/></> 
                }
                { this.state.conditionCloud1 == 'Openstack' &&
        <><label className="w-25 px-3" htmlFor="email">Rcfile </label>
        <input type="text" className="form-control"multiline
            name="RcFile" rows="4"
            cols="30" />

            <span style={{color: "red"}}>{this.state.errors["RcFile"]}</span>
            <br/> 
        </>
                }
                <label className="form-label" htmlFor="email">Environment </label>
                <select name="environment"  className="form-control" onChange={this.handleChange.bind(this, "environment")}>
                    <option selected disabled>Select Environment</option>
                    <option>Demo</option>
                    <option>Test</option>
                    <option>Dev</option>
                    <option>Stage</option>
                    <option>Production</option>
                     
                </select>
                <span style={{color: "red"}}>{this.state.errors["environment"]}</span>
                <br/>  
                { this.state.conditionCloud1 == 'AWS' &&
          <><label className="form-label" htmlFor="email">Orchestrator </label>
          <select ref="orchestrator" name="orchestrator" className="form-control"  onChange={this.handleChange.bind(this, "orchestrator")} >
              <option selected>{this.state.infraOrchestrator}</option>
             
          </select>
          <br/>
           </>
                }
                { this.state.conditionCloud1 == 'Openstack' &&
            <><label className="form-label" htmlFor="email">Orchestrator </label>
        <select name="orchestrator" className="form-control">
            <option selected disabled>Select Orchestrator</option>
            <option>OSM</option>
            <option>Cloudify</option>
        </select>

        <br/> </>}
      
                {((this.state.conditionOrchestrator1 == 'OSM' || this.state.conditionOrchestrator == 'Cloudify') && this.state.conditionCloud == 'Openstack') &&
        <><label className="w-25 px-3" htmlFor="email">Url :</label>
        <input type="text" className="form-control"  name="orchestrator_url" onChange={this.handleChange.bind(this, "orchestrator_url")}/>

          <span style={{color: "red"}}>{this.state.errors["orchestrator_url"]}</span>
          <br/>
      <label className="w-25 px-3" htmlFor="email">User Name :</label>
      <input type="text" className="form-control" name="orchestrator_username" onChange={this.handleChange.bind(this, "orchestrator_username")}/>

          <span style={{color: "red"}}>{this.state.errors["orchestrator_username"]}</span>
          <br/>
       <label className="w-25 px-3" htmlFor="email">Password :</label>
       <input type="password" className="form-control"  name="orchestrator_password" onChange={this.handleChange.bind(this, "orchestrator_username")}/>

          <span style={{color: "red"}}>{this.state.errors["orchestrator_password"]}</span>
          <br/> </>
                }
      
            </div>
        </form>;
        /*Update Infra Modal Body*/

        return(
                <>
                {/* <!-- content --> */}
               
                    <div className="col dev-AI-infused-container">
                        <div className="myw-container py-4 ">
                            <div className="d-flex align-items-center">
                                <div className="dev-page-title">Infrastructure</div>
                                <div className="ml-auto dev-actions">
                                    <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#addinfraModal" onClick={() => {this.handleShowModal('addinfraModal')}}><img src={require("images/add.svg")} alt="Add"/> <span>Add</span></button>
                                </div>
                            </div>
                            <div className="dev-section my-4">
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
                <div className="modal" id="addinfraModal" tabIndex="-1" role="dialog" aria-labelledby="addinfraModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showAddModal?showModalStyle:hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addinfraModaltitle">Add Infrastructure</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {this.handleShowModal('addinfraModal')}}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {addInfraModal}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {this.handleShowModal('addinfraModal')}}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick= {this.contactSubmit.bind(this)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* addinframodal */}
                {/* editinframodal */}
                <div className="modal" id="editinfraModal" tabIndex="-1" role="dialog" aria-labelledby="editinfraModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showEditModal?showModalStyle:hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editinfraModaltitle">Edit Infrastructure</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {this.handleShowModal('editinfraModal')}}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {updateInfraModal}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {this.handleShowModal('editinfraModal')}}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick= {this.handleUpdateInfra}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* editinframodal */}
                {/* deleteinframodal */}
                <div className="modal" id="deleteinfraModal" tabIndex="-1" role="dialog" aria-labelledby="deleteinfraModaltitle" aria-hidden="true" data-backdrop="static" style={this.state.showDelModal?showModalStyle:hideModalStyle} >
                    <div className="modal-backdrop show"></div>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteinfraModaltitle">Delete Infrastructure</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {this.handleShowModal('deleteinfraModal')}}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {this.handleShowModal('deleteinfraModal')}}>Cancel</button>
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