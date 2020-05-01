import React from 'react';
import { getCurrentCard } from '../sockets/emit';
import { useContext } from 'react';
import SocketContext from './socket_context/SocketContext';

function Card(props) {
    const { card } = useContext(SocketContext);

    return (
        <div onClick={getCurrentCard} className="syllable-card">
            <span id="syllable" className="noselect">{card ? card : "ROLL"}</span>
        </div>
    );
}

export default Card;