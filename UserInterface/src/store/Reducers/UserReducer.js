import { USERROLE } from '../Types/ActionTypes';
import { cookies } from '../../helpers/Local/Cookies';

const InitialState = {
    userrole: cookies.get("userrole")
}

const UserReducer = (state = InitialState, action) => {
    switch (action.type) {
        case USERROLE:
            return ({ userrole: action.userrole })
        default:
            return state
    }
}

export default UserReducer;