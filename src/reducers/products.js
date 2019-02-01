import { FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE, 
  ADD_PRODUCT, EDIT_PRODUCT, REMOVE_PRODUCT } from '../constants';

const initialState = {
    items: [],
    error: null
  };

const products = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_PRODUCTS_SUCCESS: {
      return {...state,
            items: payload.products,
        };
    }
    case FETCH_PRODUCTS_FAILURE: {
        return {...state,
            error: payload.error,
            items: [],
        };
      }
    case ADD_PRODUCT: {
      return { ...state,
        items: [...state.items, payload.product],
      };
    }
    case EDIT_PRODUCT: {
      return { ...state,
        items: state.items.map(item => item.id === payload.product.id ?
          { ...payload.product } : item)
      };
    }
    case REMOVE_PRODUCT: {
      return { ...state,
        items: state.items.filter(item => item.id !== payload.id) 
      };
    }
    default:
      return state;
  }
};


export default products;
