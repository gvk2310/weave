import { combineReducers, createStore, applyMiddleware } from "redux";
import {userDataReducer, serviceReducer} from "../reducer/login.js";
import logger from 'redux-logger'

export default createStore(combineReducers({user:userDataReducer, services:serviceReducer}),{},applyMiddleware(logger));

