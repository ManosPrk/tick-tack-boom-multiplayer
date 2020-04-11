import React from "react";


function Dice(props) {
    return (
        <div onClick={props.onClick} className="dice">
            <span id="side" className="noselect">{props.text}</span>
        </div>
    );
}

export default Dice;