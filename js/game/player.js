import { SW } from "../core/state.js";
import { GAME } from "../core/constants.js";


let nextId = 1;


export function createLocalPlayer(
    data = {}
) {

    const id =
        data.id ||
        `player_${nextId++}`;


    return {

        id,

        uid:
            data.uid ||
            SW.user?.uid ||
            null,

        nickname:
            data.nickname ||
            SW.profile?.nickname ||
            "Player",


        x:
            data.x ??
            180,

        y:
            data.y ??
            400,


        vx: 0,

        vy: 0,


        width: 28,

        height: 76,


        hp:
            data.hp ??
            GAME.PLAYER_MAX_HP,

        maxHp:
            GAME.PLAYER_MAX_HP,


        facing:
            data.facing ||
            1,


        grounded:
            false,


        jumping:
            false,


        attacking:
            false,


        attackTimer:
            0,


        dashTimer:
            0,


        invincible:
            0,


        weapon:
            data.weapon ||
            SW.inventory.selectedWeapon,


        team:
            data.team ??
            1,


        kills: 0,

        deaths: 0,


        effects: {

            burn: 0,

            slow: 0,

            shield: 0

        },


        color:
            data.color ||
            "#ffffff"

    };

}


export function updatePlayer(
    player,
    dt
) {

    if (
        !player ||
        player.hp <= 0
    )
        return;


    const input =
        SW.input;


    /*
       이동
    */

    if (
        input.left
    ) {

        player.vx -=
            .55;

        player.facing =
            -1;

    }


    if (
        input.right
    ) {

        player.vx +=
            .55;

        player.facing =
            1;

    }


    /*
       감속
    */

    player.vx *=
        .84;


    /*
       최대 속도
    */

    const speed =
        player.effects.slow
            ? GAME.MOVE_SPEED *
              .55
            : GAME.MOVE_SPEED;


    player.vx =
        Math.max(
            -speed,
            Math.min(
                speed,
                player.vx
            )
        );


    /*
       점프
    */

    if (
        input.jump &&
        player.grounded
    ) {

        player.vy =
            -GAME.JUMP_POWER;

        player.grounded =
            false;

    }


    /*
       대시
    */

    if (
        input.dash &&
        player.dashTimer <= 0
    ) {

        player.vx =
            player.facing *
            GAME.DASH_POWER;

        player.dashTimer =
            800;

    }


    /*
       중력
    */

    player.vy +=
        GAME.GRAVITY;


    /*
       위치
    */

    player.x +=
        player.vx;

    player.y +=
        player.vy;


    /*
       바닥
    */

    const ground =
        600;


    if (
        player.y +
        player.height / 2 >=
        ground
    ) {

        player.y =
            ground -
            player.height / 2;

        player.vy =
            0;

        player.grounded =
            true;

    }


    /*
       쿨다운
    */

    player.attackTimer =
        Math.max(
            0,
            player.attackTimer -
            dt
        );


    player.dashTimer =
        Math.max(
            0,
            player.dashTimer -
            dt
        );


    /*
       상태 효과
    */

    player.effects.burn =
        Math.max(
            0,
            player.effects.burn -
            dt
        );


    player.effects.slow =
        Math.max(
            0,
            player.effects.slow -
            dt
        );


    player.invincible =
        Math.max(
            0,
            player.invincible -
            dt
        );

}
