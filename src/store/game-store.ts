import { Game, Gamemode, Player } from '@/types/game'
import { defineStore } from 'pinia'
import { RemovableRef, useStorage } from '@vueuse/core';

interface GameStoreState {
    currentGame: RemovableRef<Game | null>
    previousGames: RemovableRef<Game[]>
    players: RemovableRef<Player[]>
    gameLobby: RemovableRef<Game | null>
}


export const useGameStore = defineStore('GameStore', {
    state: (): GameStoreState => ({
        currentGame: useStorage<Game | null>('current-game', null, localStorage),
        previousGames: useStorage<Game[]>('previous-games', [], localStorage),
        players: useStorage<Player[]>('players', [], localStorage),
        gameLobby: useStorage<Game>('game-lobby', { Gamemode: Gamemode.Normal, players: [] }, localStorage),
    }),

    getters: {
        lastPlayers: (state): Player[] | null => {
            const lastGame = state.previousGames[state.previousGames.length - 1];
            return lastGame?.players || null;
        },
    },
    actions: {

        addPlayer(createdPlayer: string | Player) {

            if (typeof createdPlayer === 'string') {

                if (this.players?.find((plr) => plr.name.toLowerCase() === createdPlayer.toLowerCase())) return

                const id = this.players.length ? this.players[this.players.length - 1].id + 1 : 1
                const newPlayer = { id, name: createdPlayer, points: 0, average: 0 }
                this.players.push(newPlayer)
                const addedPlayer = this.players.find((player) => player.id === newPlayer.id)

                if (!addedPlayer) return

                if (this.gameLobby) {
                    this.gameLobby.players.push(addedPlayer);
                }
            } else {
                if (this.gameLobby) {
                    this.gameLobby.players.push(createdPlayer);
                }
            }
        },

        removePlayer(player: Player) {
            const index = this.gameLobby!.players.findIndex(
                (currentPlayer) => currentPlayer.id === player.id
            );
            console.log(index)
            if (index !== -1) {
                this.gameLobby!.players.splice(index, 1);
            }
        },

        initializeGameLobby(gamemode: Gamemode) {
            if (!this.gameLobby) {
                this.gameLobby = { Gamemode: gamemode, players: [] };
                console.log('Game lobby initialized');
            }

            if (!this.gameLobby.players) {
                this.gameLobby.players = [];
            }
        },

        startGame(players: Player[], gamemode: Gamemode) {
            if (this.currentGame) {
                this.previousGames.push(this.currentGame);
            }

            this.currentGame = {
                players: players.map(player => ({
                    ...player,
                    points: 0,
                })),
                Gamemode: gamemode,
            };
        },
    },
})
