import { SW } from "../core/state.js";
import { WEAPONS } from "../weapons/weapons.js";

import {
    distance,
    lineIntersectsRect
} from "./collision.js";

import {
    createProjectile
} from "./projectile.js";

import {
    addEffect,
    burst
} from "./effects.js";

import {
    startWeaponAttack
} from "./weapon-state.js";

const attackStates = new Map();

function getState(id) {
    if (!attackStates.has(id)) {
        attackStates.set(id, {
            cooldown: 0,
            attacking: false,
            attackConsumed: false
        });
    }

    return attackStates.get(id);
}

export function updateCombat(dt) {
    for (
        const player of Object.values(
            SW.game.players
        )
    ) {
        const state =
            getState(player.id);

        if (state.cooldown > 0) {
            state.cooldown -= dt;

            if (
                state.cooldown < 0
            ) {
                state.cooldown = 0;
            }
        }

        if (
            player.attackRequested
        ) {
            player.attackRequested =
                false;

            tryAttack(player);
        }
    }
}

export function requestAttack(
    player
) {
    player.attackRequested = true;
}

export function tryAttack(player) {
    const weaponId =
        player.weapon ||
        SW.inventory.selectedWeapon ||
        "wood_sword";

    const weapon =
        WEAPONS[weaponId];

    if (!weapon) {
        return;
    }

    const state =
        getState(player.id);

    if (
        state.cooldown > 0
    ) {
        return;
    }

    if (
        player.dead ||
        player.hp <= 0
    ) {
        return;
    }

    state.cooldown =
        weapon.cooldown ||
        500;

    state.attacking = true;

    startWeaponAttack(
        player.id,
        weapon
    );

    player.attacking = true;

    switch (
        weapon.type
    ) {
        case "melee":
            meleeAttack(
                player,
                weapon
            );
            break;

        case "projectile":
            projectileAttack(
                player,
                weapon
            );
            break;

        case "shotgun":
            shotgunAttack(
                player,
                weapon
            );
            break;

        case "boomerang":
            boomerangAttack(
                player,
                weapon
            );
            break;

        case "explosive":
            explosiveAttack(
                player,
                weapon
            );
            break;

        case "laser":
            laserAttack(
                player,
                weapon
            );
            break;

        case "lightning":
            lightningAttack(
                player,
                weapon
            );
            break;

        case "blackhole":
            blackholeAttack(
                player,
                weapon
            );
            break;

        case "star":
        case "zero":
        case "admin":
            specialAttack(
                player,
                weapon
            );
            break;

        default:
            projectileAttack(
                player,
                weapon
            );
    }
}

/* =========================================================
   MELEE
========================================================= */

function meleeAttack(
    attacker,
    weapon
) {
    const direction =
        attacker.facing || 1;

    const range =
        weapon.range || 60;

    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            attacker.id
        ) {
            continue;
        }

        if (
            isFriendlyFire(
                attacker,
                target
            )
        ) {
            continue;
        }

        const dx =
            target.x -
            attacker.x;

        const dy =
            target.y -
            attacker.y;

        const dist =
            Math.hypot(dx, dy);

        if (
            dist >
            range + 35
        ) {
            continue;
        }

        if (
            dx * direction < -15
        ) {
            continue;
        }

        const vertical =
            Math.abs(dy);

        if (
            vertical > 85
        ) {
            continue;
        }

        applyDamage(
            attacker,
            target,
            weapon.dmg,
            {
                knockback:
                    weapon.knockback ||
                    3,
                direction
            }
        );

        if (
            weapon.burn
        ) {
            addEffect(
                target,
                "burn",
                3000,
                weapon.burn
            );
        }

        if (
            weapon.slow
        ) {
            addEffect(
                target,
                "slow",
                3000,
                weapon.slow
            );
        }

        burst(
            target.x,
            target.y + 35,
            12,
            {
                speed: 5,
                size: 4,
                type:
                    weapon.type ===
                    "melee"
                        ? "slash"
                        : "hit"
            }
        );
    }
}

/* =========================================================
   PROJECTILES
========================================================= */

function projectileAttack(
    player,
    weapon
) {
    const angle =
        player.facing === -1
            ? Math.PI
            : 0;

    createProjectile(
        player,
        weapon,
        {
            angle
        }
    );
}

