import { LOGIN_USER, SEND_SERVICES, SEND_ROLES } from "../action/login.js";

export const userDataReducer = (state=[], action) => {
    switch(action.type) {
        case LOGIN_USER:
          state=action.payload;
          break;
         default: 
           break;
     }
     return state;
}
export const serviceReducer = (state=[], action) => {
  console.log('inside reducer');
  switch(action.type) {
      case SEND_SERVICES:
        state=action.payload;
        break;
       default: 
         break;
   }
   return state;
}

export const roleReducer = (state=[], action) => {
  switch(action.type) {
      case SEND_ROLES:
        state=action.payload;
        break;
       default: 
         break;
   }
   return state;
}

//export default userDataReducer;