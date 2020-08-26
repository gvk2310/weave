import React from 'react';
import logo from '../Images/logo.svg'
import user from '../Images/user.svg'
import settings from '../Images/settings.svg'
import uva from '../Images/uva.svg'
import help from '../Images/help.svg'
import MyWizTopNav from './myWizTopNav'

class MyWizHeader extends React.Component{

    constructor(props){
        super(props);
    }
componentWillMount = () => {
    console.log(this.props)
    if(this.props.location.pathname.includes('login')){
    sessionStorage.removeItem('tokenStorage');
    }
    
} 
handleSignOut = () => {
            document.getElementById('signout').submit()
            sessionStorage.removeItem('tokenStorage');
    }
render(){
    let data = null;
    data = sessionStorage.getItem('tokenStorage');
    let username = sessionStorage.getItem('username');
    console.log(data);
    return(
            <>
            {/* <!-- header --> */}
            <header className="myw-app-header myw-container d-flex">
                <div className="myw-brand d-flex align-items-end">
                    <img src={logo} alt="accenture" />
                    <span><div className="myw-app-name d-flex align-items-center">myWizard<sup>&reg;</sup>&nbsp; DevOps
                    </div></span>
                </div>
                <div className="myw-header-nav d-flex justify-content-end">
                    <div className="dropdown dropright d-flex">
                        <a href="javascript:;" className="myw-help myw-header-item dropdown-toggle" role="button"
                            data-display="static" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            id="helpLinks" title="Help">
                            <img src={help} alt="Help" />
                            <span className="sr-only">Help</span>
                        </a>
                        <div className="dropdown-menu" aria-labelledby="helpLinks">
                            <div className="dropdown-body p-3">
                                <div className="fs-14 myw-500 mb-2">Contact Us</div>
                                For more information contact: <a
                                    href="mailto:mywizard.devops@accenture.com">mywizard.devops@accenture.com</a>
                            </div>
                            {data &&
                            <div className="dropdown-body p-3">
                                <div className="fs-14 myw-500 mb-2">Experience Center</div>
                                <a
                                    href="http://adeb75f40f392485bae07124284532ce-146122776.us-west-2.elb.amazonaws.com/onboard.html">Link to Experience Center</a>
                            </div>
                            }
                        </div>
                    </div>
                    {data &&
                    <><a href="javascript:;" className="myw-header-item myw-uva disabled" title="Notifications">
                        <img src={uva} alt="Notifications" />
                        <span className="sr-only">Notifications</span>
                    </a>
                    <a href="javascript:;" className="myw-header-item myw-settings disabled" title="Settings">
                        <img src={settings} alt="Settings" />
                        <span className="sr-only">Settings</span>
                    </a>
                    <div className="dropdown dropright d-flex">
                        <a href="javascript:;" className="myw-login myw-header-item" role="button"
                            data-display="static" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            id="loginDetails" title={username}>
                            <img src={user} alt="demo.user" />
                            <span className="sr-only">{username}</span>
                        </a>
                        <div className="dropdown-menu dropdown-md" aria-labelledby="loginDetails">
                            <div className="dropdown-body">
                            <form id="signout" action="/login"> 
                                <div className="p-3">
                                    <p>Welcome, <strong>{username}</strong></p>
                                    <button onClick={this.handleSignOut} form="signout" className="btn btn-primary btn-sm">Sign out</button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div></>
                    }
                </div>
            </header>
            {/* <!-- /header --> */}
            {/* <!-- topbar --> */}
            <div className="myw-topbar">
                <div className="myw-container d-flex flex-wrap">
                    <a href="#" className="myw-app-name d-flex align-items-center px-3">DevNetOps</a>
                </div>
            </div>
            {/* <!-- /topbar --> */}
            {data &&
                <div class="topNav">
                   <MyWizTopNav/> 
                </div>
            }
            </>
    )
    }
    }
    export default MyWizHeader;
