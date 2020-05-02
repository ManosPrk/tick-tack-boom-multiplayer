import io from "socket.io-client";
import { socketEvents } from "./events";
export const socket = io.connect(process.env.REACT_APP_API_URL || "https://ttboom-web-api-server.herokuapp.com/");

export const initSockets = ({ setValue }) => {
    socketEvents({ setValue });
    // setValue    ^ is passed on to be used by socketEvents
};