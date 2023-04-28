import {combineReducers, createStore, compose} from 'redux';
import contractReducer from '../reducer/contract';
import ipfsReducer from '../reducer/ipfs';
import thunk from 'redux-thunk';
import {applyMiddleware} from "redux";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({contractReducer, ipfsReducer});

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;