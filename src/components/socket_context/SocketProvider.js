import React, { useState, useEffect } from "react";
import SocketContext from "./SocketContext";
import { initSockets } from "../../sockets";

const SocketProvider = (props) => {
    const [value, setValue] = useState({
        players: [],
        gameId: '',
        playerName: '',
        playerId: '',
        notifyPlayersMessage: '',
        side: 'ROLL',
        card: 'DRAW',
        cardsLeft: 0,
        isDiceRolled: false,
        isCardDrawn: false,
        createGameMessage: '',
        changePlayerMessage: '',
        loser: null,
        gameStartedMessage: '',
        playerDisconnectMessage: '',
        bombPassedMessage: '',
        updateGameDataErrorMessage: '',
        roundStarted: false,
        gameEnded: false,
        playTickAudio: false,
        playBoomAudio: false,
    });

    useEffect(() => {
        initSockets({ value, setValue });
        console.log(value);
    }, [initSockets]);
    // Note, we are passing setValue ^ to initSockets
    return (
        <SocketContext.Provider value={value}>
            {props.children}
        </SocketContext.Provider>
    )
};

export default SocketProvider;