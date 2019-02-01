import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Row, Col } from 'react-bootstrap';

import { fetchProducts, addProduct, editProduct, removeProduct } from '../../actions/productActions';

import Title from '../../components/title/title';
import { TABS_TITLE } from '../../data/TABS_TITLE';
import ContentTable from '../../components/content-table/content-table';
import ModalWindow from '../ModalWindows/Modal';
import ProductModalContent from '../ModalWindows/ProductContent';

import ErrorHOC from '../../HOC/errorHOC';

import './product.css';


const TABLE_FIELDS = ['name', 'price'];
const TABLE_TITLES = ['#', 'Name', 'Price', '', ''];


class Products extends Component {

    state = {
        data: {
            id: '',
            name: '',
            price: ''
        },
        showCreateModal: false,
        showEditModal: false,
        showRemoveModal: false,
    }

    componentDidMount() {
        document.title = `Invoice App | ${TABS_TITLE.products}`;
        const { fetchProducts } = this.props;
        fetchProducts();
    }

    handleCreateModalToggle = () => {
        this.setState((prev) => ({ showCreateModal: !prev.showCreateModal }))
    }

    handleEditModalToggle = (data) => {
        this.setState((prev) => ({ 
            data: { ...data },
            showEditModal: !prev.showEditModal }))
    }

    handleRemoveModalToggle = (id) => {
        this.setState((prev, data) => ({
            data: { ...data, id: id }, showRemoveModal: !prev.showRemoveModal
        }))
    }

    handleNameChange = ({ target: { value } }) => {
        this.setState(({data}) => ({ data: { ...data, name: value } }))
    }

    handlePriceChange = ({ target: { value } }) => {
        this.setState(({data}) => ({ data: { ...data, price: value } }))
    }

    createProduct = () => {
        const { addProduct } = this.props;
        const { data } = this.state;

        addProduct({ ...data });
        this.handleCreateModalToggle();
    }

    editProduct = (data) => {
        const { editProduct } = this.props;

        editProduct({ ...data });
        this.handleEditModalToggle(data);
    }
    
    removeProduct = (id) => {
        const { removeProduct } = this.props;
       
        removeProduct(id);
        this.handleRemoveModalToggle(id);
    }

    render() {
        const { products } = this.props;
        const { showCreateModal, showEditModal, showRemoveModal, data } = this.state;

        return (
            <Grid> 
                <ModalWindow 
                    show={showCreateModal} 
                    title='Create product'
                    handleHide={this.handleCreateModalToggle} 
                    handleApply={this.createProduct}
                    container={this}>
                    <ProductModalContent
                        data={data}
                        nameOnClick={this.handleNameChange}
                        priceOnClick={this.handlePriceChange}
                        />
                </ModalWindow> 
                <ModalWindow 
                    show={showEditModal} 
                    title='Edit product'
                    handleHide={this.handleEditModalToggle} 
                    handleApply={()=>{this.editProduct(data)}}
                    container={this}>
                    <ProductModalContent
                        data={data}
                        nameOnClick={this.handleNameChange}
                        priceOnClick={this.handlePriceChange}
                        />
                </ModalWindow> 
                <ModalWindow 
                    show={showRemoveModal} 
                    role='remove'
                    title='Remove product'
                    handleHide={this.handleRemoveModalToggle} 
                    handleApply={()=>{this.removeProduct(data.id)}}
                    container={this}>
                    <p>Are you sure you want to delete the item?</p>
                </ModalWindow> 
                <Row className="center">
                    <Col md={2} >
                        <Title title={TABS_TITLE.products}/>
                    </Col>
                    <Col md={10}>
                        <Button bsSize="sm" onClick={this.handleCreateModalToggle}>Create</Button>
                    </Col>
                </Row>
                <ContentTable 
                    titles={TABLE_TITLES} 
                    dataList={products} 
                    fields={TABLE_FIELDS}
                    editOnClick={this.handleEditModalToggle}
                    removeOnClick={this.handleRemoveModalToggle} />
            </Grid>
        )
    }
}

Products = ErrorHOC('error')(Products);

const mapStateToProps = state => ({
    products: state.products.items,
    error: state.products.error,
  });

const mapDispatchToProps = dispatch => ({
    fetchProducts: () => dispatch(fetchProducts()),
    addProduct: (data) => dispatch(addProduct({ ...data })),
    editProduct: (data) => dispatch(editProduct({ ...data })),
    removeProduct: (id) => dispatch(removeProduct(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);