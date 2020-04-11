import React from "react";
import bombImage from "../assets/bomb.png"

function Bomb(props) {
    return (
        <div className="d-flex flex-column align-items-center">
            <img onClick={props.onClick} className="img-fluid" src={bombImage} alt="bomb"></img>
        </div>
    );
}

export default Bomb;