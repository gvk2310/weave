import React from 'react';

class Services extends React.Component{

    constructor(props){
        super(props);
        this.state={
            services: [],
            showInOption: 'Select something',
            status: '',
            response: '',
            token: '',
            url: '',
            isDone: true,
            msgClass: '',
            disabledBtn: false,
            
        };
    }

    componentDidMount = () => {     
        
        const API_URL = process.env.REACT_APP_USER_MANAGEMENTURL;
        // console.log(process.env);
        /* Display List of Services */
        var myHeaders = new Headers();
        myHeaders.append('Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
        myHeaders.append('Access-Control-Allow-Credentials', 'true');
        myHeaders.append('GET', 'POST', 'OPTIONS');
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`###REACT_APP_PLATFORM_URL###/access/services`, requestOptions)
            .then(function(response){
                // console.log(response);
                return response.json();
            })
            .then(result => {
                // if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}
                // console.log(result);
                if(result.msg){
                    this.setState({response:result.msg});
                }else{
                    this.setState({services:result});
                }
            })
            .catch(error => {
                console.log('error', error);
                if(document.getElementById('loader')){document.getElementById('loader').style.display = "none";}          
            });
    }
    
    render(){       
        /*Display Service Status in the Table*/
        let service = '';
        // console.log(this.state.services);
        if(this.state.services.length>0) 
        {
            service = this.state.services.map((value,index) => {
                return <tr className="" key={index}>
                    <td>{value.name}</td>
                    <td>{value.pod_state}</td>
                    <td>{value.service_state}</td>
                    <td>{value.endpoint_URL}</td>
                </tr>;
            });
        }
        else service = <tr><td className="text-center text-primary" colSpan="4">{this.state.response}</td></tr>;

        return(
            
            <>
                {/* <!-- content --> */}
                <div className="col dev-AI-infused-container">
                    <div className="myw-container py-4 ">
                        <div className="d-flex align-items-center">
                            <div className="dev-page-title">Services</div>
                            <div className="ml-auto dev-actions">
                            </div>
                        </div>
                        <div className="dev-section my-4">
                            <div className="table-responsive">
                                <table className="table table-striped dev-anlytics-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Service</th>
                                            <th scope="col">Pod Status</th>
                                            <th scope="col">Service Status</th>
                                            <th scope="col">Endpoint</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {service}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                
            </>
        );
    }
}

  
export default Services;
