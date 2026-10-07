import { SW } from "../core/state.js";

import {
    updatePlayer
} from "./player.js";

import {
    updateCombat
} from "./combat.js";

import {
    updateProjectiles
} from "./projectile.js";

import {
    updateEffects
} from "./effects.js";


let running = false;

let lastTime = 0;


export function startGameLoop(
    renderer
) {

    if (running)
        return;


    running =
        true;


    lastTime =
        performance.now();


    requestAnimationFrame(
        frame => loop(
            frame,
            renderer
        )
    );

}


function loop(
    timestamp,
    renderer
) {

    if (
        !SW.game.running
    ) {

        running =
            false;

        return;

    }


    const dt =
        Math.min(
            timestamp -
            lastTime,
            50
        );


    lastTime =
        timestamp;


    /*
       PLAYER
    */

    Object.values(
        SW.game.players
    )
    .forEach(
        player => {

            if (
                player.uid ===
                SW.user?.uid
            ) {

                updatePlayer(
                    player,
                    dt
                );

            }

        }
    );


    /*
       COMBAT
    */

    updateCombat(
        dt
    );


    /*
       PROJECTILES
    */

    updateProjectiles(
        dt
    );


    /*
       EFFECTS
    */

    updateEffects(
        dt
    );


    /*
       RENDER
    */

    renderer.render();


    requestAnimationFrame(
        frame => loop(
            frame,
            renderer
        )
    );

}
