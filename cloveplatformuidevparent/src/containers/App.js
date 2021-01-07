import React, { Fragment, useState } from 'react';
import { Provider } from 'react-redux';
import { getCookie } from '../helpers/Local/Cookies';

import { store } from '../store';

import '../css/fonts/Graphik-Black-Web.eot';
import '../css/fonts/Graphik-Black-Web.woff';
import '../css/fonts/Graphik-BlackItalic-Web.eot';
import '../css/fonts/Graphik-BlackItalic-Web.woff';
import '../css/fonts/Graphik-Bold-Web.eot';
import '../css/fonts/Graphik-Bold-Web.woff';
import '../css/fonts/Graphik-BoldItalic-Web.eot';
import '../css/fonts/Graphik-BoldItalic-Web.woff';
import '../css/fonts/Graphik-Light-Web.eot';
import '../css/fonts/Graphik-LightItalic-Web.eot';
import '../css/fonts/Graphik-LightItalic-Web.woff';
import '../css/fonts/Graphik-Medium-Web.eot';
import '../css/fonts/Graphik-Medium-Web.woff';
import '../css/fonts/Graphik-MediumItalic-Web.eot';
import '../css/fonts/Graphik-MediumItalic-Web.woff';
import '../css/fonts/Graphik-Regular-Web.eot';
import '../css/fonts/Graphik-Regular-Web.woff';
import '../css/fonts/Graphik-RegularItalic-Web.eot';
import '../css/fonts/Graphik-RegularItalic-Web.woff';
import '../css/fonts/Graphik-Semibold-Web.eot';
import '../css/fonts/Graphik-Semibold-Web.woff';
import '../css/fonts/Graphik-SemiboldItalic-Web.eot';
import '../css/fonts/Graphik-SemiboldItalic-Web.woff';

import '../css/bootstrap.min.css';
import '../css/style.css';
import '../css/common_parent.css';

import RoutingModule from '../components/RoutingModule';

function App() {
    const [IsAuthenticated, setIsAuthenticated] = useState(getCookie('IsAuthenticated'));

    const userHasAuthenticated = (receivedvalue) => {
        setIsAuthenticated(receivedvalue)
    }

    let childprops = {
        IsAuthenticated,
        userHasAuthenticated
    }

    return (
        <Fragment>
            <div className="myw-wrapper container-fluid myw-sticky">
                <Provider store={store}>
                    <RoutingModule store={store} childprops={childprops} />
                </Provider>
            </div>
        </Fragment>
    );

}

export default App;