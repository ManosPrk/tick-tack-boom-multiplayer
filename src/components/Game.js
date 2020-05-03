import React from 'react';
import Bomb from "./Bomb";
import Dice from "./Dice";
import Card from "./Card";
import { useRef } from 'react';
import ModalTemplate from './common/ModalTemplate';
import ItemList from './common/ItemList';
import ItemsTable from "./common/ItemsTable"
import { Button } from 'react-bootstrap';
import SocketContext from './socket_context/SocketContext';
import { useContext } from 'react';
import { addClientToGameRoom, passBomb, startRound, isGameValid, resetRound, disconnectPlayer } from '../sockets/emit';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

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
        gameOver
    } = useContext(SocketContext);
    const tickAudio = useRef();
    const boomAudio = useRef();

    useEffect(() => {
        if (gameId !== "") {
            addClientToGameRoom(playerName, gameId);
        }
    }, [gameId])

    useEffect(() => {
        return () => disconnectPlayer();
    }, [])

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
                <NavLink to="/" className="nav-button float-left no-padding" variant="link">
                    <h3 className="nav-button-header">
                        Menu
                    </h3>
                </NavLink>
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
                title={gameOver ? "Game over!" : `${loser ? loser.name : ''} lost this round!`}
                body={
                    <ItemsTable
                        items={[...players]
                            .sort((player1, player2) => player2.roundsLost - player1.roundsLost)}
                        columns={["#", "Name", "Rounds Lost"]}
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