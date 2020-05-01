import io from 'socket.io-client';
let socket;

export function removeListener(socketName) {
    socket.off(socketName);
}

export function addClientToGameRoom(data, cb) {
    socket.emit('add-client-to-game-room', data, (response) => {
        cb(response);
    })
}

export function createGameInstance(data, cb) {
    socket.emit('create-game-instance', data, (res) => {
        return cb(res);
    });
}

export function addPlayerToGame(data, cb) {
    socket.emit('join-game-instance', data, (response) => {
        cb(response);
    });
}

//When a new player is added, inform players
export function updatePlayers(cb) {
    socket.on('notify-players', (message, players) => {
        cb(message, players);
    });
}



export function getPlayersByGameId(cb) {
    socket.emit('request-players-from-game', (response) => {
        cb(response);
    });
}

export function getSocketDiceSide(cb) {
    socket.emit('request-dice-side', (data) => {
        cb(data)
    });
}

export function updateDiceSide(cb) {
    socket.on('update-dice-side', (data) => {
        cb(data);
    })
}

export function getCurrentCard(cb) {
    socket.emit('request-card', (data) => {
        console.log(data);
        cb(data)
    });
}

export function updateCurrentCard(cb) {
    socket.on('update-card', (data) => {
        cb(data);
    })
}

export function startGame(cb) {
    socket.emit('start-game', (message) => {
        cb(message);
    });
}

export function passBomb(cb) {
    socket.emit('pass-bomb', (message) => cb(message));
}

export function changePlayer(cb) {
    socket.on('change-player', (message) => cb(message));
}

export function gameEnded(cb) {
    socket.on('game-ended', (response) => {
        console.log(response)
        cb(response);
    })
}

export function gameStarted(cb) {
    socket.on('game-started', (message) => cb(message));
}

export function getInstances() {
    return new Promise((resolve) => {
        socket.emit('get-instances', (response) => {
            resolve(response);
        });
    });
}

export function onPlayerDisconnect(cb) {
    socket.on('player-disconnect', (response) => {
        cb(response);
    });
}

export function openSocket() {
    socket = io.connect("192.168.1.8:1337/");
}

export function closeSocket() {
    socket.close();
}
