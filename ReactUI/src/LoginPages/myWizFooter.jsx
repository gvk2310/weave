import React from 'react';
import logo from '../Images/logo.svg'

class MyWizFooter extends React.Component{

Constructor(props){
    //Super(props);
    this.state={}
}

render(){
    return(
            <>
        {/* Footer */}
        <footer className="myw-footer">
        <div className="myw-container">
                Copyright 2001-2020 Accenture. All rights reserved. Accenture Confidential. For internal use only.
                <a href="javascript:;">Terms of Use</a>
                <a href="javascript:;">Privacy Statement</a>
            </div>
        </footer>
            </>
    )
    }
    }
    export default MyWizFooter;