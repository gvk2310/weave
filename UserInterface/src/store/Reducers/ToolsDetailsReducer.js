import {CORETOOLSDETAILS,NONCORETOOLSDETAILS,CUSTOMTOOLDETAILS,TOOLS_ORDER_ID} from '../Types/ActionTypes'


const InitialState = {
    Tools_Order_Id : null,
    coretoolsdetails : [],
    noncoretoolsdetails :[],
    customtooldetails: []
}


 const ToolsDetails = (state = InitialState,action)=>{
     switch(action.type){
         case CORETOOLSDETAILS :
             return ({...state,coretoolsdetails:action.coretoolsdetails})
         case TOOLS_ORDER_ID:
              return{...state,Tools_Order_Id:action.Tools_Order_Id}
         case NONCORETOOLSDETAILS:
            return({...state,noncoretoolsdetails:action.noncoretoolsdetails})
         case CUSTOMTOOLDETAILS:
             return({...state,customtooldetails:action.customtooldetails})
         default:
             return state;
     }
 }

 export default ToolsDetails ;