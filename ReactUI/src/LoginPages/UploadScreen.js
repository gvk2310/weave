import React from 'react';
import './Login.css'
import Header from './Header';
import LeftNavigation from './LeftNavigation';
import PageContent from './pageContent';
import SideBar from './sidebar';
import {connect} from 'react-redux'
import User from '../PageComponents/User'
import Role from '../PageComponents/Role'
import Services from '../PageComponents/Services'
import {sendCollectedServices} from '../action/login'
//import '../Images'
import cardImage from '../Images/CardImage.png'
import homeScreen from '../Images/homePageImg.png'

class UploadScreen extends React.Component{

    constructor(props){
        super(props);
        this.state={
            menuVisible: false,
            menuButton:true,
            services: [],
            roles: [],
        }
        console.log(props);
    }

    componentDidMount = () => {
        require('dotenv').config();    
                let API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
                console.log(process.env)
                let token = sessionStorage.getItem('tokenStorage');
          
                let myHeaders = new Headers();
                  myHeaders.append("Authorization", `Bearer ${token}`);
                  myHeaders.append('Access-Control-Allow-Origin', '*');
                  myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
                  myHeaders.append('GET', 'POST', 'OPTIONS');
          
                  var requestOptions = {
                  method: 'GET',
                  headers: myHeaders,
                  };
      
          fetch(`${API_URL}/roles`, requestOptions)
              .then(response => response.json())
              .then((findresponse)=>{
                           if(findresponse.msg){
                            // this.setState({response:findresponse.msg})
                            alert('Roles Alert'+findresponse.msg)
                            }else{
                              console.log('Roles Alert else'+ findresponse)
                                  this.setState({roles: findresponse})
                            }
                      })
              .catch(error => console.log('error', error)); 
      }


    handleClick(){
        console.log('handle click', !this.state.menuVisible);
        document.querySelector('.bm-burger-button button').click();
        this.setState({
            menuVisible: !this.state.menuVisible,
            menuButton: !this.state.menuButton, 
        })
      }


    render(){
        this.props.sendServices(this.state.services);   
        let role = [];    
        role = this.state.roles.map((value,index) => {
            console.log(value)
        });

        return(
                   <>
                    {/* <div className="content">
                    <div className="devops-container devops-banner">
								<div className="col-12">
									<div className="devops-container py-3">
										<div className="row">
											<div className="col-12">
												<h2 className="mb-2">Welcome to myWizard<sup>®</sup> DevNetOps</h2>  
												<div className="devops-tagline">DevNetOps is a containerized Platform for On-boarding, Provisioning, Security, Testing and Monitoring of VNF solution.</div>
											</div>
                                        </div>
										<div className="row banner-block">
                                        <div className="col-1"></div>
											<div className="col-2 devops-banner-info align-items-center">
                                                <span className="devops-info-count">Acquired</span><br/>
                                                <span className="">VNF : </span><span className="devops-info-name">10</span><br/>
                                                <span className="">CNF : </span><span className="devops-info-name">02</span><br/>
                                             </div>
                                             
											<div className="col-2 devops-banner-info align-items-center">
                                                <span className="devops-info-count">Deployed</span><br/>
                                                <span className="">Demo : </span><span className="devops-info-name">2</span><br/>
                                                <span className="">Test : </span><span className="devops-info-name">4</span><br/>
                                                <span className="">Stage : </span><span className="devops-info-name">2</span><br/>
                                                <span className="">Prod : </span><span className="devops-info-name">4</span><br/>
                                                 <span className="devops-info-name"></span>
                                                </div>
                                            <div className="col-2 devops-banner-info align-items-center">
                                                <span className="devops-info-count">Tests</span> <br/>
                                                <span className="">Run : </span><span className="devops-info-name">100</span><br/>
                                                <span className="">Pass : </span><span className="devops-info-name">80</span><br/>
                                                <span className="">Failed : </span><span className="devops-info-name">20</span><br/>
                                                </div>
                                            <div className="col-2 devops-banner-info align-items-center">
                                                <span className="devops-info-count">Security</span><br/>
                                                <span className="">Scan : </span><span className="devops-info-name">20</span><br/>
                                                <span className="">Issue : </span><span className="devops-info-name">9</span><br/>
                                                </div>
                                            <div className="col-2 devops-banner-info align-items-center">
                                                <span className="devops-info-count">Certified</span><br/>
                                                <span className="">VNF : </span><span className="devops-info-name">05</span><br/>
                                                <span className="">CNF : </span><span className="devops-info-name">01</span><br/>
                                                </div>
                                            <div className="col-1"></div>
                                        </div> 
                                                                                                                     
                                    </div>      
                                                                 
								</div>
                            </div>                            
                    </div> */}
                    
                    <div className="container-fluid overview">   
                    {/* <div className="text-center"> */}
                    {/* <img className="img-fluid w-45 p-4" src={require('../Images/overviewImg2.png')} alt="overviewImg2"/> */}
                    {/* <img className="img-fluid" src={require('../Images/overviewImg1.png')} alt="overviewImg1" className="p-5"/><br/> */}
                    {/* <img className="img-fluid w-45 p-4" src={require('../Images/overviewImg3.png')} alt="overviewImg3"/> */}
                    {/* <img className="img-fluid" src={require('../Images/DNOorchestrationengine.jpg')} alt="DevNetOps orchestration engine"/> */}
                    {/* </div> */}
                    {/* repo infra asset */}
                    {/* <div class="row cardGroup">
                    <div class="col-md-1"></div>
                    <div class="col-md-2 offset-md-1 cardContainer" id="cardContainer1">
                        <div class="onboardCards">Repo
                            <span className="cardImgHolder">
                                <img src={cardImage} alt="accenture" />
                            </span>
                        </div>
                    </div>
                    <span class="arrow1"><i class="fa fa-long-arrow-right"></i></span>
                    <div class="col-md-2 offset-md-1 cardContainer" id="cardContainer2">
                        <div class="onboardCards">Infra
                            <span className="cardImgHolder">
                                <img src={cardImage} alt="accenture" />
                            </span>
                        </div>
                    </div>
                    <span class="arrow2"><i class="fa fa-long-arrow-right"></i></span>
                    <div class="col-md-2 offset-md-1 cardContainer" id="cardContainer3">
                        <div class="onboardCards">Asset
                            <span className="cardImgHolder">
                                <img src={cardImage} alt="accenture" />
                            </span>
                        </div>
                    </div>
                    </div> */}
                    {/* repo infra asset */}
                    {/* repo infra asset Image*/}
                    <div id="homeScreen" className="col-lg-12 row">
                        <img className="homePageImg2" src={homeScreen} alt=""/>
                    </div>
                    {/* repo infra asset Image*/}
                    
                </div></>


        )
    }
}

const mapDispatchToProps = (dispatch) => {
    console.log(dispatch);
      return{
        sendServices: (service) => {
              dispatch( sendCollectedServices(service))
          }
      }
  }

  const mapStateToProps = state => {
    const user = state.user;
    return {user};
  }

//export default UploadScreen;
export default connect(mapStateToProps, mapDispatchToProps)(UploadScreen);
