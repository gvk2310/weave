// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk'; // we can use redux-saga also
// import logger from 'redux-logger';

// import rootReducer from '../reducers';

// const middleware = applyMiddleware(thunk, logger);

// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//     rootReducer,
//     reduxDevTools(
//         middleware
//     )
// );

// export default store;

import { createStore, compose } from 'redux';

import createReducer from '../reducers';
  
/**
 * Cf. redux docs:
 * https://redux.js.org/recipes/code-splitting/#defining-an-injectreducer-function
 */
export default function configureStore() {
    const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

    const enhancer = composeEnhancers();
    const store = createStore(createReducer(), enhancer);

    store.asyncReducers = {};

    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer;
        store.replaceReducer(createReducer(store.asyncReducers));
    };

    return store;
}

export const store = configureStore();

