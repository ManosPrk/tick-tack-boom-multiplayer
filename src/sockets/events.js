import { socket } from './index';
import { toast } from 'react-toastify';
import { SocketContextDefaultState } from '../components/socket_context/SocketContextDefaultState';

export const socketEvents = ({ setValue }) => {
    const handleSetState = (valuesToSet) => {
        if (valuesToSet.errorMessage) {
            toast.error(valuesToSet.errorMessage)
        } else {
            setValue(state => { return { ...state, ...valuesToSet } });
        }
    }
    socket.on('notify-players', (response) => {
        toast.info(response.notifyPlayersMessage);
        handleSetState(response);
    });

    socket.on('update-players', (response) => {
        handleSetState(response);
    });


    socket.on('new-game-created', (response) => {
        handleSetState(response);
    });

    socket.on('joined-game', (response) => {
        handleSetState(response);
    })

    socket.on('update-game-data', (response) => {
        handleSetState(response);
    })

    socket.on('update-dice-side', (response) => {
        handleSetState(response);
    })

    socket.on('update-card', (response) => {
        handleSetState(response);
    })

    socket.on('change-player', (response) => {
        toast.success(response.changePlayerMessage);
        handleSetState({ ...response, playTickAudio: true });
    });

    socket.on('player-changed', (response) => {
        toast.info(response.bombPassedMessage);
        handleSetState({ ...response, playTickAudio: false })
    })

    socket.on('round-started', (response) => {
        toast.success(response.gameStartedMessage);
        handleSetState({ ...response });
    });

    socket.on('round-ended', (response) => {
        handleSetState({ ...response, playTickAudio: false, playBoomAudio: true })
    })

    socket.on('round-resetted', (response) => {
        console.log(response);
        handleSetState({ ...response, playTickAudio: false, playBoomAudio: false })
    });

    socket.on('player-disconnected', (response) => {
        toast.warn(response.playerDisconnectedMessage);
        handleSetState(response)
    });

    socket.on('reset-game-state', () => {
        handleSetState(SocketContextDefaultState);
    });

    socket.on('game-master-changed', (response) => {
        handleSetState(response);
    })
};