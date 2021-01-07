
import { LOCATION } from '../constants';

const initialState = { 
    location:{}
};

const common = (state = initialState, action) => {
    switch (action.type) {
    case LOCATION:
        return {
            ...state,
            location: action.value
        };       
    default:
        return state;
    }
};
    
export default common;
