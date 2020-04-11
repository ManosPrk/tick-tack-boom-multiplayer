import React from "react";
import Bomb from "./Bomb";
import { createGameInstance, addPlayerToGame } from "../socket_helper/playerSocket";
import ModalFormTemplate from "./common/ModalFormTemplate";
import { toast } from "react-toastify";

function MainMenu(props) {

    const newGameInputValues = {
        name: '',
    };

    const joinGameInputs = {
        name: '',
        gameId: ''
    };

    function handleNewGameSubmit(event) {
        event.preventDefault();
        createGameInstance(newGameInputValues, (ioResponse) => {
            console.log(ioResponse.errorMessage);
            if (ioResponse.errorMessage) {
                toast.error(ioResponse.errorMessage);
            } else {
                props.history.push(`/game/${ioResponse.gameId}`);
            }
        });
    }

    function handleJoinGameSubmit(event) {
        event.preventDefault();
        const form = event.target;
        console.log(form.checkValidity());
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        addPlayerToGame(joinGameInputs).then((message) => {
            console.log(message);
            props.history.push(`game/${joinGameInputs.gameId}`);
        });
    }

    return (
        <div id="main-menu-container" className="d-flex flex-column justify-content-evenly align-items-center">
            <Bomb></Bomb>
            <div>
                <nav className="d-flex flex-column col-md-12">
                    <ModalFormTemplate
                        modalTitle="Enter your name to start a new game!"
                        modalButtonText="New Game"
                        formButtonText="Start"
                        formHandleSubmit={handleNewGameSubmit}
                        // formInputHandleBlur={handleBlur}
                        formInputValues={newGameInputValues}
                    />

                    <ModalFormTemplate
                        modalTitle="Enter your name and game id to join a game!"
                        modalButtonText="Join Game"
                        formButtonText="Join"
                        formHandleSubmit={handleJoinGameSubmit}
                        // formInputHandleBlur={handleBlur}
                        formInputValues={joinGameInputs}
                    />
                    <h1>

                    </h1>
                </nav>
            </div >
        </div >
    );
}

export default MainMenu;