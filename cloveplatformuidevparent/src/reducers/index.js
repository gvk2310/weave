import { combineReducers } from 'redux';

import commonReducer from './common';

// export default combineReducers({
//     common: commonReducer
// });

export default function createReducer(asyncReducers) {
    return combineReducers({
        common: commonReducer,
        ...asyncReducers
    });
}