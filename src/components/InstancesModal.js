import React from 'react';
import { getInstances, openSocket, closeSocket } from '../sockets/playerSocket';
import { useState } from 'react';
import { useEffect } from 'react';
import ItemList from './common/ItemList';

function InstancesModals(props) {
    const [games, setGames] = useState([]);

    useEffect(() => {
        openSocket();

        getInstances().then((_games, _players) => {
            console.log(_games);
            let gamesArray
            _games.forEach((game) => {

                gamesArray = [
                    `id: ${game.id}`,
                    `cards: ${game.cards.length}`,
                    `playerWithBomb: ${game.playerWithBomb ? `${game.playerWithBomb.id}, ${game.playerWithBomb.name}` : 'null'}`,
                ];
                game.players.forEach((player, index) => gamesArray.push(`Player: ${player.name} isGameMaster: ${player.isGameMaster} id:${player.id}, socket: ${player.socketId} index of array: ${index}`))
            }
            )
            setGames(gamesArray);
        })
        return () => closeSocket();
    }, [])


    return (
        <>
            {games.length > 0 &&
                <div>
                    <div style={{ border: '1px solid' }}>
                        <ItemList
                            items={games}
                        />
                    </div>
                    <br></br>
                </div>

            }
        </>
    );
}

export default InstancesModals;