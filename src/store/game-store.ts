import { Game, Gamemode, Multiplier, Player } from '@/types/game'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface GameStoreState {
    currentGame: Game | null
    previousGames: Game[]
    players: Player[]
    gameLobby: Game | null
}

export const useGameStore = defineStore('GameStore', {
    state: (): GameStoreState => ({
        currentGame: useLocalStorage('current-game', { players: null, Gamemode: 0, currentPlayer: null, round: null, winners: [] }).value,
        previousGames: useLocalStorage('previous-games', []).value,
        players: useLocalStorage('players', []).value,
        gameLobby: useLocalStorage('game-lobby', { players: null, Gamemode: 0, currentPlayer: null, round: null, winners: [] }).value
    }),

    getters: {
        lastPlayers: (state): Player[] | null => {
            const lastGame = state.previousGames[state.previousGames.length - 1]
            return lastGame?.players || null
        },

        getCurrentGame: (state): Game | null => {
            return state.currentGame
        }
    },
    actions: {

        addPlayer(createdPlayer: string | Player) {

            if (typeof createdPlayer === 'string') {
                if (createdPlayer.trim().length < 1) return

                if (this.players?.find((plr) => plr.name.toLowerCase() === createdPlayer.toLowerCase())) return

                const id = this.players.length ? this.players[this.players.length - 1].id + 1 : 1
                const newPlayer = { id, name: createdPlayer, totalPoints: 301, average: 0 }
                this.players.push(newPlayer)
                const addedPlayer = this.players.find((player) => player.id === newPlayer.id)

                if (!addedPlayer) return

                if (this.gameLobby) {
                    this.gameLobby.players!.push(addedPlayer)
                }
            } else {
                if (this.gameLobby) {
                    this.gameLobby.players!.push(createdPlayer)
                }
            }
        },

        removePlayer(player: Player) {
            const index = this.gameLobby!.players!.findIndex(
                (currentPlayer) => currentPlayer.id === player.id
            )
            if (index !== -1) {
                this.gameLobby!.players!.splice(index, 1)
            }
        },

        addPoint(point: number, multiplier?: Multiplier) {
            const game = this.getCurrentGame;
            if (!game) return;
            if (game.winners.find((plr) => plr.id === game.currentPlayer?.id)) return

            if (!Array.isArray(game.points)) {
                game.points = [];
            }

            let pointsSet = game.points.find(
                (entry) => entry.player.id === game.currentPlayer!.id && entry.round === game.round
            );

            if (!pointsSet) {
                pointsSet = {
                    player: game.currentPlayer!,
                    round: game.round!,
                    points: [],
                };
                game.points.push(pointsSet);
            }

            const finalPoints = point * (multiplier ?? 1);
            pointsSet.points!.push(finalPoints);

            if (pointsSet.points!.length === 3) {
                const activePlayers = game.players!.filter(
                    (player) =>
                        !game.winners.find((winner) => winner.id === player.id)
                );

                const currentPlayerIndex = activePlayers.findIndex(
                    (player) => player.id === game.currentPlayer!.id
                );

                if (currentPlayerIndex !== -1) {
                    if (currentPlayerIndex < activePlayers.length - 1) {
                        game.currentPlayer = activePlayers[currentPlayerIndex + 1];
                    } else {
                        game.currentPlayer = activePlayers[0];
                        game.round!++;
                    }
                }
            }

            this.currentGame = game;
        },

        initializeGameLobby(gamemode: Gamemode) {
            this.gameLobby!.Gamemode = gamemode
            this.gameLobby!.players = []
            this.gameLobby!.currentPlayer = null
            this.gameLobby!.round = null

        },

        incrementPlayer() {
            if (!this.currentGame!.players || !this.currentGame!.winners || !this.currentGame!.currentPlayer) return;

            const activePlayers = this.currentGame!.players.filter(
                (player) => !this.currentGame!.winners.some((winner) => winner.id === player.id)
            );

            if (activePlayers.length === 0) return;

            const currentPlayerIndex = activePlayers.findIndex(
                (player) => player.id === this.currentGame!.currentPlayer!.id
            );

            if (currentPlayerIndex !== -1 && currentPlayerIndex < activePlayers.length - 1) {
                this.currentGame!.currentPlayer = activePlayers[currentPlayerIndex + 1];
            } else {
                this.currentGame!.currentPlayer = activePlayers[0];
            }
        },

        startGame() {
            if (this.gameLobby!.players!.length < 1) return

            const shuffledPlayers = this.gameLobby!.players!.sort(() => Math.random() - 0.5)

            this.currentGame!.players = shuffledPlayers
            this.currentGame!.Gamemode = this.gameLobby!.Gamemode
            this.currentGame!.round = 1
            this.currentGame!.currentPlayer = shuffledPlayers[0]

            this.gameLobby!.players = null
            this.gameLobby!.Gamemode = null
            this.gameLobby!.round = null
            this.gameLobby!.currentPlayer = null
        },

        cancelGame() {
            this.currentGame!.players = null
            this.currentGame!.Gamemode = null
            this.currentGame!.round = null
            this.currentGame!.currentPlayer = null
            this.currentGame!.points = []
            this.currentGame!.winners = []
        },

        completeGame() {
            this.previousGames.push(JSON.parse(JSON.stringify(this.currentGame)))

            this.currentGame!.players = null
            this.currentGame!.Gamemode = null
            this.currentGame!.round = null
            this.currentGame!.currentPlayer = null
            this.currentGame!.points = []
            this.currentGame!.winners = []
        }
    },
})
