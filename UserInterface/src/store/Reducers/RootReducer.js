import { combineReducers } from 'redux';
import ToolsDetails from './ToolsDetailsReducer';
import CartridgeDetails from './CartridgeReducer';
import PipelineDetails from './PipelineReducer';

import UserReducer from './UserReducer'

export default function rootReducer(asyncReducers) {
  return combineReducers({
    ToolsDetails,
    CartridgeDetails,
    UserReducer,
    PipelineDetails,
    ...asyncReducers
  })
}

