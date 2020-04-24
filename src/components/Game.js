import React, { useState } from 'react';
import Bomb from "./Bomb";
import Dice from "./Dice";
import Card from "./Card";
import { NavLink } from 'react-router-dom';
import ResultsModal from './common/ResultsModal';
import { toast } from 'react-toastify';
import { getPlayersByGameId, updatePlayers, getSocketDiceSide, updateDiceSide, getCurrentCard, updateCurrentCard, isInstanceValid, startGame, addClientToGameRoom, changePlayer, passBomb, gameEnded, gameStarted } from '../socket_helper/playerSocket';
import { useEffect } from 'react';
import { useRef } from 'react';
import ModalTemplate from './common/ModalTemplate';
import { useCookies } from 'react-cookie';
import ItemList from './common/ItemList';

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
    const [isDiceRolled, setIsDiceRolled] = useState(false);
    const [isCardDrawn, setIsCardDrawn] = useState(false);
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
    //Get dice side, card and cardsLeft on refresh
    //Get players on round end
    ///

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            isInstanceValid(clientId, (isValid) => {
                if (isValid.errorMessage) {
                    console.log(isValid.errorMessage);
                } else if (!isValid) {
                    props.history.push('/');
                }
            });

            getPlayersByGameId(gameId, (_players) => {
                setPlayers(_players);
            });

            addClientToGameRoom(clientId, (response) => {
                if (response.errorMessage) {
                    console.log(response.errorMessage);
                    props.history.push('/');
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
                setPlayers(_players);
            })

            changePlayer((message) => {
                console.log(message);
                toast.warn(message);
                tickAudio.current.play();
            });

            gameStarted((message) => {
                toast.info(message);
                setRoundStarted(true);
            });

            gameEnded((loser) => {
                if (tickAudio.current && !tickAudio.current.paused) {
                    tickAudio.current.pause();
                }
                boomAudio.current.play();
                setRoundLoser(loser);
                setShowLoserModal(true);
                resetState();
            })

        }
        return () => mounted = false;
    }, [gameId, clientId])

    function handleCardClick() {
        if (isCardDrawn) {
            toast.error('You already drew a card')
            return;
        }
        getCurrentCard(clientId, (response) => {
            if (response.errorMessage) {
                toast.error(response.errorMessage);
            } else {
                setCurrentCard(response.card);
                setIsCardDrawn(true);
                setCardsLeft(response.cardsLeft);
            }
        })
    }

    function handleDiceClick() {
        if (isDiceRolled) {
            toast.error('You have already rolled the dice')
            return;
        }
        getSocketDiceSide(clientId, (response) => {
            if (response.errorMessage) {
                toast.error(response.errorMessage);
            } else {
                setIsDiceRolled(true);
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
        setIsCardDrawn(false);
        setIsDiceRolled(false);
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
            } else {
                toast.info(response.message)
                tickAudio.current.play();
            }
        })

    }

    return (
        <div className="game-container">
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
            <NavLink to="/">Menu</NavLink>
            {
                showLoserModal &&
                <ModalTemplate
                    show={showLoserModal}
                    title={`${roundLoser.name} lost this round!`}
                    noClose={hideLoserModal}
                    body={
                        <ItemList
                            items={players
                                .map((player) => {
                                    return `${player.name}  ${player.roundsLost}`;
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