import React from "react";
import { getSocketDiceSide } from "../sockets/emit";
import { useContext } from "react";
import SocketContext from "./socket_context/SocketContext";


function Dice(props) {
    const { side } = useContext(SocketContext);

    return (
        <div onClick={getSocketDiceSide} className="dice">
            <span id="side" className="noselect">{side ? side : "DRAW"}</span>
        </div>
    );
}

export default Dice;