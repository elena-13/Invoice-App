import React from 'react';
import PropTypes from 'prop-types';

import { ControlLabel, FormControl } from 'react-bootstrap';

const CustomerModalContent = ({ data, nameOnClick, addressOnClick, phoneOnClick }) => (
    <form>
        <ControlLabel>Name</ControlLabel>
            <FormControl
                type="text"
                value={data.name}
                placeholder="Enter name"
                onChange={nameOnClick}
            />
        <ControlLabel>Address</ControlLabel>
            <FormControl
                type="text"
                value={data.address}
                placeholder="Enter address"
                onChange={addressOnClick}
            />  
        <ControlLabel>Phone</ControlLabel>
            <FormControl
                type="tel"
                value={data.phone}
                placeholder="Enter phone"
                onChange={phoneOnClick}
            /> 
    </form>
);

CustomerModalContent.propTypes = {
    data: PropTypes.object,
    nameOnClick: PropTypes.func,
    addressOnClick: PropTypes.func,
    phoneOnClick: PropTypes.func,
}

export default CustomerModalContent;