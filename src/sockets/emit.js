import { socket } from './index';


export const getPlayers = () => {
    socket.emit('request-players-from-game');
};

export const gameExists = (gameId, cb) => {
    socket.emit('game-exists', gameId, (response) => cb(response));
}

export const isGameValid = (cb) => {
    socket.emit('is-valid-game', (response) => cb(response))
}

export const addClientToGameRoom = (name, gameId) => {
    socket.emit('add-client-to-game-room', { name, gameId })
}

export const createGameInstance = (gameId, playerName) => {
    socket.emit('add-new-game', gameId, playerName);
}

export const joinGameInstance = (gameId, playerName) => {
    socket.emit('join-game', gameId, playerName);
}

export const getSocketDiceSide = () => {
    socket.emit('request-dice-side');
}

export const getCurrentCard = () => {
    socket.emit('request-card');
}

export const passBomb = () => {
    socket.emit('pass-bomb');
}

export function startRound() {
    socket.emit('start-round');
}

export function resetRound(gameId) {
    socket.emit('reset-round', gameId);
}

export function disconnectPlayer() {
    socket.emit('player-disconnecting');
}

export function getInstances(cb) {
    socket.emit('get-instances', (response) => {
        cb(response);
    });
}