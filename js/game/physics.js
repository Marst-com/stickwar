import { GAME } from "../core/constants.js";

export function applyGravity(player, dt = 16.67) {
    const factor = dt / 16.67;

    if (!player.grounded) {
        player.vy += GAME.GRAVITY * factor;
    }
}

export function integrate(player, dt = 16.67) {
    const factor = dt / 16.67;

    player.x += player.vx * factor;
    player.y += player.vy * factor;
}

export function applyFriction(player, amount = 0.78) {
    player.vx *= amount;
}

export function clampPlayer(player) {
    const ground = 600;

    if (player.y >= ground) {
        player.y = ground;
        player.vy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    player.x = Math.max(
        20,
        Math.min(
            GAME.WIDTH - 20,
            player.x
        )
    );
}

export function movePlayer(player, dt = 16.67) {
    applyGravity(player, dt);
    integrate(player, dt);
    clampPlayer(player);
}

export function distance(ax, ay, bx, by) {
    return Math.hypot(
        bx - ax,
        by - ay
    );
}

export function direction(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;

    const len = Math.hypot(dx, dy) || 1;

    return {
        x: dx / len,
        y: dy / len
    };
}
