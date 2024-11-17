import { compose, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import logger from "redux-logger";
import {rootReducer} from './root-reducer';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];
const composeEnhancers = composeWithDevTools(applyMiddleware(...middlewares))


export const store = createStore(rootReducer, undefined,composeEnhancers)   
sagaMiddleware.run(rootSaga); 