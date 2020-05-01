import React, { useState } from 'react';
import Bomb from "./Bomb";
import Dice from "./Dice";
import Card from "./Card";
import ResultsModal from './common/ResultsModal';
import { useRef } from 'react';
import ModalTemplate from './common/ModalTemplate';
import ItemList from './common/ItemList';
import { Button } from 'react-bootstrap';
import SocketContext from './socket_context/SocketContext';
import { useContext } from 'react';
import { addClientToGameRoom, passBomb, startRound, isGameValid, } from '../sockets/emit';
import { useEffect } from 'react';

function Game(props) {
    isGameValid((response) => {
        if (!response) {
            props.history.push("/");
        }
    });
    // const [cardsLeft, setCardsLeft] = useState();
    // const [cookies, setCookie, removeCookies] = useCookies(['player']);
    // const gameId = props.match.params.id;
    const {
        players,
        playerName,
        gameId,
        roundStarted,
        cardsLeft,
        playTickAudio,
        playBoomAudio,
        loser

    } = useContext(SocketContext);
    const [showLoserModal, setShowLoserModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [gameOver, setGameover] = useState(false);
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

    function hideLoserModal() {
        setShowLoserModal(false);
        if (cardsLeft === 0) {
            setShowResultsModal(true);
            setGameover(true);
        }
    }

    function hideResultsModal(event) {
        setShowResultsModal(false);
        resetGame();
    }

    function resetGame() {
        setGameover(false);
        //TODO: RESET CARDS
        players.forEach((player) => { player.roundsLost = 0 });
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
            {players.length < 2 &&
                <ModalTemplate
                    show={true}
                    noClose={true}
                    title={`Waiting for ${2 - players.length} more player(s) to join`}
                    body={
                        <div className="loader-container text-center">
                            <i style={{ fontSize: "70px" }} className="fa fa-spinner fa-spin"></i>
                        </div>
                    }
                />}
            {
                showLoserModal &&
                <ModalTemplate
                    show={showLoserModal}
                    title={`${loser.name} lost this round!`}
                    noClose={hideLoserModal}
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
            }

            {gameOver && <ResultsModal show={showResultsModal} newGame={resetGame} close={hideResultsModal} players={[...players]} />}
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