function shotgunAttack(
    player,
    weapon
) {
    const pellets =
        weapon.pellets || 6;

    const direction =
        player.facing === -1
            ? Math.PI
            : 0;

    const spread =
        weapon.spread || .25;

    for (
        let i = 0;
        i < pellets;
        i++
    ) {
        const angle =
            direction +
            (
                Math.random() -
                .5
            ) *
            spread;

        createProjectile(
            player,
            weapon,
            {
                angle,
                damage:
                    weapon.dmg
            }
        );
    }
}

function boomerangAttack(
    player,
    weapon
) {
    createProjectile(
        player,
        weapon,
        {
            angle:
                player.facing === -1
                    ? Math.PI
                    : 0,
            life: 2400,
            returnSpeed: 13
        }
    );
}

function explosiveAttack(
    player,
    weapon
) {
    createProjectile(
        player,
        weapon,
        {
            angle:
                player.facing === -1
                    ? Math.PI
                    : 0,
            speed:
                weapon.speed || 10,
            radius:
                9,
            life:
                3500,
            gravity:
                .12
        }
    );
}

/* =========================================================
   LASER
========================================================= */

function laserAttack(
    attacker,
    weapon
) {
    const direction =
        attacker.facing || 1;

    const startX =
        attacker.x;

    const startY =
        attacker.y + 32;

    const endX =
        startX +
        direction *
        (weapon.range || 700);

    const endY =
        startY;

    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            attacker.id
        ) {
            continue;
        }

        if (
            isFriendlyFire(
                attacker,
                target
            )
        ) {
            continue;
        }

        const rect = {
            x:
                target.x -
                target.width / 2,

            y:
                target.y,

            width:
                target.width,

            height:
                target.height
        };

        if (
            lineIntersectsRect(
                startX,
                startY,
                endX,
                endY,
                rect
            )
        ) {
            applyDamage(
                attacker,
                target,
                weapon.dmg,
                {
                    knockback:
                        weapon.knockback ||
                        4,
                    direction
                }
            );
        }
    }

    burst(
        endX,
        endY,
        20,
        {
            speed: 7,
            size: 3,
            type: "laser"
        }
    );
}

/* =========================================================
   LIGHTNING
========================================================= */

function lightningAttack(
    attacker,
    weapon
) {
    const candidates = [];

    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            attacker.id
        ) {
            continue;
        }

        if (
            isFriendlyFire(
                attacker,
                target
            )
        ) {
            continue;
        }

        const d =
            distance(
                attacker.x,
                attacker.y,
                target.x,
                target.y
            );

        if (
            d <=
            (weapon.range || 900)
        ) {
            candidates.push({
                target,
                distance: d
            });
        }
    }

    candidates.sort(
        (a, b) =>
            a.distance -
            b.distance
    );

    const chain =
        Math.min(
            weapon.chain || 1,
            candidates.length
        );

    for (
        let i = 0;
        i < chain;
        i++
    ) {
        const target =
            candidates[i].target;

        applyDamage(
            attacker,
            target,
            weapon.dmg,
            {
                knockback: 10,
                direction:
                    target.x >=
                    attacker.x
                        ? 1
                        : -1
            }
        );

        addEffect(
            target,
            "stun",
            350
        );

        burst(
            target.x,
            target.y + 30,
            18,
            {
                speed: 8,
                size: 4,
                type: "lightning"
            }
        );
    }
}

/* =========================================================
   BLACKHOLE
========================================================= */

function blackholeAttack(
    player,
    weapon
) {
    createProjectile(
        player,
        weapon,
        {
            type: "blackhole",
            speed:
                weapon.speed || 7,
            radius:
                25,
            life:
                weapon.duration ||
                2500,
            explosionRadius:
                weapon.radius ||
                150
        }
    );
}

/* =========================================================
   ??? WEAPONS
========================================================= */

function specialAttack(
    player,
    weapon
) {
    switch (
        weapon.type
    ) {
        case "star":
            starAttack(
                player,
                weapon
            );
            break;

        case "zero":
            zeroAttack(
                player,
                weapon
            );
            break;

        case "admin":
            adminAttack(
                player,
                weapon
            );
            break;
    }
}

