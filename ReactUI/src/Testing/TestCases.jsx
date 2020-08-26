import React from 'react'
//import {TestingTabs} from '../LoginPages/TopNav'
import {TestingTabs} from '../LoginPages/myWizLeftNav'

class TestCases extends React.Component{

    // componentDidMount = () => {
    //     document.querySelector('.dome').classList.remove('activeNav');
    //     document.getElementById('topnav-0').classList.add('activeNav');
    //   }

    render(){
        return(
            <>
                <div className="row container-fluid">
                {/* left nav */}
                <div className="col-lg-1">
                    <TestingTabs selected="TestCases"/>
                </div>
                {/* left nav */}
                {/* Main Content */}
                <div className="container-fluid col-lg-11 mainContent pl-5">
                </div>
                </div>
                {/* Main Content */}
            </>
        )
    }
}
export default TestCases;