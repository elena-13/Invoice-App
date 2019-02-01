import { FETCH_INVOICES_SUCCESS, FETCH_INVOICES_FAILURE,
  ADD_INVOICE, FETCH_CURRENT_INVOICE_SUCCESS,
  REMOVE_INVOICE, EDIT_INVOICE } from '../constants';

export function fetchInvoices() {
    return async dispatch => {
      return fetch('/api/invoices', {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => (response.json()))
        .then(data => {
          dispatch(fetchInvoicesSuccess(data));
          return data;
        })
        .catch(error =>{
          dispatch(fetchInvoicesFailure(error))
        }
        );
    };
  }

  async function getAllInvoiceItems(id) {
    let res = [];
    await fetch(`/api/invoices/${id}/items`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => (response.json()))
      .then(data => {
        res = data;
      }).catch(error =>{
        dispatch(fetchInvoicesFailure(error))
      });
      return res;
  }

export function fetchCurrentInvoice(id) {
  return async dispatch => {
    return fetch(`/api/invoices/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => (response.json()))
      .then(data => {
        return (async () => {
          const items = await getAllInvoiceItems(id);
          await dispatch(fetchCurrentInvoiceSuccess({ ...data, products: items }));
        })();
      })
      .catch(error =>{
        dispatch(fetchInvoicesFailure(error))
      }
      );
  };
}

async function addInvoiceItem(invoiceItem, invoiceId) {
  return fetch(`/api/invoices/${invoiceId}/items`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoiceItem),
  })
    .catch(error => { throw error});
}

async function removeInvoiceItem(invoiceItem, invoiceId) {
  return fetch(`/api/invoices/${invoiceId}/items/${invoiceItem.id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoiceItem),
  })
  .catch(error => {throw error});
}

async function editInvoiceItem(invoiceItem, invoiceId) {
  return fetch(`/api/invoices/${invoiceId}/items/${invoiceItem.id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoiceItem),
  })
    .catch(error => { throw error});
}

async function addAllInvoiceItems({ products }, id) {
  products.forEach((item) => {
    addInvoiceItem(item, id);
  });
}

export function addInvoice(invoice) {
  return dispatch => {
    fetch('/api/invoices', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    })
      .then((response) => (response.json()))
      .then(data => {
        return (async () => {
          await dispatch(addInvoiceSuccess({ ...invoice, id: parseInt(data.id) }));
          await addAllInvoiceItems(invoice, parseInt(data.id));
        })();
      })
      .catch(error => dispatch(fetchInvoicesFailure(error)));
  };
}

function editAllInvocesItems(productData, id) {
  productData.forEach((item) => {
    if (item.actionType === 'EDIT') {
      editInvoiceItem(item.data, id);
      return;
    }
    if (item.actionType === 'ADD') {
      addInvoiceItem(item.data, id);
      return;
    }
    if (item.actionType === 'REMOVE') {
      removeInvoiceItem(item.data, id);
      return;
    }
  });
}

export function editInvoice(patches, id) {
  return dispatch => {
    const { mainData, productData } = patches;

    if (mainData.actionType === 'EDIT') {
      fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mainData.data),
      })
        .then((response) => (response.json()))
        .then(data => { 
          dispatch(editInvoiceSuccess(data));
          return data;
        })
    }
    try{
      editAllInvocesItems(productData, id);
    }
    catch(error){
      dispatch(fetchInvoicesFailure(error));
    }   
    
  };
}

export function removeInvoice(id) {
  return dispatch => {
    fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    })
      .then((response) => (response.json()))
      .then(data => {
        dispatch(removeInvoicesrSuccess(data.id));
        return data;
      })
      .catch(error =>
        dispatch(fetchInvoicesFailure(error))
      );
  };
}


export const fetchCurrentInvoiceSuccess = invoice => ({
  type: FETCH_CURRENT_INVOICE_SUCCESS,
  payload: { invoice }
});

export const fetchInvoicesSuccess = invoices => ({
  type: FETCH_INVOICES_SUCCESS,
  payload: { invoices }
});
  
export const fetchInvoicesFailure = error => ({
  type: FETCH_INVOICES_FAILURE,
  payload: { error }
});

export const addInvoiceSuccess = invoice => ({
  type: ADD_INVOICE,
  payload: { invoice }
});

export const editInvoiceSuccess = invoice => ({
  type: EDIT_INVOICE,
  payload: { invoice }
});

export const removeInvoicesrSuccess = id => ({
  type: REMOVE_INVOICE,
  payload: { id }
});