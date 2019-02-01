import { FETCH_INVOICES_SUCCESS, FETCH_INVOICES_FAILURE,
  ADD_INVOICE, EDIT_INVOICE, REMOVE_INVOICE, FETCH_CURRENT_INVOICE_SUCCESS} from '../constants';

const initialState = {
    items: [],
    error: null
  };

const invoices = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_INVOICES_SUCCESS: {
      return {...state,
            items: payload.invoices,
        };
    }
    case FETCH_INVOICES_FAILURE: {
        return {...state,
            error: payload.error,
            items: [],
        };
      }
    case ADD_INVOICE: {
      return {...state,
        items: [...state.items, payload.invoice],
      };
    }
    case FETCH_CURRENT_INVOICE_SUCCESS: {
      return {...state,
        item: payload.invoice,
      };
    }
    case REMOVE_INVOICE: {
      return { ...state,
        items: state.items.filter((item) => (item.id !== payload.id))
      };
    }
    case EDIT_INVOICE: {
      const itemIdx = state.items.reduce((found, curr, idx) => 
      (found || (curr.id === payload.invoice.id ? idx + 1 : null)), null);
      state.items[itemIdx - 1] = payload.invoice;
      return { ...state,
        items: state.items,
      };
    }
    default:
      return state;
  }
};


export default invoices;
