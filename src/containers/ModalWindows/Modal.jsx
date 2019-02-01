import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ModalWindow = ({ show, handleHide, handleApply, container, title, children, role }) => (
    <Modal
        show={show}
        onHide={handleHide}
        container={container}
        aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {children}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide}>Close</Button>
            {role ? <Button onClick={handleApply} bsStyle="primary">Delete</Button> :
            <Button onClick={handleApply} bsStyle="primary">Save</Button>}
          </Modal.Footer>
    </Modal>
);

ModalWindow.propTypes = {
  show: PropTypes.bool,
  role: PropTypes.string,
  title: PropTypes.string,
  container: PropTypes.object,
  handleApply: PropTypes.func,
  handleHide: PropTypes.func,
}

export default ModalWindow;