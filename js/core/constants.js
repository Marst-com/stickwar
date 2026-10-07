export const GAME = {

    WIDTH: 1280,

    HEIGHT: 720,

    TICK_RATE: 60,

    MAX_PLAYERS: 4,

    MATCH_TIME: 180,

    PLAYER_MAX_HP: 100,

    GRAVITY: 0.65,

    MOVE_SPEED: 5,

    JUMP_POWER: 13,

    DASH_POWER: 14

};


export const MODES = {

    "1v1": {
        players: 2
    },

    "2v2": {
        players: 4,
        teams: 2
    },

    "1v1v1": {
        players: 3,
        teams: 3
    },

    "1v1v1v1": {
        players: 4,
        teams: 4
    }

};


export const RARITY = {

    COMMON: "COMMON",

    RARE: "RARE",

    EPIC: "EPIC",

    GOLD: "GOLD",

    DIAMOND: "DIAMOND",

    LEGENDARY: "LEGENDARY",

    QUESTION: "???"

};
