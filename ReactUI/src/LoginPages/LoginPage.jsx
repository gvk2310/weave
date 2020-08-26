import React from 'react';
import { encode } from "base-64";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import {loginUser} from "../action/login";

class LoginPage extends React.Component{

Constructor(props){
    //Super(props);
    this.state={
        data:'',
        username:'',
        password:'',
        roles:'test',
        loggedIn:false,
        redirect: '',
        loginscreen:[],
        loginmessage:'',
        token:'',
        wrongCred:false,
      }
}

componentWillMount(){
  
    sessionStorage.removeItem('tokenStorage');
    var loginmessage = "Not registered yet, please contact the ";
     this.setState({
                   loginmessage:loginmessage
                     })
    let body = document.querySelector("body");
    body.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('LoginButton').click();
        console.log('test slick');
      }
    });
   }
   handleKeyPress = () => {
    this.handleClick();
  }
    handleUsername = (event) => {
        this.setState({username: event.target.value});
    }
    handlePassword = (event) => {
        this.setState({password: event.target.value});
    }
    handleClick = (event) =>{
    event.preventDefault();
  
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    console.log()
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
      this.setState({wrongCred:false})
      fetch("https://cors-anywhere.herokuapp.com/http://dno-dev.acndevopsengineering.com/umg/auth", requestOptions)
      .then(response => response.json())
      .then((findresponse)=>{
        
          console.log(findresponse)
        /*Login based on token*/
        if(findresponse.token){
        sessionStorage.setItem('URLStorage', 'https://cors-anywhere.herokuapp.com/http://dno-dev.acndevopsengineering.com/umg');
        sessionStorage.setItem('tokenStorage', findresponse.token);
        sessionStorage.setItem('username', name);
      //  
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
          this.setState({wrongCred:true})
        }
      })
      .catch(error => console.log('error', error));
  }   

render(){

    if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }
    return(
        <>
        <div className="container-fluid login">
            <div className="cas-wrap cas-container devops-landing">
            <div className="row my-5">
                <div className="col-12 col-md-6 col-lg-5 col-xl-4">
                    <form method="post" name="auth_form" action="" id="auth_form" onSubmit={this.handleClick}>
                        <div className="form-group mb-5">
                            <label className="mb-0">Username</label>
                            <input type="text" className="form-control" id="username" name="username" autocomplete="off" onChange = {this.handleUsername}/>
                            <span></span>
                        </div>
                        <div className="form-group">
                            <label className="mb-0">Password</label>
                            <input type="password" className="form-control" id="password" name="password" onChange = {this.handlePassword}/>
                            <span></span>
                        </div>
                        {this.state.wrongCred && <p id="invalid">Invalid Credentials! Please try Again</p>}
                        <button onclick="check(this.form)" id="LoginButton" className="btn btn-primary devops-login-btn my-4" value="Login">Login</button>
                    </form>
                    <div>{this.state.loginmessage}
                        <a href="mailto:namrata.a.yadav@accenture.com?Subject=DevNetOps%20Registration&Body=Hi%20TeamDevNetOps%2C%20%0A%0AI%20would%20like%20to%20explore%20the%20DevNetOps%20tool%2C%20Requesting%20to%20grant%20an%20access%20to%20me.%20%0A%0AName%20%20%3A%20%20%3CEnter%20Your%20Name%3E%20%0AEmail%20%3A%20%20%3CEnter%20Your%20Email%20%3E%20%0ARole%20%20%3A%20%20%3CEnter%20Your%20Role%3E%20%0A%0AThanks%2C%20%0A%3CUser%20Name%3E%20%0A%0ADisclaimer%3A%20%0AThis%20report%20has%20been%20published%20for%20information%20and%20illustrative%20purposes%20only%20and%20is%20not%20intended%20to%20serve%20as%20advice.%20%0A">Admin</a>
                    </div>
                </div>
            </div>
        </div>
            </div>
            </>
    )
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
      
      export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
    //export default LoginPage;