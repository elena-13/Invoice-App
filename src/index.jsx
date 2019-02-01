import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import 'react-select/dist/react-select.css';
import App from './App';

import Invoices from './containers/Invoices/Invoices';
import Invoice from './containers/Invoices/Invoice';
import Products from './containers/Products/Products';
import Customers from './containers/Customers/Customers';

render(
    <Provider store={store}>
        <BrowserRouter>
            <App>
                <Switch>
                    <Route exact path='/' component={Invoices}/>
                    <Route path='/invoices/:id/edit' component={Invoice}/>
                    <Route path='/products' component={Products}/>
                    <Route path='/customers' component={Customers}/>
                </Switch>
            </App>
        </BrowserRouter>
    </Provider>, 
    document.getElementById('app-root'));