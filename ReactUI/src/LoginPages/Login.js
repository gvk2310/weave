import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {getMuiTheme} from 'material-ui/styles/';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
//import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import './Login.css';
import { Redirect } from 'react-router-dom';
import UserLogin from './UserLogin';
import { connect } from "react-redux";
import {loginUser} from "../action/login";
import Header from './Header'
import { encode } from "base-64";
import {Link} from 'react-router-dom';

class Login extends React.Component {
constructor(props){
  super(props);
      this.state={
        data:'',
        username:'',
        password:'',
        role:'',
        loggedIn:false,
        redirect: '',
        loginscreen:[],
        loginmessage:'',
        token:'',
      }
 }

handleKeyPress = () => {
  this.handleClick();
}

componentWillMount(){
  
 sessionStorage.removeItem('tokenStorage');
 var loginmessage = "Not registered yet, please contact the ";
  this.setState({
                loginmessage:loginmessage
                  })
}

handleClick = (event) =>{
  event.preventDefault();

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(this.state.username) == false) 
  {
      alert('Invalid Email Address');
      return false;
  }
  if(this.state.password.length <= 5) {
    alert('Invalid Password');
      return false;
  }
    let name = this.state.username.match(/^([^@]*)@/)[1];
    var myHeaders = new Headers();
    //myHeaders.append("Authorization",  "Basic YWRtaW5AZG5vcHMuY29tOkFkbWluQDEyMw==");
    console.log(this.state.username);
    console.log(this.state.password);
    myHeaders.append("Authorization", `Basic ${encode(`${this.state.username}:${this.state.password}`)}`);
    myHeaders.append('Origin', 'http://localhost:3000/');
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
    myHeaders.append('Access-Control-Allow-Credentials', 'true');
    myHeaders.append('GET', 'POST', 'OPTIONS');
  
    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    //redirect: 'follow'
    //mode:'no-cors',
    };
    
    fetch("https://cors-anywhere.herokuapp.com/http://dno-dev.acndevopsengineering.com/umg/auth", requestOptions)
    .then(response => response.json())
    .then((findresponse)=>{
      /*Login based on token*/
      if(findresponse.token){
      sessionStorage.setItem('URLStorage', 'https://cors-anywhere.herokuapp.com/http://dno-dev.acndevopsengineering.com/umg');
      sessionStorage.setItem('tokenStorage', findresponse.token);
      sessionStorage.setItem('username', name);
      var payload={
        "email":name,
        "token":findresponse.token,
        };
      this.props.setLoginUser(payload);

        this.setState({
        redirect: '/uploadScreen',
        token: findresponse.token,
      })
      
    }
     else {
        alert('wrong credentials');
      }
    })
    .catch(error => console.log('error', error));
}



render() {

  if (this.state.redirect) {
    return <Redirect to={this.state.redirect} />
  }
  
  // const theme = createMuiTheme({
  //   appBar: {
  //     color: "#286E99",
  //     height: 200,
  //     titleFontWeight : 400,
  //  },
  // });

    return (
      <div>
        <div className="BannerImg"><img src="https://mywizarddevops.accenture.com/static/img/banner.png" alt="Banner" className='bannerImg'/></div>
        <div style = {{textAlign: 'center'}}>
        <MuiThemeProvider>
          <form onSubmit={this.handleClick}>
           <TextField 
             hintText="Enter your Username"
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               
               />
             <br/>
             <RaisedButton label="Submit" type="submit" primary={true} style={style}/>
         </form>
         <div>{this.state.loginmessage}
         <a href="mailto:namrata.a.yadav@accenture.com?Subject=DevNetOps%20Registration&Body=Hi%20TeamDevNetOps%2C%20%0A%0AI%20would%20like%20to%20explore%20the%20DevNetOps%20tool%2C%20Requesting%20to%20grant%20an%20access%20to%20me.%20%0A%0AName%20%20%3A%20%20%3CEnter%20Your%20Name%3E%20%0AEmail%20%3A%20%20%3CEnter%20Your%20Email%20%3E%20%0ARole%20%20%3A%20%20%3CEnter%20Your%20Role%3E%20%0A%0AThanks%2C%20%0A%3CUser%20Name%3E%20%0A%0ADisclaimer%3A%20%0AThis%20report%20has%20been%20published%20for%20information%20and%20illustrative%20purposes%20only%20and%20is%20not%20intended%20to%20serve%20as%20advice.%20%0A">Admin</a>
         </div>
         
         </MuiThemeProvider>
         </div>        
      </div>
    );
  }
}

const mapStateToProps = state => {
  const users = state.user;
  console.log(users);
  return {users};
  
}

const mapDispatchToProps = (dispatch) => {
  console.log(dispatch);
    return{
      setLoginUser: (payload) => {
            dispatch( loginUser(payload))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const style = {
 margin: 15,
};


