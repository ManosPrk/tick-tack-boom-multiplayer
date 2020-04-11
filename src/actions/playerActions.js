import dispatcher from "../appDispatcher";
import actionTypes from "./actionTypes";
import * as playerApi from "../api/playerApi";

export function savePlayer(player) {
    return playerApi.savePlayer(player).then(savedPlayer => {
        dispatcher.dispatch({
            actionType: player.id
                ? actionTypes.UPDATE_PLAYERS
                : actionTypes.CREATE_PLAYERS,
            course: savedPlayer
        });
    });
}

export function loadPlayers() {
    return playerApi.getPlayers().then(players => {
        dispatcher.dispatch({
            actionType: actionTypes.LOAD_PLAYERS,
            players
        });
    });
}

export function removePlayer(id) {
    return playerApi.deletePlayer(id).then(() => {
        dispatcher.dispatch({
            actionType: actionTypes.DELETE_PLAYERS,
            id: id
        });
    });
}

