import { EventEmitter } from "events";
import Dispatcher from "../appDispatcher";
import actionTypes from "../actions/actionTypes";
const CHANGE_EVENT = "change";
let _players = [];

class PlayerStore extends EventEmitter {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getPlayers() {
        return _players;
    }

    getPlayerById(id) {
        return _players.find(player => player.id === id);
    }

    isPlayer(id) {
        return this.getPlayerById(id) ? true : false;
    }
}

const store = new PlayerStore();

Dispatcher.register(action => {
    switch (action.actionType) {
        case actionTypes.DELETE_PLAYERS:
            _players = _players.filter(
                player => player.id !== parseInt(action.id, 10)
            );
            store.emitChange();
            break;
        case actionTypes.CREATE_PLAYERS:
            _players.push(action.player);
            store.emitChange();
            break;
        case actionTypes.UPDATE_PLAYERS:
            _players = _players.map(player =>
                player.id === action.player.id ? action.player : player
            );
            store.emitChange();
            break;
        case actionTypes.LOAD_PLAYERS:
            _players = action.players;
            store.emitChange();
            break;
        default:
            //nothing
            break;
    }
});

export default store;
