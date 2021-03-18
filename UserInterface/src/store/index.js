import { createStore, compose } from 'redux';

import rootReducer from './Reducers/RootReducer';

export default function storeConfig() {
    const composeEnhancers =
        (process.env.NODE_ENV !== 'production' &&
            typeof window !== 'undefined' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
        compose;
    const enhancer = composeEnhancers();
    const store = createStore(rootReducer(), enhancer);
    store.asyncReducers = {};

    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer;
        store.replaceReducer(rootReducer(store.asyncReducers));
    };

    return store;
}

export const store = storeConfig();
