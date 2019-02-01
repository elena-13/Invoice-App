import { FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE, 
  ADD_PRODUCT, EDIT_PRODUCT, REMOVE_PRODUCT } from '../constants';

export function fetchProducts() {
    return dispatch => {
      fetch('/api/products', {
        method: 'get',
        credentials: 'include',
      })
        .then((response) => (response.json()))
        .then(data => {
          dispatch(fetchProductsSuccess(data));
          return data;
        })
        .catch(error =>
          dispatch(fetchProductsFailure(error))
        );
    };
  }

export function addProduct(product) {
  return dispatch => {
    fetch('/api/products', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => (response.json()))
      .then(data => {
        dispatch(addProductsSuccess({ ...product, id: data.id }));
        return data;
      })
      .catch(error =>
        dispatch(fetchProductsFailure(error))
      );
  };
}

export function editProduct(product) {
  return dispatch => {
    fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => (response.json()))
      .then(data => {
        dispatch(editProductsSuccess({ ...product, id: data.id }));
        return data;
      })
      .catch(error =>
        dispatch(fetchProductsFailure(error))
      );
  };
}

export function removeProduct(id) {
  return dispatch => {
    fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
      .then((response) => (response.json()))
      .then(data => {
        dispatch(removeProductsSuccess(data.id));
        return data;
      })
      .catch(error =>
        dispatch(fetchProductsFailure(error))
      );
  };
}

export const fetchProductsSuccess = products => ({
    type: FETCH_PRODUCTS_SUCCESS,
    payload: { products }
});
  
export const fetchProductsFailure = error => ({
    type: FETCH_PRODUCTS_FAILURE,
    payload: { error }
});

export const addProductsSuccess = product => ({
  type: ADD_PRODUCT,
  payload: { product }
});

export const editProductsSuccess = product => ({
  type: EDIT_PRODUCT,
  payload: { product }
});

export const removeProductsSuccess = id => ({
  type: REMOVE_PRODUCT,
  payload: { id }
});