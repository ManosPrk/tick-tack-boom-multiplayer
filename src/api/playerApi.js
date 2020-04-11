import { handleResponse, handleError } from "./apiUtils";

const baseUrl = process.env.REACT_APP_API_URL + "/players/";

export function getPlayers() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}

export function savePlayer(player) {
  return fetch(baseUrl + (player.id || ""), {
    method: player.id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
    headers: { "content-type": "application/json" },
    body: JSON.stringify(player)
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deletePlayer(playerId) {
  return fetch(baseUrl + playerId, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}