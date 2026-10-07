import { SW } from "../core/state.js";

export function addEffect(
    player,
    type,
    duration,
    value = 0
) {
    if (!player.effects) {
        player.effects = {};
    }

    player.effects[type] = {
        time: duration,
        value
    };
}

export function hasEffect(
    player,
    type
) {
    return !!(
        player.effects &&
        player.effects[type] &&
        player.effects[type].time > 0
    );
}

export function getEffectValue(
    player,
    type,
    fallback = 0
) {
    return (
        player.effects?.[type]?.value ??
        fallback
    );
}

export function updateEffects(
    dt
) {
    for (
        const player of Object.values(
            SW.game.players
        )
    ) {
        if (!player.effects) {
            player.effects = {};
        }

        for (
            const [type, effect]
            of Object.entries(
                player.effects
            )
        ) {
            effect.time -= dt;

            if (effect.time <= 0) {
                delete player.effects[type];
            }
        }

        // burn
        if (
            player.effects.burn &&
            player.effects.burn.time > 0
        ) {
            const burn =
                player.effects.burn;

            burn.tick =
                (burn.tick || 0) - dt;

            if (burn.tick <= 0) {
                burn.tick = 1000;

                player.hp -=
                    burn.value || 1;

                if (player.hp <= 0) {
                    player.hp = 0;
                }
            }
        }
    }
}

export function addParticle(
    x,
    y,
    options = {}
) {
    SW.game.particles.push({
        x,
        y,
        vx: options.vx ?? 0,
        vy: options.vy ?? 0,
        life: options.life ?? 400,
        maxLife: options.life ?? 400,
        size: options.size ?? 4,
        gravity: options.gravity ?? 0.08,
        type: options.type ?? "normal"
    });
}

export function burst(
    x,
    y,
    count = 10,
    options = {}
) {
    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() *
            Math.PI * 2;

        const speed =
            Math.random() *
                (options.speed ?? 5) +
            1;

        addParticle(
            x,
            y,
            {
                vx:
                    Math.cos(angle) *
                    speed,
                vy:
                    Math.sin(angle) *
                    speed,
                life:
                    options.life ??
                    500,
                size:
                    options.size ??
                    3,
                gravity:
                    options.gravity ??
                    0.08,
                type:
                    options.type ??
                    "normal"
            }
        );
    }
}

export function updateParticles(dt) {
    for (
        let i =
            SW.game.particles.length -
            1;
        i >= 0;
        i--
    ) {
        const p =
            SW.game.particles[i];

        p.x += p.vx * dt / 16.67;
        p.y += p.vy * dt / 16.67;

        p.vy +=
            p.gravity *
            dt / 16.67;

        p.life -= dt;

        if (p.life <= 0) {
            SW.game.particles.splice(
                i,
                1
            );
        }
    }
}
