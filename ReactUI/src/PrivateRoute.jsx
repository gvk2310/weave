import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import {connect} from 'react-redux'

const PrivateRoute = ({component: Component, ...rest}) => {

    let data = sessionStorage.getItem('tokenStorage');
    return (
      <Route
        {...rest}
        render={(props) => {
            console.log(data);
            // return (props.user && props.user.token != '')
            return data

          ? <Component {...props} />
          : <Redirect to={'/login'} />}}
      />
    )
  }


  const mapStateToProps = state => {
    console.log(state);
    const user = state.user;
    return {user};

  }

  export default connect(mapStateToProps, '')(PrivateRoute);