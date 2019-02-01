import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Col } from 'react-bootstrap';

import { fetchInvoices, removeInvoice } from '../../actions/invoiceActions';
import { fetchCustomers } from '../../actions/customerActions';

import Title from '../../components/title/title';
import { TABS_TITLE } from '../../data/TABS_TITLE';
import ContentTable from '../../components/content-table/content-table';
import ModalWindow from '../ModalWindows/Modal';

import ErrorHOC from '../../HOC/errorHOC';

const TABLE_FIELDS = ['name', 'discount', 'total'];
const TABLE_TITLES = ['#', 'Customer', 'Discount', 'Total'];

class Invoices extends Component {

    state = {
        id: '',
        showRemoveModal: false,
    }

    componentDidMount() {
        document.title = `Invoice App | ${TABS_TITLE.invoice.list}`;
        const { fetchInvoices, fetchCustomers } = this.props;
        (async ()=> {
            await fetchCustomers();
            await fetchInvoices();})();
    }

    handleEdit = ({ id }) => {
        this.props.history.push(`invoices/${id}/edit`);
    }

    handleRemoveModalToggle = (id) => {
        this.setState((prev) => ({id: id, showRemoveModal: !prev.showRemoveModal}))
    }

    removeInvoice = (id) => {
        const { removeInvoice } = this.props;
       
        removeInvoice(id);
        this.handleRemoveModalToggle();
    }

    render() {
        const { invoices, customers } = this.props;
        const { id, showRemoveModal } = this.state;
       
        return (
            <Grid> 
                <ModalWindow 
                    show={showRemoveModal} 
                    role='remove'
                    title='Remove invoice'
                    handleHide={this.handleRemoveModalToggle} 
                    handleApply={()=>{this.removeInvoice(id)}}
                    container={this}>
                    <p>Are you sure you want to delete the item?</p>
                </ModalWindow> 
                <Row className="center">
                    <Col md={2} >
                        <Title title={TABS_TITLE.invoice.list}/>
                    </Col>
                    <Col md={10}>
                        <Link to='invoices/create/edit'><Button bsSize="sm">Create</Button></Link>
                    </Col>
                </Row>
                <ContentTable 
                    titles={TABLE_TITLES} 
                    dataList={invoices.map((item, index) => {
                        return { 
                            name: customers.filter((ctm) => (ctm.id === item.customer_id))[0].name,
                            discount: item.discount,
                            id: item.id,
                            total: item.total
                        };
                    })}
                    editOnClick={this.handleEdit} 
                    removeOnClick={this.handleRemoveModalToggle}
                    fields={TABLE_FIELDS} />
            </Grid>
        )
    }
}

Invoices = ErrorHOC('error')(Invoices);

const mapStateToProps = state => ({
    invoices: state.invoices.items,
    customers: state.customers.items,
    error: state.products.error,
  });

const mapDispatchToProps = dispatch => ({
    fetchInvoices: () => dispatch(fetchInvoices()),
    fetchCustomers: () => dispatch(fetchCustomers()),
    removeInvoice: (id) => dispatch(removeInvoice(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Invoices);