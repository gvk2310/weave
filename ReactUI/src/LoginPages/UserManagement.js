import React from 'react'
import logo from '../Images/logo.png';
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {getMuiTheme} from 'material-ui/styles/';
import {AppBar, Tabs, Tab} from 'material-ui';
import SimpleTabs from './TopNav'
import SideBar from './sidebar'
import './Login.css'


class UserManagement extends React.Component{

    constructor(props){
        super(props)
        console.log('inside User management')
    }
    render(){

        const Theme = getMuiTheme({
            appBar: {
            color: "#286E99",
            height: 40,
            titleFontWeight : 400,
         },
            raisedButton: {
            primaryColor: "#286E99",
        },
            tabs: {
            backgroundColor: "#286E99",
        }
        });

        let showNav = '';
        let showContent ='';
        if(this.props.users.length != 0){
            showNav= <><button className="bm-burger-button"></button><SimpleTabs/></>
            showContent= <><SideBar/></>
        }
        
        return(
            <div>            
             <MuiThemeProvider  muiTheme={Theme}>

                {showNav}
                
                {showContent}
                    
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
export default connect(mapStateToProps,null)(UserManagement);