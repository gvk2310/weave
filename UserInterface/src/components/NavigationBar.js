import React, { Fragment, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { cookies, getCookie } from '../helpers/Local/Cookies';
import { Buffer } from 'buffer';
import { encryptionAlgorithm, decryptionAlgorithm, Base64EncodeUrl, Base64DecodeUrl } from '../helpers/helperFunction'

let userRole = '';
const NavigationBar = (props) => {
    const [onboardAcc, setonboardAcc] = useState(false);
    const [deployAcc, setdeployAcc] = useState(false);
    const [accessAcc, setaccessAcc] = useState(false);
    const [checkRole, setcheckRole] = useState('');
    const [checkName, setcheckName] = useState('');
    const [projectAcc, setprojectAcc] = useState(false);
    const [status, setstatus] = useState('');
    const [isError, setisError] = useState(false);

    useEffect(() => {
        var myHeaders = new Headers();

        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(`###REACT_APP_PLATFORM_URL###/access/roles`, requestOptions)
            .then(response => response.json())
            .then((findresponse) => {
                setcheckRole(findresponse)
            })
            .catch(error => console.log('error', error));

        let decUsername = decryptionAlgorithm(cookies['cookies'].username);
        let userName = decUsername.toLowerCase();
        fetch(`###REACT_APP_PLATFORM_URL###/access/userinfo/${userName}`, requestOptions)
        .then(response => {
            if(response.status!=200)
            {setisError(true)}
            return response.json()
        })
        
        .then((findresponse) => {
           if(findresponse.msg){
               setstatus(findresponse.msg)
           }
           else{
            setcheckName(findresponse)
           }
            })
            .catch(error => console.log('error', error));
    }, []);

    const expandAccordian = (accordianName) => {
        if (accordianName == 'onboard') { 
            setonboardAcc(!onboardAcc);
            setdeployAcc(false);
            setaccessAcc(false);
            setprojectAcc(false);
        }
        else if (accordianName == 'deploy') { 
            setdeployAcc(!deployAcc);
            setaccessAcc(false);
            setprojectAcc(false);
            setonboardAcc(false);
        }
        else if (accordianName == 'access') { 
            setaccessAcc(!accessAcc);
            setprojectAcc(false);
            setonboardAcc(false);
            setdeployAcc(false);
        }
        else if (accordianName == 'project') { 
            setprojectAcc(!projectAcc);
            setonboardAcc(false);
            setdeployAcc(false);
            setaccessAcc(false);
        }
    }

    const closeAllAccordion = (openAcc) => {
        if (openAcc === 'overview') { 
            setprojectAcc(false);
            setonboardAcc(false);
            setdeployAcc(false);
            setaccessAcc(false);
        }
    }
    let Rolebuff = new Buffer(cookies.get("userrole"));
    userRole = Rolebuff.toString('ascii');
    let decUsername = decryptionAlgorithm(cookies['cookies'].username);
    let decUserRole = decryptionAlgorithm(userRole);
    userRole = decUserRole.toString('ascii');
    // console.log('decUsername', decUsername);
    // console.log(userRole)
    // console.log(checkRole)
    // console.log("checkName", checkName);

    
    return (
        <Fragment>
            <div className="col-auto dev-navbar pt-3">
                <div className="nav nav-tabs flex-column" className="nav nav-tabs flex-column">
                    <NavLink to="/home" className="nav-item nav-link dev-overview" onClick={(e) => { closeAllAccordion('overview') }}>
                        Overview
                    </NavLink>
                    <div className="accordion dev-ai-infused-accordian" id="devNetOps">
                        {/* <!-- onboard --> */}

                        {checkName && <>
                            {checkName.services.filter(value => value == "devnetops-onboard").length > 0 && <div className="card">
                                <div className="card-header" id="onboardcollapsehead">
                                    <NavLink to="/onboarding/repository" className={`dev-accordian-item dev-onboard  ${onboardAcc ? "" : "collapsed"}`} data-toggle="collapse" data-target="#onboardcollapse" aria-expanded={`${onboardAcc ? "true" : "false"}`} aria-controls="onboardcollapse" onClick={(e) => { expandAccordian('onboard') }}>Onboard</NavLink>
                                </div>
                                <div id="onboardcollapse" className={`accordion collapse  ${onboardAcc ? 'show' : ''} `} aria-labelledby="onboardcollapsehead" data-parent="#devNetOps">
                                    <div className="card-body py-0">
                                        <div className="dev-accordian-tree">
                                            <NavLink to="/onboarding/repository" className="text-decoration-none ">Repository</NavLink>
                                            <NavLink to="/onboarding/infra" className="text-decoration-none">Infrastructure</NavLink>
                                            <NavLink to="/onboarding/asset" className="text-decoration-none">Asset</NavLink>
                                            <NavLink to="/onboarding/test" className="text-decoration-none">Test</NavLink>
                                            {/* <NavLink to="devnet-test.html" className="text-decoration-none">Test</NavLink> */}
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </>
                        }
                        {/* <!-- /onboard --> */}
                        {/* <!--deploy --> */}
                        {checkName && <>
                            {checkName.services.filter(value => value == "devnetops-deployment").length > 0 && <div className="card">
                                <div className="card-header" id="deploycollapsehead">
                                    <NavLink to="/deploy/deployment" className={`dev-accordian-item dev-deploy ${deployAcc ? "" : "collapsed"} `} data-toggle="collapse" data-target="#deploycollapse" aria-expanded={`${deployAcc ? "true" : "false"}`} aria-controls="deploycollapse" onClick={(e) => { expandAccordian('deploy') }}>Deploy</NavLink>
                                </div>
                                <div id="deploycollapse" className={`accordion collapse  ${deployAcc ? 'show' : ''} `} aria-labelledby="deploycollapsehead" data-parent="#devNetOps">
                                    <div className="card-body py-0">
                                        <div className="dev-accordian-tree">
                                            <NavLink to="/deploy/deployment" className="text-decoration-none ">Deploy</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>}</>}
                        {/* <!-- deploy --> */}

                        {/*<!--/project --> */}
                        {checkName && <>
                            {checkName.services.filter(value => value == "devnetops-project").length > 0 && <div className="card">
                                <div className="card-header" id="projectcollapsehead">
                                    <NavLink to="/project/project" className={`dev-accordian-item dev-project ${projectAcc ? "" : "collapsed"} `} data-toggle="collapse" data-target="#projectcollapse" aria-expanded={`${projectAcc ? "true" : "false"}`} aria-controls="projectcollapse" onClick={(e) => { expandAccordian('project') }}>Project Management</NavLink>
                                </div>
                                <div id="projectcollapse" className={`accordion collapse  ${projectAcc ? 'show' : ''} `} aria-labelledby="projectcollapsehead" data-parent="#devNetOps">
                                    <div className="card-body py-0">
                                        <div className="dev-accordian-tree">
                                            <NavLink to="/project/project" className="text-decoration-none ">Projects</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>}</>}
                        {/*<!--/project --> */}

                        {/* <!-- access --> */}
                        {userRole == 'admin' && <div className="card">
                            <div className="card-header" id="accesscollapsehead">
                                <NavLink to="/access/user" className={`dev-accordian-item dev-monitor ${accessAcc ? "" : "collapsed"} `} data-toggle="collapse" data-target="#accesscollapse" aria-expanded={`${accessAcc ? "true" : "false"}`} aria-controls="accesscollapse" onClick={(e) => { expandAccordian('access') }}>Access</NavLink>
                            </div>
                            <div id="accesscollapse" className={`accordion collapse  ${accessAcc ? 'show' : ''} `} aria-labelledby="accesscollapsehead" data-parent="#devNetOps">
                                <div className="card-body py-0">
                                    <div className="dev-accordian-tree">
                                        <NavLink to="/access/user" className="text-decoration-none ">User</NavLink>
                                        <NavLink to="/access/role" className="text-decoration-none">Role</NavLink>
                                        <NavLink to="/access/service" className="text-decoration-none">Services</NavLink>
                                        {/* <NavLink to="/access/project" className="text-decoration-none">Project</NavLink> */}

                                    </div>
                                </div>
                            </div>
                        </div>}
                        {/* <!-- /access --> */}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NavigationBar
