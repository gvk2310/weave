import React from 'react'
import {MonitoringTabs} from '../LoginPages/TopNav'
import {SecurityTabs} from '../LoginPages/myWizLeftNav'
import {Test} from './Test'

class Regulate extends React.Component{
constructor(props){
    super(props)
    this.state={
        newURl:'',
    }
}
    handleURL = () => {
           this.setState({newURl:this.refs.URL.value}) 
    }
    render(){
        return(
            <>
             <div className="row container-fluid">
                {/* left nav */}
                <div className="col-lg-1">
                    <SecurityTabs selected="Regulate"/>
                </div>
                {/* left nav */}
                    {/* Main Content */}
                <div className="container-fluid col-lg-11 mainContent pl-5">
                <input ref="URL" type="text" onChange={this.handleURL}/>
               {this.state.newURl && <Test url={this.state.newURl}/>}
                </div>
                </div>
                {/* Main Content */}
            </>
        )
    }
}
export default Regulate;
