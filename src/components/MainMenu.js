import React from "react";
import Bomb from "./Bomb";
import { createGameInstance, addPlayerToGame } from "../socket_helper/playerSocket";
import ModalFormTemplate from "./common/ModalFormTemplate";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

function MainMenu(props) {
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(['player']);
    const newGameInputValues = {
        name: '',
        gameId: ''
    };

    const joinGameInputs = {
        name: '',
        gameId: ''
    };

    useEffect(() => {
        removeCookie('clientId');
    })

    function handleNewGameSubmit(event) {
        event.preventDefault();
        createGameInstance(newGameInputValues, (ioResponse) => {
            console.log(ioResponse.errorMessage);
            if (ioResponse.errorMessage) {
                toast.error(ioResponse.errorMessage);
            } else {
                setCookie('clientId', ioResponse.clientId);
                props.history.push(`/game/${ioResponse.gameId}`);
            }
        });
    }

    function handleJoinGameSubmit(event) {
        event.preventDefault();
        const form = event.target;
        if (form.checkValidity() === false) {
            return;
        }

        addPlayerToGame(joinGameInputs).then((ioResponse) => {
            if (ioResponse.errorMessage) {
                toast.error(ioResponse.errorMessage)
            } else {
                setCookie('clientId', ioResponse.clientId);
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