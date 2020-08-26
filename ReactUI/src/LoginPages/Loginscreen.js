import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import {createMuiTheme} from '@material-ui/core/styles'
import RaisedButton from 'material-ui/RaisedButton';
import Login from './Login';
import Register from './Register';
import logo from '../Images/logo.png'
//import classes from '*.module.css';
class Loginscreen extends Component {
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:'',
      loginscreen:[],
      loginmessage:'',
      buttonLabel:'Register',
      isLogin:true
    }
  }

    componentWillMount(){
    var loginscreen=[];
    loginscreen.push(<Login parentContext={this} appContext={this.props.parentContext}/>);
    var loginmessage = "Not registered yet, Register Now";
    this.setState({
                  loginscreen:loginscreen,
                  loginmessage:loginmessage
                    })
  }

  handleClick(event){
    // console.log("event",event);
    var loginmessage;
    if(this.state.isLogin){
      var loginscreen=[];
      loginscreen.push(<Register parentContext={this}/>);
      loginmessage = "Already registered.Go to Login";
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     buttonLabel:"Login",
                     isLogin:false
                   })
    }
    else{
      var loginscreen=[];
      loginscreen.push(<Login parentContext={this}/>);
      loginmessage = "Not Registered yet.Go to registration";
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     buttonLabel:"Register",
                     isLogin:true
                   })
    }
  }
  
  render() {
    const muiTheme = getMuiTheme({
     raisedButton: {
    primaryColor: "#286E99"
  }
});
    return (
      <div className="loginscreen" >
        <div className="logo">
          <img src={logo} alt="Accenture"/>
        </div>
        <div style = {{textAlign: 'center'}}>
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          <MuiThemeProvider muiTheme={muiTheme}>
            <div>
               <RaisedButton label={this.state.buttonLabel} primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
           </div>
          </MuiThemeProvider>
        </div>
        </div>
      </div>
    );
  }
}
const style = {
  margin: 15,
};
export default Loginscreen;