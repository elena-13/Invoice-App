import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Table, Button, Glyphicon, FormControl } from 'react-bootstrap';

const ContentTable = ({ titles, dataList, fields, removeOnClick, editOnClick, isInvoice, changeQty }) => (
      <Table responsive>
          <thead>
              <tr>
                  {titles.map((name, index) => (
                    <th key={index}>{name}</th>
                  ))}
              </tr>
          </thead>
          <tbody>
            {dataList.map((obj, index) => (
              <tr key={obj['id']}>
                {!isInvoice && <td>{index + 1}</td>}
                {fields.map((curKey, idx) => (
                    (curKey === 'qty') ? (<td key={idx}><FormControl 
                        type="number" 
                        min="1"
                        value={obj[curKey]} 
                        placeholder="Enter amount"
                        onChange={({ target: { value } }) => { changeQty(value, index) }}
                        /></td>
                        )
                        : (<td key={idx}>{obj[curKey]}</td>)            
                ))}
                {(!isInvoice) && (
                    <td>
                        <Button bsSize="small" onClick={() => {editOnClick(obj)}}>
                            <Glyphicon glyph="glyphicon glyphicon-pencil" /> Edit
                        </Button>
                    </td>)}
                    <td>
                        <Button bsSize="small" onClick={() => {removeOnClick(obj['id'])}}>
                            <Glyphicon glyph="glyphicon glyphicon-trash" /> Remove
                        </Button>
                    </td>
              </tr>
            ))}
          </tbody>
      </Table>

);

ContentTable.propTypes = {
    dataList: PropTypes.array,
    fields: PropTypes.array,
    titles: PropTypes.array,
}

ContentTable.defaultProps = {
    dataList: [],
    fields: [],
    titles: [],
}

export default ContentTable;