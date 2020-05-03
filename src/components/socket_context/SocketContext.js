import React from "react";
import { SocketContextDefaultState } from "./SocketContextDefaultState";

const SocketContext = React.createContext({
    ...SocketContextDefaultState
});

export default SocketContext;