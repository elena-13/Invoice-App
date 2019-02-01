import { combineReducers } from 'redux';

import products from './products';
import customers from './customers';
import invoices from './invoices';

const rootReducer = combineReducers({
    products,
    customers,
    invoices,
  });
  
  export default rootReducer;