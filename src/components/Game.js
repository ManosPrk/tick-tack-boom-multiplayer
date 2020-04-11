import React, { useState } from 'react';
import Bomb from "./Bomb";
import Dice from "./Dice";
import Card from "./Card";
import { getRandomSecs } from "../Utilities"
import LoserModal from './common/LoserModal';
import { NavLink } from 'react-router-dom';
import ResultsModal from './common/ResultsModal';
import { toast } from 'react-toastify';
import { getPlayersByGameId, updatePlayers, getSocketDiceSide, updateDiceSide, getCurrentCard, updateCurrentCard, isInstanceValid, startGame, getSocketId, changePlayer, passBomb, gameEnded, gameStarted } from '../socket_helper/playerSocket';
import { useEffect } from 'react';
import { useRef } from 'react';

function Game(props) {
    const [cardsLeft, setCardsLeft] = useState();
    const gameId = props.match.params.id;
    const yourPlayerId = getSocketId();
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

    useEffect(() => {
        let mounted = true;
        if (mounted) {

            isInstanceValid(gameId, (isValid) => {
                if (!isValid) {
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

            getPlayersByGameId(gameId).then((_players) => {
                setPlayers(_players);
            });

            changePlayer((message) => {
                toast.warn(message);
                tickAudio.current.play();
            });

            gameStarted((message) => {
                toast.info(message);
                setRoundStarted(true);
            });

            gameEnded((loserMessage) => {
                // const loser = players.find((player) => player.id === loser.id);
                if (!tickAudio.current.paused) {
                    tickAudio.current.pause();
                }
                boomAudio.current.play();
                toast.info(loserMessage);
            })

        }
        return () => mounted = false;
    }, [gameId])

    function handleCardClick() {
        if (isCardDrawn) {
            toast.error('You already drew a card')
            return;
        }
        getCurrentCard(gameId, (response) => {
            if (response.errorMessage) {
                console.log(response.errorMessage);
            }
            setCurrentCard(response.card);
            setIsCardDrawn(true);
            setCardsLeft(response.cardsLeft);
        })
    }

    function handleDiceClick() {
        if (isDiceRolled) {
            toast.error('You have already rolled the dice')
            return;
        }
        getSocketDiceSide(gameId, (response) => {
            if (response.errorMessage) {
                console.log(response.errorMessage);
            }
            setIsDiceRolled(true);
            setCurrentDiceSide(response.side);
        });
    }


    function handleBombClick() {
        // const cardError = `${!isCardDrawn ? `draw a card` : ''}`;
        // const diceError = `${!isDiceRolled ? 'roll the dice' : ''}`;
        // // if (!isDiceRolled || !isCardDrawn) {
        // //     toast.error(`Please ${diceError}${!isDiceRolled && !isCardDrawn ? ' and ' : ''}${cardError}.`)
        // //     return;
        // // }
        // if (roundStarted) {
        //     return;
        // }
        const player = players.find((player) => player.id === yourPlayerId);
        if (player.isLeader && !roundStarted) {
            startTimer();
        }
        else if (roundStarted) {
            tickAudio.current.pause();
            passBomb(gameId, yourPlayerId);
        }
    }

    function hideLoserModal(event) {
        event.preventDefault();
        players[event.target.value].roundsLost++;
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
        //TODO: RESET CARDS
        players.forEach((player) => { player.roundsLost = 0 });
    }

    function startTimer() {
        setRoundStarted(true);
        tickAudio.current.play().then(() => startGame(gameId, yourPlayerId, (message) => toast.info(message)));
        // tickAudio.play().then(() => {
        //     setTimeout(() => {
        //         tickAudio.pause();
        //         boomAudio.play();
        //         setShowLoserModal(true);
        //         resetState();
        //     }, randomExplodingTime * 1000);
        // })
    }

    return (
        <div className="game-container">
            <NavLink to="/">Menu</NavLink>
            <LoserModal show={showLoserModal} close={hideLoserModal} players={[...players]}></LoserModal>
            {/* {cards.length === 0 && <ResultsModal show={showResultsModal} close={hideResultsModal} players={[...players]} />} */}
            {gameOver && <ResultsModal show={showResultsModal} newGame={resetGame} close={hideResultsModal} players={[...players]} />}
            <Bomb onClick={handleBombClick}></Bomb>
            <span>Remaining syllables: {cardsLeft} </span>
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