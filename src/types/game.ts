export type Player = {
    id: number,
    name: string,
    totalPoints: number,
    average: number,
}

export interface Point {
    round: number;
    points?: number[];
    player: Player;
}
export interface Game {
    players: Player[] | null,
    Gamemode: Gamemode | null,
    currentPlayer: Player | null
    round: number | null
    winners: Player[],
    points?: Point[]
}


export enum Gamemode {
    'Normal' = 0,
    'AroundTheWorld' = 1,
}

export enum Multiplier {
    'Double' = 2,
    'Triple' = 3
}
