import React from 'react';
import { Modal } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
// import NavButton from './NavButton';

function ResultsModal(props) {
    const players = [...props.players].sort((player1, player2) => player2.roundsLost - player1.roundsLost);

    return (
        <Modal
            show={props.show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => { }}
        >
            <Modal.Header className='bg-warning justify-content-center'>
                <Modal.Title>{players[0].find} Lost! </Modal.Title>
            </Modal.Header>
            <div id="loser-list-group">
                <Modal.Body>
                    <ul className="list-group text-center">
                        {players
                            .map((player, index) => {
                                return (
                                    <li
                                        style={{ border: 'none' }}
                                        value={index}
                                        key={player.id}
                                        className="list-group-item noselect"
                                    >
                                        {player.name} lost {player.roundsLost} round(s).
                                    </li>
                                );
                            })}
                    </ul>
                </Modal.Body>
                <button className="btn btn-primary float-right" onClick={props.close}>New Game</button>
                <NavLink className="btn btn-primary" onClick={props.close} to="/">Main Menu</NavLink>
            </div>

        </Modal>
    );
}

export default ResultsModal;

