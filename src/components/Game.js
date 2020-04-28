import React, { useState } from 'react';
import Bomb from "./Bomb";
import Dice from "./Dice";
import Card from "./Card";
import { NavLink } from 'react-router-dom';
import ResultsModal from './common/ResultsModal';
import { toast } from 'react-toastify';
import { closeSocket, getPlayersByGameId, updatePlayers, getSocketDiceSide, updateDiceSide, getCurrentCard, updateCurrentCard, isInstanceValid, startGame, addClientToGameRoom, changePlayer, passBomb, gameEnded, gameStarted, removeListener, openSocket, onDisconnect } from '../socket_helper/playerSocket';
import { useEffect } from 'react';
import { useRef } from 'react';
import ModalTemplate from './common/ModalTemplate';
import { useCookies } from 'react-cookie';
import ItemList from './common/ItemList';
import { Button } from 'react-bootstrap';

function Game(props) {
    const [cardsLeft, setCardsLeft] = useState();
    //TO-DO
    const gameId = props.match.params.id;
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(['player']);
    // eslint-disable-next-line no-unused-vars
    const [clientId, setClientId] = useState(cookies.clientId);
    const [currentCard, setCurrentCard] = useState('DRAW');
    const [currentDiceSide, setCurrentDiceSide] = useState('ROLL');
    const [roundStarted, setRoundStarted] = useState(false);
    const [showLoserModal, setShowLoserModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [gameOver, setGameover] = useState(false);
    const tickAudio = useRef();
    const boomAudio = useRef();
    const [players, setPlayers] = useState([]);
    const [roundLoser, setRoundLoser] = useState();
    // const standings = players.sort((player1, player2) => player1.roundLost > player2.roundsLost);

    ///TODO///
    //fix menu changing position on show modals
    //add leave game button
    //add standings button
    ///

    useEffect(() => {
        openSocket();

        getPlayersByGameId(gameId, (_players) => {
            setPlayers(_players);
        });

        addClientToGameRoom(clientId, (response) => {
            if (response.errorMessage) {
                toast.error(response.errorMessage);
                props.history.push('/');
            } if (response.side && response.card) {
                setCurrentDiceSide(response.side);
                setCurrentCard(response.card);
                setCardsLeft(response.cardsLeft);
            }
        });

        updateCurrentCard((response) => {
            if (response.errorMessage) {
                console.log(response.errorMessage);
                return;
            }
            setCardsLeft(response.cardsLeft);
            setCurrentCard(response.card);
        })

        updateDiceSide((response) => {
            if (response.error) {
                console.log(response.error);
                return;
            }
            setCurrentDiceSide(response.side);
        });

        updatePlayers((message, _players) => {
            toast.success(message);
            if (_players) {
                setPlayers(_players);
            }
        })

        changePlayer((message) => {
            console.log(message);
            toast.warn(message);
            if (tickAudio.current) {
                tickAudio.current.play();
            }
        });

        gameStarted((response) => {

            setRoundStarted(true);
            if (response.errorMessage) {
                toast.error(response.errorMessage);
            } else if (response.gameMasterMessage) {
                toast.info(response.gameMasterMessage)
                if (tickAudio.current) {
                    tickAudio.current.play();
                }
            } else {
                toast.info(response.message);
            }


            gameEnded((response) => {
                if (tickAudio.current && !tickAudio.current.paused) {
                    tickAudio.current.pause();
                }
                boomAudio.current.play();
                setRoundLoser(response.loser);
                setPlayers(response.updatedPlayers);
                setShowLoserModal(true);
                resetState();
                removeListener('game-ended');
            })
        });

        onDisconnect((response) => {
            props.history.push('/');
        })

        // }
        return () => closeSocket();
    }, [])

    function handleCardClick() {
        getCurrentCard(clientId, (response) => {
            if (response.errorMessage) {
                toast.error(response.errorMessage);
            } else {
                setCurrentCard(response.card);
                setCardsLeft(response.cardsLeft);
            }
        })
    }

    function handleDiceClick() {
        getSocketDiceSide(clientId, (response) => {
            if (response.errorMessage) {
                toast.error(response.errorMessage);
            } else {
                setCurrentDiceSide(response.side);
            }
        });
    }


    function handleBombClick() {
        if (!roundStarted) {
            startTimer();
        }
        else if (roundStarted) {
            passBomb(clientId, (response) => {
                console.log(response)
                if (response.errorMessage) {
                    toast.error(response.errorMessage);
                } else {
                    tickAudio.current.pause();
                }
            });
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

    function resetState() {
        setRoundStarted(false);
    }

    function resetGame() {
        setGameover(false);
        setRoundLoser(null);
        //TODO: RESET CARDS
        players.forEach((player) => { player.roundsLost = 0 });
    }

    function startTimer() {
        setRoundStarted(true);
        startGame(clientId, (response) => {
            if (response.errorMessage) {
                toast.error(response.errorMessage);
            }
        })

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
                    title={`${roundLoser.name} lost this round!`}
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
            <audio loop={true} ref={tickAudio} src="/tick.mp3" id="tick-audio"></audio>
            <audio ref={boomAudio} src="/boom.mp3" id="bomb-audio"></audio>
            <div className="game-items-container">
                <Dice text={currentDiceSide} onClick={handleDiceClick}></Dice>
                <Card text={currentCard} onClick={handleCardClick}></Card>
            </div>
        </div >
    );
}

export default Game; 