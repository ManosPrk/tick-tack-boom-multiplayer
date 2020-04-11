import React from 'react';

function Card(props) {
    return (
        <div onClick={props.onClick} className="syllable-card">
            <span id="syllable" className="noselect">{props.text}</span>
        </div>
    );
}

export default Card;