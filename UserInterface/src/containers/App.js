/* eslint react/prop-types: 0 */
import React from 'react';
import { Provider } from 'react-redux';
import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';
import { ApolloProvider } from 'react-apollo';
import axios from 'axios';
import {store} from '../store/index';
import RoutingModule from '../components/RoutingModule';
import { getCookie } from '../helpers/Local/Cookies';
import 'core-js/features/object/assign';

export const client = new ApolloClient({
    uri: `${process.env.REACT_APP_PLATFORM_URL}/gqlapi/graphql`,
    request: async (operation) => {
        const token = getCookie('AuthToken') === undefined ? '' : getCookie('AuthToken')
        operation.setContext({
            headers: {
                "Authorization": "JWT ".concat(token)
            }
        });
    }
});

const App = ({ storeremote }) => {

    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                <RoutingModule />
            </ApolloProvider>
        </Provider>
    );
};

export default App;