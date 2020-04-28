import React from "react";
import Bomb from "./Bomb";
import { createGameInstance, addPlayerToGame, openSocket, closeSocket } from "../socket_helper/playerSocket";
import ModalFormTemplate from "./common/ModalFormTemplate";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

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

    useEffect(() => {
        openSocket()

        return () => closeSocket();
    })

    function handleNewGameSubmit(event) {
        event.preventDefault();
        createGameInstance({ ...newGameInputValues }, (ioResponse) => {
            console.log(ioResponse);
            if (ioResponse.errorMessage) {
                toast.error(ioResponse.errorMessage);
            } else {
                setCookie("player", newGameInputValues);
                props.history.push(`/game/${newGameInputValues.gameId}`);
            }
        });
    }

    function handleJoinGameSubmit(event) {
        event.preventDefault();
        const form = event.target;
        if (form.checkValidity() === false) {
            return;
        }
        addPlayerToGame({ ...joinGameInputs }, (ioResponse) => {
            if (ioResponse.errorMessage) {
                toast.error(ioResponse.errorMessage)
                return;
            } else {
                setCookie("player", joinGameInputs);
                props.history.push(`game/${joinGameInputs.gameId}`);
            }
        });
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