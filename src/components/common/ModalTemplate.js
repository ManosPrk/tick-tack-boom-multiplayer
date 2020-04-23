import React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ModalTemplate(props) {

    const [show, setShow] = useState(props.show || false);

    const handleOpen = () => setShow(props.open || true);
    const handleClose = () => setShow(props.noClose || false);

    return (
        <>
            <Button className="nav-button" variant="link" onClick={handleOpen}>
                <h1>
                    {props.modalButtonText}
                </h1>
            </Button>

            <Modal
                show={show}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="game-modal"
                onHide={handleClose}
            >
                <Modal.Header className='game-modal-header justify-content-center'>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="game-modal-body">
                    {props.body}
                </Modal.Body>

                {props.ModalCloseButton &&
                    <Button className="btn btn btn-primary float-right" onClick={handleClose}>
                        Close
                    </Button>
                }
                {props.ModalSaveButton &&
                    <Button variant="btn btn btn-primary float-left" onClick={props.saveButtonClick}>
                        {props.saveButtonText}
                    </Button>
                }
            </Modal>
        </>
    );
}

ModalTemplate.propTypes = {
    modalButtonText: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.node.isRequired,
    handleClick: PropTypes.func
}

export default ModalTemplate;