import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function OtherDriverModal({ handleClose }) {

  return (
    <>
      <Modal onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Drowsy Driver Nearby!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Keep your eyes on the road and practice extra safe defensive driving!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OtherDriverModal