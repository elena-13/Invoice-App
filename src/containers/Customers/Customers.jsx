import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Row, Col } from 'react-bootstrap';

import { fetchCustomers, addCustomer, editCustomer, removeCustomer } from '../../actions/customerActions';

import Title from '../../components/title/title';
import { TABS_TITLE } from '../../data/TABS_TITLE';
import ContentTable from '../../components/content-table/content-table';
import ModalWindow from '../ModalWindows/Modal';
import CustomerModalContent from '../ModalWindows/CustomeContent';

import ErrorHOC from '../../HOC/errorHOC';

const TABLE_FIELDS = ['name', 'address', 'phone', 'button'];
const TABLE_TITLES = ['#', 'Name', 'Address', 'Phone', '', ''];

class Customers extends Component {

    state = {
        data: {
            id: '',
            name: '',
            address: '',
            phone: ''
        },
        showCreateModal: false,
        showEditModal: false,
        showRemoveModal: false,
    }

    componentDidMount() {
        document.title = `Invoice App | ${TABS_TITLE.customers}`;
        const { fetchCustomers } = this.props;
        fetchCustomers();
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

    handleAddressChange = ({ target: { value } }) => {
        this.setState(({data}) => ({ data: { ...data, address: value } }))
    }

    handlePhoneChange = ({ target: { value } }) => {
        this.setState(({data}) => ({ data: { ...data, phone: value } }))
    }

    createCustomer = () => {
        const { addCustomer } = this.props;
        const { data } = this.state;

        addCustomer({ ...data });
        this.handleCreateModalToggle();
    }

    editCustomer = (data) => {
        const { editCustomer } = this.props;

        editCustomer({ ...data });
        this.handleEditModalToggle();
    }
    
    removeCustomer = (id) => {
        const { removeCustomer } = this.props;
       
        removeCustomer(id);
        this.handleRemoveModalToggle();
    }

    render() {
        let { customers } = this.props;
        const { showCreateModal, showEditModal, showRemoveModal, data } = this.state;

        return (
            <Grid>
                <ModalWindow 
                    show={showCreateModal} 
                    title='Create customer'
                    handleHide={this.handleCreateModalToggle} 
                    handleApply={this.createCustomer}
                    container={this}>
                    <CustomerModalContent
                        data={data}
                        nameOnClick={this.handleNameChange}
                        addressOnClick={this.handleAddressChange}
                        phoneOnClick={this.handlePhoneChange}
                        />
                </ModalWindow> 
                <ModalWindow 
                    show={showEditModal} 
                    title='Edit customer'
                    handleHide={this.handleEditModalToggle} 
                    handleApply={()=>{this.editCustomer(data)}}
                    container={this}>
                    <CustomerModalContent
                        data={data}
                        nameOnClick={this.handleNameChange}
                        addressOnClick={this.handleAddressChange}
                        phoneOnClick={this.handlePhoneChange}
                        />
                </ModalWindow> 
                <ModalWindow 
                    show={showRemoveModal} 
                    role='remove'
                    title='Remove customer'
                    handleHide={this.handleRemoveModalToggle} 
                    handleApply={()=>{this.removeCustomer(data.id)}}
                    container={this}>
                    <p>Are you sure you want to delete the item?</p>
                </ModalWindow> 

                <Row className="center">
                    <Col md={3} >
                        <Title title={TABS_TITLE.customers}/>
                    </Col>
                    <Col md={9}>
                        <Button bsSize="sm" onClick={this.handleCreateModalToggle}>Create</Button>
                    </Col>
                </Row>
                <ContentTable 
                    titles={TABLE_TITLES} 
                    dataList={customers} 
                    fields={TABLE_FIELDS}
                    editOnClick={this.handleEditModalToggle}
                    removeOnClick={this.handleRemoveModalToggle} />
            </Grid>
        )
    }
}

Customers = ErrorHOC('error')(Customers);

const mapStateToProps = state => ({
    customers: state.customers.items,
    error: state.products.error,
});

const mapDispatchToProps = dispatch => ({
    fetchCustomers: () => dispatch(fetchCustomers()),
    addCustomer: (data) => dispatch(addCustomer({ ...data })),
    editCustomer: (data) => dispatch(editCustomer({ ...data })),
    removeCustomer: (id) => dispatch(removeCustomer(id)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
