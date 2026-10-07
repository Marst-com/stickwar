import { SW } from "../core/state.js";
import { circleHit } from "./collision.js";
import { applyDamage } from "./combat.js";
import {
    addParticle,
    burst
} from "./effects.js";

let projectileId = 0;

export function createProjectile(
    owner,
    weapon,
    options = {}
) {
    const facing =
        owner.facing || 1;

    const angle =
        options.angle ??
        0;

    const speed =
        options.speed ??
        weapon.speed ??
        10;

    const projectile = {
        id:
            `projectile_${++projectileId}`,

        ownerId: owner.id,

        x:
            owner.x +
            facing * 25,

        y:
            owner.y + 32,

        vx:
            Math.cos(angle) *
            speed,

        vy:
            Math.sin(angle) *
            speed,

        damage:
            options.damage ??
            weapon.dmg ??
            10,

        type:
            options.type ??
            weapon.type ??
            "projectile",

        radius:
            options.radius ??
            6,

        life:
            options.life ??
            3000,

        maxLife:
            options.life ??
            3000,

        knockback:
            weapon.knockback ??
            3,

        pierce:
            weapon.pierce
                ? Infinity
                : 0,

        hitIds: new Set(),

        gravity:
            options.gravity ??
            0,

        explosive:
            weapon.type ===
            "explosive",

        explosionRadius:
            weapon.radius ??
            options.explosionRadius ??
            0,

        returning: false,

        returnSpeed:
            options.returnSpeed ??
            10,

        boomerang:
            weapon.type ===
            "boomerang",

        owner
    };

    SW.game.projectiles.push(
        projectile
    );

    return projectile;
}

export function updateProjectiles(dt) {
    const factor =
        dt / 16.67;

    for (
        let i =
            SW.game.projectiles.length -
            1;
        i >= 0;
        i--
    ) {
        const p =
            SW.game.projectiles[i];

        updateProjectile(
            p,
            dt,
            factor
        );

        if (p.life <= 0) {
            removeProjectile(i);
        }
    }
}

function updateProjectile(
    p,
    dt,
    factor
) {
    p.life -= dt;

    // blackhole
    if (p.type === "blackhole") {
        updateBlackhole(p, dt);
        return;
    }

    // boomerang
    if (
        p.boomerang &&
        p.life <
            p.maxLife * .45
    ) {
        p.returning = true;
    }

    if (p.returning) {
        const dx =
            p.owner.x - p.x;

        const dy =
            p.owner.y + 30 -
            p.y;

        const len =
            Math.hypot(dx, dy) ||
            1;

        p.vx =
            dx / len *
            p.returnSpeed;

        p.vy =
            dy / len *
            p.returnSpeed;
    }

    p.vy +=
        p.gravity *
        factor;

    p.x +=
        p.vx *
        factor;

    p.y +=
        p.vy *
        factor;

    checkProjectileHits(p);

    // world bounds
    if (
        p.x < -300 ||
        p.x > 1600 ||
        p.y < -300 ||
        p.y > 1000
    ) {
        p.life = 0;
    }

    // return to owner
    if (
        p.returning &&
        Math.hypot(
            p.owner.x - p.x,
            p.owner.y + 30 - p.y
        ) < 25
    ) {
        p.life = 0;
    }
}

function checkProjectileHits(p) {
    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id === p.ownerId
        ) {
            continue;
        }

        if (
            p.hitIds.has(
                target.id
            )
        ) {
            continue;
        }

        if (
            isFriendlyFire(
                p.owner,
                target
            )
        ) {
            continue;
        }

        if (
            circleHit(
                p.x,
                p.y,
                p.radius,
                {
                    x:
                        target.x -
                        target.width / 2,
                    y:
                        target.y,
                    width:
                        target.width,
                    height:
                        target.height
                }
            )
        ) {
            hitProjectile(
                p,
                target
            );

            p.hitIds.add(
                target.id
            );

            if (
                p.pierce !== Infinity
            ) {
                p.pierce--;

                if (
                    p.pierce < 0
                ) {
                    p.life = 0;
                }
            }

            if (
                p.explosive
            ) {
                explodeProjectile(
                    p
                );
                p.life = 0;
            }

            if (
                p.type === "blackhole"
            ) {
                p.life = 0;
            }

            if (
                p.life <= 0
            ) {
                break;
            }
        }
    }
}

function hitProjectile(
    projectile,
    target
) {
    const direction =
        projectile.vx >= 0
            ? 1
            : -1;

    applyDamage(
        projectile.owner,
        target,
        projectile.damage,
        {
            knockback:
                projectile.knockback,
            direction
        }
    );

    burst(
        projectile.x,
        projectile.y,
        7,
        {
            speed: 4,
            size: 3,
            type: "hit"
        }
    );
}

function explodeProjectile(
    projectile
) {
    const radius =
        projectile.explosionRadius ||
        60;

    burst(
        projectile.x,
        projectile.y,
        25,
        {
            speed: 8,
            size: 5,
            type: "explosion"
        }
    );

    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            projectile.ownerId
        ) {
            continue;
        }

        const distance =
            Math.hypot(
                target.x -
                    projectile.x,
                target.y +
                    35 -
                    projectile.y
            );

        if (
            distance <= radius
        ) {
            const multiplier =
                1 -
                distance /
                    radius *
                    .65;

            applyDamage(
                projectile.owner,
                target,
                projectile.damage *
                    multiplier,
                {
                    knockback:
                        projectile.knockback *
                        multiplier,
                    direction:
                        target.x >=
                        projectile.x
                            ? 1
                            : -1
                }
            );
        }
    }
}

function updateBlackhole(
    p,
    dt
) {
    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            p.ownerId
        ) {
            continue;
        }

        const dx =
            p.x - target.x;

        const dy =
            p.y -
            (target.y + 30);

        const distance =
            Math.hypot(dx, dy);

        const radius =
            p.explosionRadius ||
            150;

        if (
            distance <
            radius &&
            distance > 5
        ) {
            const strength =
                (1 -
                    distance /
                        radius) *
                .35;

            target.vx +=
                dx /
                distance *
                strength *
                8;

            target.vy +=
                dy /
                distance *
                strength *
                8;
        }
    }

    // visual particles
    if (
        Math.random() < .5
    ) {
        const angle =
            Math.random() *
            Math.PI * 2;

        const radius =
            30 +
            Math.random() * 100;

        addParticle(
            p.x +
                Math.cos(angle) *
                radius,
            p.y +
                Math.sin(angle) *
                radius,
            {
                vx:
                    -Math.cos(angle) *
                    2,
                vy:
                    -Math.sin(angle) *
                    2,
                life: 500,
                size: 3,
                gravity: 0,
                type:
                    "blackhole"
            }
        );
    }
}

function removeProjectile(index) {
    SW.game.projectiles.splice(
        index,
        1
    );
}

function isFriendlyFire(
    a,
    b
) {
    if (!a || !b) {
        return false;
    }

    if (
        a.team &&
        b.team &&
        a.team === b.team
    ) {
        return true;
    }

    return false;
}

export function clearProjectiles() {
    SW.game.projectiles.length = 0;
}
