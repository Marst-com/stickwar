import { SW } from "../core/state.js";
import { GAME } from "../core/constants.js";
import { emit } from "../core/events.js";

import {
    startGameLoop
} from "./loop.js";

import {
    createLocalPlayer
} from "./player.js";

import {
    createRenderer
} from "./renderer.js";

import {
    setupGameInput
} from "./input.js";


let renderer = null;


export function initGame() {

    const canvas =
        document.getElementById(
            "gameCanvas"
        );

    if (!canvas) {
        console.error(
            "gameCanvas not found"
        );
        return;
    }


    canvas.width =
        GAME.WIDTH;

    canvas.height =
        GAME.HEIGHT;


    renderer =
        createRenderer(
            canvas
        );


    setupGameInput();


    window.addEventListener(
        "stickwar-game-start",
        startNetworkGame
    );


    console.log(
        "Game module ready."
    );

}


export function startNetworkGame(
    event
) {

    const data =
        event.detail || {};


    SW.game.running =
        true;


    SW.game.time =
        GAME.MATCH_TIME;


    SW.game.players =
        {};


    SW.game.projectiles =
        [];


    SW.game.effects =
        [];


    const local =
        createLocalPlayer(
            data.player ||
            {}
        );


    SW.game.players[
        local.id
    ] =
        local;


    emit(
        "game:start",
        data
    );


    startGameLoop(
        renderer
    );

}
