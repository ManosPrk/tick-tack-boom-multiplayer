import React from "react";

const SocketContext = React.createContext({
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

export default SocketContext;