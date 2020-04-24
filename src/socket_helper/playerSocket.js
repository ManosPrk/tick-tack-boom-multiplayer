import io from 'socket.io-client';
const socket = io.connect("localhost:1337/");

export function addClientToGameRoom(clientId, cb) {
    socket.emit('addClientToGameRoom', clientId, (response) => {
        cb(response);
    })
}

export function createGameInstance(data, cb) {
    socket.emit('createGameInstance', data, (res) => {
        return cb(res);
    });
}

export function addPlayerToGame(data) {
    return new Promise((resolve) => {
        socket.emit('subcribeToGameInstanceNewPlayer', data, (response) => {
            resolve(response);
        });
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



export function getPlayersByGameId(gameId, cb) {
    socket.emit('requestPlayersFromGame', gameId, (response) => {
        cb(response);
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

export function startGame(yourPlayerId, cb) {
    socket.emit('start-game', yourPlayerId, (message) => {
        cb(message);
    });
}

export function passBomb(playerId, cb) {
    socket.emit('pass-bomb', playerId, (message) => cb(message));
}

export function changePlayer(cb) {
    socket.on('change-player', (message) => cb(message));
}

export function gameEnded(cb) {
    socket.on('game-ended', (loserName) => {
        console.log(loserName)
        cb(loserName);
    })
}

export function gameStarted(cb) {
    socket.on('game-started', (message) => cb(message));
}

export function getInstances() {
    return new Promise((resolve) => {
        socket.emit('getInstances', (response) => {
            resolve(response);
        });
    });
}
