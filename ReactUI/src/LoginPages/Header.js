import React from 'react'
import logo from '../Images/logoDevNetops.png';
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {getMuiTheme} from 'material-ui/styles/';
import {AppBar, Tabs, Tab} from 'material-ui';
import SimpleTabs from './TopNav'
import SideBar from './sidebar'
import {Link} from 'react-router-dom'
import './Login.css'
import MyWizTopNav from './myWizTopNav'

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state={
            position: 0,
        }
        console.log(props.location.pathname);
    }
    componentWillMount = () => {
        console.log(this.props)
        if(this.props.location.pathname.includes('login')){
        sessionStorage.removeItem('tokenStorage');
        }
        setTimeout(
            function() {
                this.setState({ position: 1 });
            }
            .bind(this),
            3000
        );
    } 

    handleChange = () => {
        console.log('insideHandleChange in Header section');
    }

    handleSignOut = () => {
        sessionStorage.removeItem('tokenStorage');
        document.getElementById('signout').submit();
    }

    render(){
        if(this.state.position==1){
            this.handleSignOut()
        }
        let data = null;
        data = sessionStorage.getItem('tokenStorage');
        console.log(this.props.users.email)
        let username = sessionStorage.getItem('username');
        console.log(data);
        const Theme = getMuiTheme({
            appBar: {
            color: "#008",
            height: 40,
            titleFontWeight : 400,
            
         },
            raisedButton: {
            primaryColor: "#008",
        },
            tabs: {
            backgroundColor: "#008",
        }
        });
        
        const handleMouseHover = (event) => {
            event.preventDefault();
            if(event.target.classList.contains('bm-overlay')){
                document.getElementsByClassName('bm-overlay')[0].click();
            }
        }

        /*Sliding Navigation on basis of token*/
        let showNav = '';
        let showContent ='';
        let token = undefined;
        token = this.props.users.token;
        if(data != undefined){
            showNav= <><button className="bm-burger-button"></button></>
            showContent= <div className="sidebar" onMouseOver={(event) => handleMouseHover(event)}><SideBar/></div>
        }

        
        return(
            <div className="header">
                <div className="topBar">

                <header className="cas-app-header cas-container d-flex">
                    <div className="cas-brand d-flex align-items-center">
                        
                    </div>
                    <div className="cas-header-nav d-flex justify-content-end">
                    {data == null &&
                        <Link href="#" className="cas-header-item" title="Help" aria-label="Help" target="_blank">
                        <span className="cas-user-info" id="username">Help</span>
                        <span className="fa fa-question-circle-o fa-lg"></span>
                        </Link>
                    }
                        {data &&
                        <Link onClick={() => {window.location.href='http://aae487d19480d493fa42154c565a0e8b-1387227892.us-west-2.elb.amazonaws.com/onboard.html'}} className="cas-header-item" title="Help" aria-label="Help" target="_blank">
                        <span className="cas-user-info" id="username">Experience Center</span>
                        <span className="fa fa-question-circle-o fa-lg"></span>
                        </Link>
                        }
                        {data &&
                        <div className="dropdown d-flex">
                        <Link href="#" className="cas-header-item dropdown-toggle" role="button" data-display="static" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="userDetails">
                            <span className="cas-user-info" id="username">{username}</span>
                            <span className="fa fa-user-circle-o fa-lg"></span>
                        </Link>
                            <div className="dropdown-menu dropdown-menu-right dropdown-md" aria-labelledby="userDetails">
                                <div className="cas-dropdown-body">
                                    <div className="p-3 w-50">
                                    <form id="signout" action="/login"> 
                                        {/* <form id="signout" method="post" action="/login"> */}
                                            <button onClick={this.handleSignOut} form="signout" className="btn btn-primary btn-sm">Sign out</button>
                                        </form><br/>
                                    <form id="signout1" action="/changePassword"> 
                                        {/* <form id="signout" method="post" action="/login"> */}
                                            <button type="submit" form="signout" className="btn btn-primary btn-sm">Change Password</button>
                                        </form>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        }
                    </div>
                </header>



               
            <><span className="logo">
            {/* {this.props.users.token && */}
            <Link to='/uploadscreen' ><img className="logoImg" src={logo} alt="Accenture"/></Link>
        
            </span></>
   
                </div>
                
            <MuiThemeProvider  muiTheme={Theme}>
                <AppBar showMenuIconButton={false} className="AppBar">
                    
                {/* {showNav} */}
                    
                </AppBar>
                {/* <div class="BannerImg"></div> */}
                
                {/* {showContent} */}
                {data &&
                <div class="topNav">
                   <MyWizTopNav/> 
                </div>
                }
            </MuiThemeProvider>
        </div>  
        )
    }
}
const mapStateToProps = state => {
    const users = state.user;
    console.log(users);
    return {users};
    
  }
//export default Header;
export default connect(mapStateToProps, '')(Header);