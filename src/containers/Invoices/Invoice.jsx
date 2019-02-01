import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { Grid, Row, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';

import Title from '../../components/title/title';
import { TABS_TITLE } from '../../data/TABS_TITLE';
import ContentTable from '../../components/content-table/content-table';

import { fetchCustomers } from '../../actions/customerActions';
import { fetchProducts } from '../../actions/productActions';
import { addInvoice, fetchInvoices, fetchCurrentInvoice, editInvoice } from '../../actions/invoiceActions';

import ErrorHOC from '../../HOC/errorHOC';

import './invoice-style.css';

const TABLE_FIELDS = ['name', 'price', 'qty'];
const TABLE_TITLES = ['Name', 'Price', 'Qty', ''];

class Invoice extends Component {
    state = {
        data: {
            discount: 0,
            productList: [],
        },
        selectedCustomer: null,
        selectedProduct: null,
      }

    componentDidMount() {
        const { fetchCustomers, fetchProducts, fetchInvoices, fetchCurrentInvoice,
              match: {params: { id } } } = this.props;
        fetchCustomers();
        fetchProducts();
        document.title = `Invoice App | ${TABS_TITLE.invoice.create}`;
        if (id !== 'create') {
            document.title = `Invoice App | ${TABS_TITLE.invoice.edit}`;
            (async () => {
                await fetchInvoices();
                await fetchCurrentInvoice(id);
                const { currentInvoice, customers, products} = this.props;
                const customer = customers.filter((item)=>(item.id == currentInvoice.customer_id))[0];
                const productList = currentInvoice.products.map((item)=>{
                    const product = products.filter((prod)=>(item.product_id === prod.id))[0];
                    return { ...product, qty: item.quantity, id: item.id };
                })
                const discount = currentInvoice.discount;
                this.setState({
                    data: { discount, productList },
                    selectedCustomer: {value: customer.id, label: customer.name },
                    selectedProduct: null,
                });
            })();
        }
    }

    handleCustomerChange = (selectedCustomer) => {
        this.setState({ selectedCustomer });
    }

    handleProductChange = (selectedProduct) => {
        this.setState({ selectedProduct });
    }

    handleDiscountChange = ({ target: { value } }) => {
        this.setState(({ data }) => ({ data: { ...data, discount: value } }));
    }

    handleQtyChange = (value, idx) => {
        const { data: { productList } } = this.state;

        productList[idx].qty = value;
        this.setState(({ data }) => ({ data: { ...data, productList: 
            [ ...productList ]
         } }));
    }

    handleRemoveProduct = (id) => {
        const { data: { productList } } = this.state;

        this.setState(({ data }) => ({ data: { ...data, productList: 
            productList.filter((item) => (item.id !== id))
         } }));
    }

    handleAddProduct = () => {
        const { selectedProduct, data: { productList } } = this.state;
        const duplicateIdx = productList.reduce((found, curr, idx) => 
        (found || (curr.product_id === selectedProduct.value.id ? idx + 1 : null)), null);
   
        if (duplicateIdx) {
            productList[duplicateIdx - 1].qty++;
            this.setState(({ data }) => ({ data: { ...data, productList: 
                [ ...productList ]
             } }));
            return;
        }
        this.setState(({ data }) => ({ data: { ...data, productList: 
            [ ...data.productList, { 
                id: new Date().getTime(),
                name: selectedProduct.label,
                price: selectedProduct.value.price,
                product_id: selectedProduct.value.id,
                qty: 1 }]
         } }))
    }

    getTotal = () => {
        const { data: { productList, discount } } = this.state;
        const total = productList.reduce((sum, { price, qty }) => (price * qty + sum), 0);

        return Math.round((total - total * (discount/100)) * 100)/100;
    }

    getPatches(oldInvoice, invoice) {
        const UNCHANGED = 'UNCHANGED';
        const REMOVE = 'REMOVE';
        const ADD = 'ADD';
        const EDIT = 'EDIT';
        let mainData = { actionType: UNCHANGED , data: null };
        if (oldInvoice.customer_id !== invoice.customer_id
            || oldInvoice.total !== invoice.total
            || oldInvoice.discount !== invoice.discount) {
                mainData.actionType = EDIT;
                mainData.data = invoice;
        }
        let productData = oldInvoice.products.map(
            (product) => ({ actionType: UNCHANGED , data: { id: product.id } }));
        for (let i = 0; i < oldInvoice.products.length; i++) {
            let current = oldInvoice.products[i];
            let found = invoice.products.find((product)=>(product.id === current.id));
            if (!found) {
                productData[i].actionType = REMOVE;
                continue;
            }
            if (current.quantity !== found.quantity) {
                productData[i].actionType = EDIT;
                productData[i].data = found;
            } 
        }
        invoice.products.forEach((product) => {
            let found = oldInvoice.products.find((p)=>(p.id === product.id));
            if (!found){
                productData.push({ actionType: ADD , data: product });
            }
        });
        return {mainData, productData};
    }

    editInvoice = () => {
        const { editInvoice, history, match: {params: { id } }, currentInvoice} = this.props;

        const { data: { discount, productList}, selectedCustomer: { value } } = this.state;
        const products = productList.map((item) => ({ id: item.id, product_id: item.product_id, quantity: item.qty }));
        let newInvoice = { discount, products, customer_id: value, total: this.getTotal() };
       editInvoice(this.getPatches(currentInvoice, newInvoice), id);
       history.push('/');
    }

    addInvoice = () => {

        const { addInvoice, history, match: {params: { id } }} = this.props;
        if (id !== 'create') return this.editInvoice();
            
        const { data: { discount, productList}, selectedCustomer: { value } } = this.state;
        const products = productList.map((item) => ({ product_id: item.product_id, quantity: item.qty }));

        addInvoice({ discount, products, customer_id: value, total: this.getTotal() });
        history.push('/');
    }

    render() {
        const { selectedCustomer, selectedProduct, data } = this.state;
        const { customers, products,  match: {params: { id } } } = this.props;
        return(
            <Grid>
            <Row>
                <Col md={12} >
                {(id !== 'create') ? <Title title={TABS_TITLE.invoice.edit}/>
                : <Title title={TABS_TITLE.invoice.create}/>}
                </Col>
            </Row>
            <Row>
                <Col md={6} sm={12} >
                    <div className="wrapp-input">
                        <ControlLabel>Discount (%)</ControlLabel>
                        <FormControl
                            type="text"
                            value={data.discount}
                            placeholder="Enter discount"
                            onChange={this.handleDiscountChange}
                        />
                    </div>
                    <div className="wrapp-input">
                        <ControlLabel>Customer</ControlLabel>
                        <Select
                            value={selectedCustomer}
                            onChange={this.handleCustomerChange}
                            options={customers.map((item) => (
                                { value: item.id, label: item.name }
                            ))}
                        />
                    </div>
                    <div className="wrapp-input">
                    <Row className="bottom">  
                        <Col md={10} sm={6} xs={6}>
                            <ControlLabel>Add Product</ControlLabel>
                                <Select
                                    value={selectedProduct}
                                    onChange={this.handleProductChange}
                                    options={products.map((item) => (
                                        { value: { id: item.id, price: item.price }, label: item.name }
                                    ))}
                                />
                        </Col>
                        <Col md={2} sm={6} xs={6}>
                            {!!selectedProduct 
                            ? <Button bsSize="sm" block  onClick={this.handleAddProduct}>Add</Button>
                            : <Button bsSize="sm" block disabled onClick={this.handleAddProduct}>Add</Button>}
                        </Col>
                    </Row> 
                    </div>
                </Col>
            </Row>
            <ContentTable 
                titles={TABLE_TITLES} 
                isInvoice={true}
                removeOnClick={this.handleRemoveProduct}
                changeQty={this.handleQtyChange}
                dataList={data.productList} 
                fields={TABLE_FIELDS}/>
            <Row className="center">
                <Col md={6}>
                    <h1>Total: {this.getTotal()}</h1>
                </Col>
                <Col md={6} className="align-right">
                    <Button bsSize="lg" 
                        bsStyle="primary" 
                        onClick={this.addInvoice}>Save</Button>
                </Col>
            </Row>
            </Grid>
        )
    }
}

Invoice = ErrorHOC('error')(Invoice);

const mapStateToProps = state => ({
    customers: state.customers.items,
    products: state.products.items,
    invoices : state.invoices.items,
    currentInvoice : state.invoices.item,
    error: state.products.error,
});

const mapDispatchToProps = dispatch => ({
    fetchCustomers: () => dispatch(fetchCustomers()),
    fetchProducts: () => dispatch(fetchProducts()),
    addInvoice: (data) => dispatch(addInvoice(data)),
    fetchInvoices: (id) => dispatch(fetchInvoices(id)),
    fetchCurrentInvoice: (id) => dispatch(fetchCurrentInvoice(id)),
    editInvoice: (data, id) => dispatch(editInvoice(data, id)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);