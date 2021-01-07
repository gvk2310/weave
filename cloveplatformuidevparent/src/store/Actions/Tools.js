import { CORETOOLSDETAILS, NONCORETOOLSDETAILS, CUSTOMTOOLDETAILS, CARTRIDGES, TOOLS_ORDER_ID, CARTRIDGE_ORDER_ID } from '../Types/ActionTypes';


export const setCoreToolsDetails = (coretoolsdetails) => {
    return {
        type: CORETOOLSDETAILS,
            coretoolsdetails
    }
}

export const setNonCoreToolsDetails = (noncoretoolsdetails) => {
    return {
        type: NONCORETOOLSDETAILS, 
            noncoretoolsdetails
        
    }
}

export const setCustomToolDetails = (customtooldetails) => {
    return {
        type: CUSTOMTOOLDETAILS,
            customtooldetails
    }
}

export function setToolsOrderId(Tools_Order_Id) {
    return { type: TOOLS_ORDER_ID, 
        Tools_Order_Id
    }
}

export const setcartridgeOrderId = (cartridge_Order_Id) => {
    return {
        type: CARTRIDGE_ORDER_ID,
            cartridge_Order_Id
    }
}


export const setCartridgeData = (cartridgedetails) => {
    return {
        type: CARTRIDGES,
            cartridgedetails
    }
}