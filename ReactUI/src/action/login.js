export const LOGIN_USER = 'LOGIN_USER'; // action types
export const SEND_SERVICES = 'SEND_SERVICES';
export const SEND_ROLES = 'SEND_ROLES'

console.log("triggered");
export const loginUser = (payload) => ({       
        type: LOGIN_USER,
        payload: payload,     // action payload     
})

export const sendCollectedServices = (service) => ({       
        type: SEND_SERVICES,
        payload: service,     // action payload     
})

export const sendCollectedRoles = (role) => ({       
        type: SEND_ROLES,
        payload: role,     // action payload     
})