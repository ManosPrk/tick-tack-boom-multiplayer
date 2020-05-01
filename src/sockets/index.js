import io from "socket.io-client";
import { socketEvents } from "./events";
export const socket = io.connect("192.168.1.8:1337/");

export const initSockets = ({ setValue }) => {
    socketEvents({ setValue });
    // setValue    ^ is passed on to be used by socketEvents
};