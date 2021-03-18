import {CARTRIDGES,CARTRIDGE_ORDER_ID} from '../Types/ActionTypes'


const InitialState = {
    cartridge_Order_Id : null,
    cartridgedetails : []
}


 const CartridgeDetails = (state = InitialState,action)=>{
     switch(action.type){
         case CARTRIDGES:
             return ({...state,cartridgedetails:action.cartridgedetails})
         case CARTRIDGE_ORDER_ID:
             return({...state,cartridge_Order_Id:action.cartridge_Order_Id})
         default:
             return state;
     }
 }

 export default CartridgeDetails;