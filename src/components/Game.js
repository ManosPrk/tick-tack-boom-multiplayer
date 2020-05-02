import React from 'react';
import Bomb from "./Bomb";
import Dice from "./Dice";
import Card from "./Card";
import { useRef } from 'react';
import ModalTemplate from './common/ModalTemplate';
import ItemList from './common/ItemList';
import { Button } from 'react-bootstrap';
import SocketContext from './socket_context/SocketContext';
import { useContext } from 'react';
import { addClientToGameRoom, passBomb, startRound, isGameValid, resetRound, } from '../sockets/emit';
import { useEffect } from 'react';

function Game(props) {
    isGameValid((response) => {
        if (!response) {
            props.history.push("/");
        }
    });

    ///TODO
    //Disconnect player when leaving game component?
    //check if players is already in game
    //fix useEffect dependencies
    //Reset context when player leave game component
    ///
    const {
        players,
        playerName,
        gameId,
        roundStarted,
        cardsLeft,
        playTickAudio,
        playBoomAudio,
        loser,
        roundEnded,
    } = useContext(SocketContext);
    const tickAudio = useRef();
    const boomAudio = useRef();

    useEffect(() => {
        if (gameId !== "") {
            addClientToGameRoom(playerName, gameId);
        }
    }, [gameId])

    function handleBombClick() {
        if (!roundStarted) {
            startRound();
        }
        else if (roundStarted) {
            passBomb();
        }
    }

    function handleModalClose() {
        resetRound(gameId);
    }

    return (
        <div className="game-container no-padding">
            <nav className="d-flex">
                <Button className="nav-button float-left no-padding" variant="link">
                    <h3 className="nav-button-header">
                        Menu
                    </h3>
                </Button>
            </nav>
            <ModalTemplate
                show={players.length < 2 ? true : false}
                title={`Waiting for ${2 - players.length} more player(s) to join`}
                body={
                    <div className="loader-container text-center">
                        <i style={{ fontSize: "70px" }} className="fa fa-spinner fa-spin"></i>
                    </div>
                }
            />
            <ModalTemplate
                show={roundEnded}
                handleClose={handleModalClose}
                title={`${loser ? loser.name : ''} lost this round!`}
                body={
                    <ItemList
                        items={[...players]
                            .sort((player1, player2) => player2.roundsLost - player1.roundsLost)
                            .map((player) => {
                                return `${player.name}  has lost ${player.roundsLost} round${player.roundsLost === 1 ? `` : `s`} in total`;
                            })}
                    />
                }
            />
            <Bomb onClick={handleBombClick}></Bomb>
            <span>Remaining cards: {cardsLeft} </span>
            {playTickAudio && <audio muted={false} ref={tickAudio} autoPlay={true} src="/tick.mp3" id="tick-audio"></audio>}
            {playBoomAudio && <audio muted={false} ref={boomAudio} autoPlay={true} src="/boom.mp3" id="bomb-audio"></audio>}
            <div className="game-items-container">
                <Dice />
                <Card />
            </div>
        </div >
    );
}

export default Game; 