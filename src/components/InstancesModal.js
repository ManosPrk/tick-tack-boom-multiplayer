import React from 'react';
import { getInstances } from '../socket_helper/playerSocket';
import { useState } from 'react';
import { useEffect } from 'react';
import ModalTemplate from './common/ModalTemplate';
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
                // const gamesArray = _games.map((game) =>
                //     `id: ${game.id}\n cards: ${game.cards.length}\n playerWithBomb: ${game.playerWithBomb.id}, ${game.playerWithBomb.name}\n ${game.players.map((player, index) => `${player.id}, ${player.name}, index: ${index}`)}`
                // )
                console.log(gamesArray);
                setGames(gamesArray);
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
        </>
    );
}

export default InstancesModals;