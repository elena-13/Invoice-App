import { createStore, compose, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import rootReducer from './reducers/index';

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const configureStore = preloadedState => (
  createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk)),
    // preloadedState,
  )
);

const store = configureStore({});

export default store;
