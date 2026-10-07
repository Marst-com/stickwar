import { SW } from "../core/state.js";
import { GAME } from "../core/constants.js";


export function createRenderer(
    canvas
) {

    const ctx =
        canvas.getContext(
            "2d"
        );


    function render() {

        /*
           BACKGROUND
        */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#101522";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
           SKY
        */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#18213a"
        );


        gradient.addColorStop(
            1,
            "#080b12"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
           GRID
        */

        ctx.strokeStyle =
            "rgba(255,255,255,.035)";

        ctx.lineWidth =
            1;


        for (
            let x = 0;
            x < canvas.width;
            x += 50
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.lineTo(
                x,
                canvas.height
            );

            ctx.stroke();

        }


        for (
            let y = 0;
            y < canvas.height;
            y += 50
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                canvas.width,
                y
            );

            ctx.stroke();

        }


        /*
           GROUND
        */

        ctx.fillStyle =
            "#20283a";

        ctx.fillRect(
            0,
            600,
            canvas.width,
            120
        );


        ctx.fillStyle =
            "#4c5a73";

        ctx.fillRect(
            0,
            596,
            canvas.width,
            5
        );


        /*
           PLAYERS
        */

        Object.values(
            SW.game.players
        )
        .forEach(
            player =>
                drawPlayer(
                    ctx,
                    player
                )
        );


        /*
           PROJECTILES
        */

        SW.game.projectiles
            .forEach(
                projectile =>
                    drawProjectile(
                        ctx,
                        projectile
                    )
            );


        /*
           EFFECTS
        */

        SW.game.effects
            .forEach(
                effect =>
                    drawEffect(
                        ctx,
                        effect
                    )
            );

    }


    return {
        render
    };

}


function drawPlayer(
    ctx,
    player
) {

    const x =
        player.x;


    const y =
        player.y;


    const direction =
        player.facing;


    /*
       그림자
    */

    ctx.fillStyle =
        "rgba(0,0,0,.3)";


    ctx.beginPath();

    ctx.ellipse(
        x,
        603,
        24,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       머리
    */

    ctx.strokeStyle =
        player.color ||
        "#fff";

    ctx.fillStyle =
        player.color ||
        "#fff";


    ctx.lineWidth =
        5;


    ctx.beginPath();

    ctx.arc(
        x,
        y - 31,
        13,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    /*
       몸
    */

    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 18
    );

    ctx.lineTo(
        x,
        y + 20
    );

    ctx.stroke();


    /*
       팔
    */

    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 10
    );

    ctx.lineTo(
        x +
        direction * 23,
        y + 5
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 10
    );

    ctx.lineTo(
        x -
        direction * 18,
        y + 4
    );

    ctx.stroke();


    /*
       다리
    */

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + 20
    );

    ctx.lineTo(
        x -
        direction * 16,
        y + 48
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x,
        y + 20
    );

    ctx.lineTo(
        x +
        direction * 17,
        y + 48
    );

    ctx.stroke();


    /*
       HP BAR
    */

    const hpWidth =
        55;


    ctx.fillStyle =
        "rgba(0,0,0,.6)";


    ctx.fillRect(
        x - hpWidth / 2,
        y - 60,
        hpWidth,
        6
    );


    ctx.fillStyle =
        "#54e88a";


    ctx.fillRect(
        x - hpWidth / 2,
        y - 60,
        hpWidth *
        Math.max(
            0,
            player.hp /
            player.maxHp
        ),
        6
    );


    /*
       닉네임
    */

    ctx.font =
        "11px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "#fff";


    ctx.fillText(
        player.nickname,
        x,
        y - 68
    );

}


function drawProjectile(
    ctx,
    projectile
) {

    ctx.fillStyle =
        projectile.color ||
        "#fff";


    ctx.beginPath();

    ctx.arc(
        projectile.x,
        projectile.y,
        projectile.radius ||
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


function drawEffect(
    ctx,
    effect
) {

    ctx.globalAlpha =
        Math.max(
            0,
            effect.life /
            effect.maxLife
        );


    ctx.strokeStyle =
        effect.color ||
        "#fff";


    ctx.lineWidth =
        effect.width ||
        4;


    ctx.beginPath();

    ctx.arc(
        effect.x,
        effect.y,
        effect.radius ||
        20,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.globalAlpha =
        1;

}
