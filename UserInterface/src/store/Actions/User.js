import { USERROLE } from '../Types/ActionTypes';


export const setUserRole = (userrole) => {
    return {
        type: USERROLE,
            userrole
    }
}