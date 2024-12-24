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
        currentGame: useLocalStorage('current-game', { players: null, Gamemode: 0, currentPlayer: null, round: null }).value,
        previousGames: useLocalStorage('previous-games', []).value,
        players: useLocalStorage('players', []).value,
        gameLobby: useLocalStorage('game-lobby', { players: null, Gamemode: 0, currentPlayer: null, round: null }).value
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
            const game = this.getCurrentGame
            if (!game) return

            if (!Array.isArray(game.points)) {
                game.points = []
            }

            let pointsSet = game.points.find(
                (entry) => entry.player.id === game.currentPlayer!.id && entry.round === game.round
            )

            if (!pointsSet) {
                pointsSet = {
                    player: game.currentPlayer!,
                    round: game.round!,
                    points: [],
                }
                game.points.push(pointsSet)
            }

            const finalPoints = point * (multiplier ?? 1)
            pointsSet.points!.push(finalPoints)

            if (pointsSet.points!.length === 3) {
                const playerIndex = game.players!.findIndex((player) => player.id === game.currentPlayer!.id)
                if (playerIndex !== -1 && playerIndex < game.players!.length - 1) {
                    game.currentPlayer = game.players![playerIndex + 1]
                } else {
                    game.currentPlayer = game.players![0]
                    game.round!++
                }
            }

            this.currentGame = game
        },

        initializeGameLobby(gamemode: Gamemode) {
            this.gameLobby!.Gamemode = gamemode
            this.gameLobby!.players = []
            this.gameLobby!.currentPlayer = null
            this.gameLobby!.round = null

        },

        startGame() {
            if (this.currentGame) {
                this.previousGames.push(this.currentGame)
            }

            const shuffledPlayers = this.gameLobby!.players!.sort(() => Math.random() - 0.5)

            this.currentGame!.players = shuffledPlayers
            this.currentGame!.Gamemode = this.gameLobby!.Gamemode
            this.currentGame!.round = 0
            this.currentGame!.currentPlayer = shuffledPlayers[0]

            this.gameLobby!.players = null
            this.gameLobby!.Gamemode = null
            this.gameLobby!.round = null
            this.gameLobby!.currentPlayer = null
        }
    },
})
