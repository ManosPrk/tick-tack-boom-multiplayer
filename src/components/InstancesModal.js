import React from 'react';
import { getInstances } from '../socket_helper/playerSocket';
import { useState } from 'react';
import { useEffect } from 'react';
import ItemList from './common/ItemList';

function InstancesModals(props) {
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            getInstances().then((_games, _players) => {
                console.log(_games);
                const gamesArray = _games.map((game) =>
                    [
                        `id: ${game.id}`,
                        `cards: ${game.cards.length}`,
                        `playerWithBomb: ${game.playerWithBomb.id}, ${game.playerWithBomb.name}`,
                        `${game.players.map((player, index) => `Player: ${player.name} id:${player.id}, index of array: ${index}`)}`
                    ]
                )

                const playersArray = _players.map((player) =>
                    [
                        `id: ${player.id}`,
                        `cards: ${player.cards.length}`,
                        `playerWithBomb: ${player.playerWithBomb.id}, ${player.playerWithBomb.name}`,
                        `${player.players.map((player, index) => `Player: ${player.name} id:${player.id}, index of array: ${index}`)}`
                    ]
                )
                setGames(gamesArray);
                setPlayers(playersArray);
            })
        }
        return () => mounted = false;
    })


    return (
        <>
            {games.length > 0 &&
                games.map((game) => {
                    return (
                        <div style={{ border: '1px solid' }}>
                            <ItemList
                                items={game}
                            />
                        </div>
                    )
                })
            }
            {players.length > 0 &&
                players.map((player) => {
                    return (
                        <div style={{ border: '1px solid' }}>
                            <ItemList
                                items={player}
                            />
                        </div>
                    )
                })
            }
        </>
    );
}

export default InstancesModals;