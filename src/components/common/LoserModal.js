import React from 'react';
import { Modal } from 'react-bootstrap';

function LoserModal(props) {
    // const handleShow = () => setShow(true);\
    return (
        <Modal
            show={props.show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => { }}
        >
            <Modal.Header className='bg-warning justify-content-center'>
                <Modal.Title>BOOM! Who lost? </Modal.Title>
            </Modal.Header>
            <div id="loser-list-group">
                <Modal.Body>
                    <ul className="list-group text-center">
                        {props.players
                            .map((player, index) => {
                                return (
                                    <li
                                        onClick={props.close}
                                        style={{ border: 'none' }}
                                        value={index}
                                        key={player.id}
                                        className="list-group-item noselect"
                                    >
                                        {player.name}, rounds lost: {player.roundsLost}.
                                    </li>
                                );
                            })}
                    </ul>
                </Modal.Body>
            </div>

        </Modal>
    );
}

export default LoserModal;

