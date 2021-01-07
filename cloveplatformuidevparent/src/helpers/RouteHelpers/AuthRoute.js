import React from 'react';
import { Route } from 'react-router-dom';
import PageNotFound from '../../components/PageNotFound';

const AuthRoute = ({ component: C, props: cProps, path: cPath, userRole, ...rest }) => {
    if (cPath === "/" || cProps.IsAuthenticated === 'true') {
        if (userRole === "admin" && (cPath === "/devopstools" || cPath === "/pipelinedetails" || cPath === "/platformtools" || cPath === "/customtools" || cPath === "/platformstat" || cPath === '/pipelinestat' || cPath === "/manage" || cPath === "/manage-pvc" || cPath === "/ldapusers" || cPath === "/devnetops")) {
            return <Route {...rest} render={props => <C {...props} {...cProps} />} />
        } else if (userRole === "user" && (cPath === "/devopstools" || cPath === "/pipelinedetails" || cPath === "/platformtools" || cPath === "/customtools" || cPath === "/platformstat" || cPath === '/pipelinestat' || cPath === "/devnetops")) {
            return <Route {...rest} render={props => <C {...props} {...cProps} />} />
        } else {
            return <PageNotFound />
        }
    } else {
        return <PageNotFound />
    }
}

export default AuthRoute

