/* eslint react/prop-types: 0 */
import React from 'react';
import { Provider } from 'react-redux';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import {store} from '../store/index';
import RoutingModule from '../components/RoutingModule';
import { getCookie } from '../helpers/Local/Cookies';
import { encryptionAlgorithm, decryptionAlgorithm, Base64EncodeUrl, Base64DecodeUrl } from '../helpers/helperFunction'
import { Buffer } from 'buffer'

import 'core-js/features/object/assign';



export const client = new ApolloClient({
    uri: `${process.env.PLATFORM_URL}/graphql`,
    request: async (operation) => {
        const token = getCookie('AuthToken') === undefined ? '' : getCookie('AuthToken')
        let encToken = Base64DecodeUrl(token)
        encToken = encryptionAlgorithm(encToken)
        operation.setContext({
            headers: {
                "Authorization": "JWT ".concat(encToken)
            }
        });
    }
});

const App = () => {
    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                <RoutingModule />
            </ApolloProvider>
        </Provider>
    );
};

export default App;