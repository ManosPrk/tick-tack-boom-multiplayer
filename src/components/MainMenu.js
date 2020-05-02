import React from "react";
import Bomb from "./Bomb";
import ModalFormTemplate from "./common/ModalFormTemplate";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { createGameInstance, joinGameInstance, gameExists } from "../sockets/emit";

function MainMenu(props) {
    const [cookies, setCookie, removeCookies] = useCookies(['player']);
    const newGameInputValues = {
        name: '',
        gameId: ''
    };

    const joinGameInputs = {
        name: '',
        gameId: ''
    };


    function handleNewGameSubmit(event) {
        event.preventDefault();
        gameExists(newGameInputValues.gameId, (response) => {
            if (!response) {
                createGameInstance(newGameInputValues.gameId, newGameInputValues.name);
                props.history.push(`game/${newGameInputValues.gameId}`);
            } else {
                toast.error("There is already an active game with this id!");
            }
        })

    }

    function handleJoinGameSubmit(event) {
        event.preventDefault();
        joinGameInstance(joinGameInputs.gameId, joinGameInputs.name);
        props.history.push(`game/${joinGameInputs.gameId}`);
    }

    return (
        <div id="main-menu-container" className="d-flex flex-column justify-content-evenly align-items-center">
            <Bomb></Bomb>
            <div>
                <nav className="d-flex flex-column col-md-12">
                    <ModalFormTemplate
                        modalTitle="Enter your name!"
                        modalButtonText="New Game"
                        formButtonText="Start"
                        formHandleSubmit={handleNewGameSubmit}
                        // formInputHandleBlur={handleBlur}
                        formInputValues={newGameInputValues}
                    />

                    <ModalFormTemplate
                        modalTitle="Enter your name and game id!"
                        modalButtonText="Join Game"
                        formButtonText="Join"
                        formHandleSubmit={handleJoinGameSubmit}
                        // formInputHandleBlur={handleBlur}
                        formInputValues={joinGameInputs}
                    />
                </nav>
            </div >
        </div >
    );
}

export default MainMenu;