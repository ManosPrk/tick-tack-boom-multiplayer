import io from 'socket.io-client';
const socket = io.connect('https://ttboom-web-api-server.herokuapp.com/');

export function getSocketId() {
    return socket.id;
}

export function createGameInstance(data, cb) {
    socket.emit('createGameInstance', data, (res) => {
        console.log(res);
        return cb(res);
    });
}

export function isInstanceValid(gameId, cb) {
    socket.emit('isValidGame', gameId, (response) => {
        cb(response);
    });
}

//When a new player is added, inform players
export function updatePlayers(cb) {
    socket.on('notifyPlayers', (message, players) => {
        cb(message, players);
    });
}

export function addPlayerToGame(data) {
    return new Promise((resolve) => {
        socket.emit('subcribeToGameInstanceNewPlayer', data, (response) => {
            console.log(response);
            resolve(response);
        });
    });
}

export function getPlayersByGameId(gameId) {
    return new Promise((resolve) => {
        socket.emit('requestPlayersFromGame', gameId, (response) => {
            resolve(response);
        });
    });
}

export function getSocketDiceSide(gameId, cb) {
    socket.emit('requestDiceSide', gameId, (data) => {
        cb(data)
    });
}

export function updateDiceSide(cb) {
    socket.on('updateDiceSide', (data) => {
        cb(data);
    })
}

export function getCurrentCard(gameId, cb) {
    socket.emit('requestCard', gameId, (data) => {
        console.log(data);
        cb(data)
    });
}

export function updateCurrentCard(cb) {
    socket.on('updateCard', (data) => {
        cb(data);
    })
}

export function startGame(gameId, yourPlayerId, cb) {
    socket.emit('start-game', gameId, yourPlayerId, (message) => {
        cb(message);
    });
}

export function passBomb(gameId, playerId) {
    socket.emit('pass-bomb', gameId, playerId);
}

export function changePlayer(cb) {
    socket.on('change-player', (message) => cb(message));
}

export function gameEnded(cb) {
    socket.on('game-ended', (loserId) => {
        cb(loserId);
    })
}

export function gameStarted(cb) {
    socket.on('game-started', (message) => cb(message));
}
