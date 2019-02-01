import { FETCH_CUSTOMERS_SUCCESS, FETCH_CUSTOMERS_FAILURE,
   ADD_CUSTOMER, EDIT_CUSTOMER, REMOVE_CUSTOMER } from '../constants';

export function fetchCustomers() {
    return dispatch => {
      return fetch('/api/customers', {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => (response.json()))
        .then(data => {
          dispatch(fetchCustomersSuccess(data));
          return data;
        })
        .catch(error =>
          dispatch(fetchCustomersFailure(error))
        );
    };
  }

  export function addCustomer(customer) {
    return dispatch => {
      fetch('/api/customers', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      })
        .then((response) => (response.json()))
        .then(data => {
          dispatch(addCustomerSuccess({ ...customer, id: data.id }));
          return data;
        })
        .catch(error =>
          dispatch(fetchCustomersFailure(error))
        );
    };
  }

  export function editCustomer(customer) {
    return dispatch => {
      fetch(`/api/customers/${customer.id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      })
        .then((response) => (response.json()))
        .then(data => {

          dispatch(editCustomerSuccess({ ...customer, id: data.id }));
          return data;
        })
        .catch(error =>
          dispatch(fetchCustomersFailure(error))
        );
    };
  }

  export function removeCustomer(id) {
    return dispatch => {
      fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })
        .then((response) => (response.json()))
        .then(data => {
          dispatch(removeCustomerSuccess(data.id));
          return data;
        })
        .catch(error =>
          dispatch(fetchCustomersFailure(error))
        );
    };
  }


export const fetchCustomersSuccess = customers => ({
  type: FETCH_CUSTOMERS_SUCCESS,
  payload: { customers }
});
  
export const fetchCustomersFailure = error => ({
  type: FETCH_CUSTOMERS_FAILURE,
  payload: { error }
});

export const addCustomerSuccess = customer => ({
  type: ADD_CUSTOMER,
  payload: { customer }
});

export const editCustomerSuccess = customer => ({
  type: EDIT_CUSTOMER,
  payload: { customer }
});

export const removeCustomerSuccess = id => ({
  type: REMOVE_CUSTOMER,
  payload: { id }
});