export type Player = {
    id: number,
    name: string,
    points: number,
    average: number,
}

export enum Gamemode {
    'Normal' = 1,
    'AroundTheWorld' = 2,
}

export interface Game {
    players: Player[],
    Gamemode: Gamemode,
}
