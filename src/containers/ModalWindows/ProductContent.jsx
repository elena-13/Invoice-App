import React from 'react';
import PropTypes from 'prop-types';

import { ControlLabel, FormControl } from 'react-bootstrap';

const ProductModalContent = ({ data, nameOnClick, priceOnClick }) => (
    <form>
        <ControlLabel>Name</ControlLabel>
            <FormControl
                type="text"
                value={data.name}
                placeholder="Enter name"
                onChange={nameOnClick}
            />
        <ControlLabel>Price</ControlLabel>
            <FormControl
                type="text"
                value={data.price}
                placeholder="Enter price"
                onChange={priceOnClick}
            />  
    </form>
);

ProductModalContent.propTypes = {
    data: PropTypes.object,
    nameOnClick: PropTypes.func,
    priceOnClick: PropTypes.func,
}

ProductModalContent.defaultProps = {
    data: {},
    nameOnClick: () => {},
    priceOnClick: () => {},
}

export default ProductModalContent;