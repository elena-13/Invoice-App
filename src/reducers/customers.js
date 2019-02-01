import { FETCH_CUSTOMERS_SUCCESS, FETCH_CUSTOMERS_FAILURE,
   ADD_CUSTOMER, EDIT_CUSTOMER, REMOVE_CUSTOMER } from '../constants';

const initialState = {
    items: [],
    error: null
  };

const customers = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_CUSTOMERS_SUCCESS: {
      return { ...state,
            items: payload.customers,
        };
    }
    case FETCH_CUSTOMERS_FAILURE: {
        return { ...state,
            error: payload.error,
            items: [],
        };
      }
    case ADD_CUSTOMER: {
      return { ...state,
        items: [...state.items, payload.customer],
      };
    }
    case EDIT_CUSTOMER: {
      return { ...state,
        items: state.items.map(item => item.id === payload.customer.id ?
          { ...payload.customer } : item)
      };
    }
    case REMOVE_CUSTOMER: {
      return { ...state,
        items: state.items.filter(item => item.id !== payload.id) 
      };
    }
    default:
      return state;
  }
};


export default customers;
