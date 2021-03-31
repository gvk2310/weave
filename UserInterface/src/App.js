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
    uri: `${process.env.REACT_APP_PLATFORM_URL}/graphql`,
    request: async (operation) => {
        let url_key = Base64DecodeUrl(`${process.env.MYWD_KEY}`)
        let aes_key = new Buffer.from(url_key, 'base64').toString('ascii')
        const token = getCookie('AuthToken') === undefined ? '' : getCookie('AuthToken')
        const base64dec = Base64DecodeUrl(token)
        const encToken = encryptionAlgorithm(base64dec, aes_key)
        operation.setContext({
            headers: {
                "Authorization": "JWT ".concat(encToken)
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