function starAttack(
    player,
    weapon
) {
    const range =
        weapon.range || 180;

    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            player.id
        ) {
            continue;
        }

        if (
            isFriendlyFire(
                player,
                target
            )
        ) {
            continue;
        }

        const d =
            distance(
                player.x,
                player.y,
                target.x,
                target.y
            );

        if (
            d <= range
        ) {
            applyDamage(
                player,
                target,
                weapon.dmg,
                {
                    knockback:
                        weapon.knockback ||
                        30,
                    direction:
                        target.x >=
                        player.x
                            ? 1
                            : -1
                }
            );
        }
    }

    burst(
        player.x,
        player.y + 30,
        50,
        {
            speed: 10,
            size: 5,
            life: 900,
            gravity: 0,
            type: "star"
        }
    );
}

function zeroAttack(
    player,
    weapon
) {
    /*
     * 순간이동식 돌진 공격
     */
    const direction =
        player.facing || 1;

    player.invincible = 250;

    player.vx =
        direction *
        25;

    player.vy = -2;

    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            player.id
        ) {
            continue;
        }

        if (
            isFriendlyFire(
                player,
                target
            )
        ) {
            continue;
        }

        if (
            Math.abs(
                target.x -
                player.x
            ) < 220 &&
            Math.abs(
                target.y -
                player.y
            ) < 90
        ) {
            applyDamage(
                player,
                target,
                weapon.dmg,
                {
                    knockback: 35,
                    direction
                }
            );
        }
    }
}

function adminAttack(
    player,
    weapon
) {
    if (!player.isAdmin) {
        return;
    }

    for (
        const target of Object.values(
            SW.game.players
        )
    ) {
        if (
            target.id ===
            player.id
        ) {
            continue;
        }

        target.hp = 0;

        killPlayer(
            player,
            target
        );
    }

    burst(
        player.x,
        player.y + 30,
        100,
        {
            speed: 15,
            size: 7,
            life: 1500,
            gravity: 0,
            type: "admin"
        }
    );
}

/* =========================================================
   DAMAGE
========================================================= */

export function applyDamage(
    attacker,
    target,
    damage,
    options = {}
) {
    if (
        target.dead ||
        target.hp <= 0
    ) {
        return;
    }

    if (
        target.invincible &&
        target.invincible > 0
    ) {
        return;
    }

    if (
        target.effects?.shield &&
        target.effects.shield.time > 0
    ) {
        damage *= .5;
    }

    damage =
        Math.max(
            0,
            Number(damage) || 0
        );

    target.hp -= damage;

    const direction =
        options.direction ??
        (
            target.x >=
            attacker.x
                ? 1
                : -1
        );

    const knockback =
        options.knockback ?? 0;

    target.vx +=
        direction *
        knockback;

    target.vy -=
        Math.min(
            knockback * .35,
            8
        );

    target.hitFlash = 120;

    if (
        target.hp <= 0
    ) {
        target.hp = 0;

        killPlayer(
            attacker,
            target
        );
    }

    // lifesteal
    const attackerWeapon =
        attacker.weapon &&
        WEAPONS[
            attacker.weapon
        ];

    if (
        attackerWeapon?.lifesteal
    ) {
        attacker.hp =
            Math.min(
                attacker.maxHp,
                attacker.hp +
                damage *
                attackerWeapon.lifesteal
            );
    }
}

function killPlayer(
    killer,
    victim
) {
    if (victim.dead) {
        return;
    }

    victim.dead = true;
    victim.deaths =
        (victim.deaths || 0) +
        1;

    if (killer) {
        killer.kills =
            (killer.kills || 0) +
            1;
    }

    burst(
        victim.x,
        victim.y + 35,
        30,
        {
            speed: 8,
            size: 5,
            life: 900,
            type: "death"
        }
    );

    setTimeout(() => {
        if (!SW.game.running) {
            return;
        }

        victim.hp =
            victim.maxHp;

        victim.dead = false;

        victim.x =
            200 +
            Math.random() *
            800;

        victim.y = 500;

        victim.vx = 0;
        victim.vy = 0;
    }, 2500);
}

function isFriendlyFire(
    a,
    b
) {
    return (
        a?.team &&
        b?.team &&
        a.team === b.team
    );
}

export function clearCombat() {
    attackStates.clear();
}
