import { socket } from './index';
import { toast } from 'react-toastify';

export const socketEvents = ({ value, setValue }) => {
    socket.on('notify-players', (response) => {
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            const { message, players } = response;
            setValue(state => { return { ...state, notifyPlayersMessage: message, players } });
        }
    });

    socket.on('update-players', (response) => {
        console.log(response);
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            setValue(state => { return { ...state, players: response.players } });
        }
    });


    socket.on('new-game-created', (response) => {
        console.log(response);
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            setValue(state => {
                return {
                    ...state,
                    createGameMessage: response.successMessage,
                    gameId: response.gameId,
                    playerName: response.playerName,
                    players: response.players
                }
            });
        }
    });

    socket.on('joined-game', (response) => {
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            setValue(state => {
                return {
                    ...state,
                    createGameMessage: response.successMessage,
                    gameId: response.gameId,
                    playerName: response.playerName,
                    players: response.players
                }
            });
        }
    })

    socket.on('update-game-data', (response) => {
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            const { side, card, cardsLeft, isDiceRolled, isCardDrawn } = response;

            setValue(state => {
                return {
                    ...state,
                    side,
                    card,
                    cardsLeft,
                    isDiceRolled,
                    isCardDrawn,
                }
            });
        }
    })

    socket.on('update-dice-side', (response) => {
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            setValue(state => { return { ...state, side: response.side } });
        }
    })

    socket.on('update-card', (response) => {
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            setValue(state => { return { ...state, card: response.card, cardsLeft: response.cardsLeft } });
        }
    })

    socket.on('change-player', (response) => {
        console.log(response);
        setValue(state => { return { ...state, changePlayerMessage: response.message, playTickAudio: true } });
    });

    socket.on('player-changed', (response) => {
        console.log(response);
        if (response.errorMessage) {
            toast.error(response.errorMessage);
        } else {
            setValue(state => { return { ...state, bombPassedMessage: response.message, playTickAudio: false } });
        }
    })

    socket.on('round-ended', (response) => {
        console.log(response);
        setValue(state => {
            return {
                ...state,
                loser: response.loser,
                players: response.updatedPlayers,
                roundStarted: response.roundStarted,
                gameEnded: response.gameEnded,
                playTickAudio: false,
                playBoomAudio: true,
            }
        });
    })

    socket.on('round-started', (response) => {
        setValue(state => {
            return {
                ...state,
                gameStartedMessage: response.message,
                roundStarted: response.roundStarted,
                playBoomAudio: false
            }
        });
    });

    socket.on('player-disconnect', (response) => {
        setValue(state => { return { ...state, playerDisconnectMessage: response.message, players: response.players } });
    });
};