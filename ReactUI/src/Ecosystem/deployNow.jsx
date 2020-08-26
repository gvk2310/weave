import React from 'react'
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router-dom';

class DeployNowPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      environment: ['dev','test','production','stage','demo'],
      infraList: ['aws','Acc-DevOps','Test-DevOps','5G-Dev','5G-Test','IMS-Client','IMS-Demo','Versa-SDWAN-Dev','Versa-SDWAN-Test'],
      CFTemplate: ['Comcast-CF-template','Telefonica-CF-template'],
      ConfigCloud: ['Comcast-config','Telefonica-config'],
      VNFListOSM: ['Openstack1','Openstack2'],
      Config: ['Director-config','Controller-config','Control-config','Branch-config'],

      VNFDList: ['Director-vnfd','Controller-vnfd','Control-vnfd','Branch-vnfd'],
        NSDAsset: ['Director-nsd','Controller-nsd','Control-nsd','Branch-nsd'],
        nameList: ['IMS-V4-T1','Versa-SDWAN','Versa-SDWAN-OSM'],
      changeOrchestrator: '',
    }
    console.log('inside deployment')
  }

  handleChangeOrchestrator = () => {
    this.setState({changeOrchestrator: this.refs.depOrchestrator.value})
  }
  handleSubmitButton = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;        
    this.setState({fields});
    if(fields["file_input"] == null || fields["Url"] == null){
      this.setState({showBtn:false});
    }
    else{this.setState({showBtn:true});}
  }
  handleChangeToSection1 = () => {
    this.setState({section1:true, section2:false, section3:false})
  }
  handleChangeToSection2 = () => {
    this.setState({section1:false, section2:true, section3:false})
  }
  handleChangeToSection3 = () => {
    this.setState({section1:false, section2:true, section3:false})
  }

render(){
return(
<MuiThemeProvider>
<div className="container-fluid col-lg-8 mainContent pl-5">
<form id="addDeployNowForm">      
                <label className="w-25 px-3" htmlFor="email">Name :</label>
                <TextField
                    type="text"
                    name="name"
                /><br/> 

                <label className="w-25 px-3" htmlFor="email">Environment :</label>
                <select name="environment" className="input-group-text my-2 w-50">
                              {this.state.environment.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 

                <label className="w-25 px-3" htmlFor="email">Infra :</label>
                <select name="infra" className="input-group-text my-2 w-50">
                  {this.state.infraList.map(item => {   
                        return (<option value={item} key={item} directory={item}>{item}</option>);
                      })}
                </select><br/>

                <label className="w-25 px-3" htmlFor="email">Orchestrator :</label>
                <select ref="depOrchestrator" name="orchestrator" onChange={this.handleChangeOrchestrator} className="input-group-text my-2 w-50">
                        <option value="Select Orchestrator">Select Orchestrator</option>
                        <option value="CloudFormation">CloudFormation</option>
                        <option value="OSM">OSM</option>
                  </select><br/>  

                  {/* if orchestrator value = CloudFormation */}
                  {this.state.changeOrchestrator == 'CloudFormation' &&
                  <>
                  <label className="w-25 px-3" htmlFor="email">CF template :</label>
                  <select name="depCftemp" className="input-group-text my-2 w-50">
                              {this.state.CFTemplate.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 
                  <label className="w-25 px-3" htmlFor="type">Type :</label>
                  <TextField
                    type="text"
                    name="type"
                    /><br/> 
                  <label className="w-25 px-3" htmlFor="director_ip">Director IP :</label>
                  <TextField
                    type="text"
                    name="director_ip"
                    /><br/> 
                  <label className="w-25 px-3" htmlFor="controller_ip">Controller IP :</label>
                  <TextField
                    type="text"
                    name="controller_ip"
                    /><br/> 
                  <label className="w-25 px-3" htmlFor="email">Config :</label>
                  <TextField
                    className="my-3"
                    type="file"
                    id="config"
                    />
                  </>
                  }

                  {/* if orchestrator value = OSM */}
                  {this.state.changeOrchestrator == 'OSM' &&
                  <>
                  <label className="w-25 px-3" htmlFor="email">VNF :</label>
                  <select name="depOsmVnf" className="input-group-text my-2 w-50">
                              {this.state.VNFListOSM.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 

                  <label className="w-25 px-3" htmlFor="email">VNF Desc. :</label>
                  <span className="multiselect my-2 w-50">
                      <span onClick={this.showCheckboxes} className="selectBox">
                        <select className="input-group-text" >
                          <option>Select an option</option>
                        </select>
                        <span className="overSelect"></span>
                      </span>
                      <span id="checkboxes">
                        <label htmlFor="one">
                          <input type="checkbox" value="1" name="VNF"/><option>Select an option</option></label>
                        <label htmlFor="two">
                          <input type="checkbox" value="2" name="VNF"/>Second checkbox</label>
                        <label htmlFor="three">
                          <input type="checkbox" value="3" name="VNF"/>Third checkbox</label>
                      </span>
                    </span>  <br/>

                  <label className="w-25 px-3" htmlFor="email">NS Desc. :</label>
                  <select name="depOsmNsd" className="input-group-text my-2 w-50">
                              {this.state.NSDAsset.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 

                  <label className="w-25 px-3" htmlFor="email">Config :</label>
                  <select name="depOsmConfig" className="input-group-text my-2 w-50">
                              {this.state.Config.map(item => {   
                                  return (<option value={item} key={item} directory={item}>{item}</option>);
                              })}
                          </select><br/> 
                  </>
                  }
          </form>
          </div>
          </MuiThemeProvider>
    )
      }
}
export default DeployNowPage;