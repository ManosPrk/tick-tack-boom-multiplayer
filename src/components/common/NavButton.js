import React from 'react';

function NavButton(props) {
    return (
        <h1>
            <a className="nav-button" id="play-button" href={props.link}>{props.text}</a>
        </h1>
    );
}
export default NavButton;