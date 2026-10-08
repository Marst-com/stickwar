import { SW } from "../core/state.js";
import { GAME } from "../core/constants.js";

import {
    drawWeapon
} from "./weapon-renderer.js";

import {
    getWeaponState,
    updateWeaponState,
    getAttackProgress
} from "./weapon-state.js";

/*
 * StickWar 2.0
 * Canvas Renderer
 *
 * Canvas 하나로:
 * - 배경
 * - 맵
 * - 플레이어
 * - 무기
 * - 발사체
 * - 파티클
 * - HP
 * - 닉네임
 * - 공격 궤적
 * - 이펙트
 * 를 렌더링한다.
 */

let canvas = null;
let ctx = null;

let rendererInitialized = false;

const camera = {
    x: 0,
    y: 0,
    zoom: 1
};

let screenShake = 0;
let screenShakeX = 0;
let screenShakeY = 0;

/* =========================================================
   INIT
========================================================= */

export function createRenderer(
    targetCanvas
) {
    canvas =
        targetCanvas ||
        document.getElementById(
            "gameCanvas"
        );

    if (!canvas) {
        throw new Error(
            "gameCanvas not found"
        );
    }

    ctx =
        canvas.getContext(
            "2d",
            {
                alpha: false
            }
        );

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    rendererInitialized =
        true;

    return {
        render,
        resize: resizeCanvas,
        getContext: () => ctx,
        getCanvas: () => canvas
    };
}

/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {
    if (!canvas) {
        return;
    }

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        Math.min(
            window.devicePixelRatio ||
                1,
            2
        );

    canvas.width =
        Math.max(
            1,
            Math.floor(
                rect.width * dpr
            )
        );

    canvas.height =
        Math.max(
            1,
            Math.floor(
                rect.height * dpr
            )
        );

    /*
     * CSS 크기와 별개로
     * 게임은 1280×720 기준으로 그림.
     */
    ctx.setTransform(
        canvas.width /
            GAME.WIDTH,
        0,
        0,
        canvas.height /
            GAME.HEIGHT,
        0,
        0
    );
}

/* =========================================================
   MAIN RENDER
========================================================= */

export function render() {
    if (
        !rendererInitialized ||
        !ctx ||
        !canvas
    ) {
        return;
    }

    /*
     * 화면 전체 초기화
     */
    ctx.setTransform(
        canvas.width /
            GAME.WIDTH,
        0,
        0,
        canvas.height /
            GAME.HEIGHT,
        0,
        0
    );

    ctx.clearRect(
        0,
        0,
        GAME.WIDTH,
        GAME.HEIGHT
    );

    /*
     * 카메라 계산
     */
    updateCamera();

    /*
     * 배경
     */
    drawBackground();

    /*
     * 월드
     */
    ctx.save();

    applyCamera();

    drawMap();
    drawWorldEffectsBack();
    drawProjectiles();
    drawPlayers();
    drawParticles();
    drawWorldEffectsFront();

    ctx.restore();

    /*
     * UI
     */
    drawGameUI();

    /*
     * 화면 흔들림 감소
     */
    screenShake *= .85;

    if (
        screenShake < .1
    ) {
        screenShake = 0;
    }
}

/* =========================================================
   CAMERA
========================================================= */

function updateCamera() {
    const player =
        getLocalPlayer();

    if (!player) {
        camera.x = 0;
        camera.y = 0;
        return;
    }

    const targetX =
        player.x -
        GAME.WIDTH / 2;

    const targetY =
        player.y -
        GAME.HEIGHT / 2 +
        80;

    camera.x +=
        (
            targetX -
            camera.x
        ) * .08;

    camera.y +=
        (
            targetY -
            camera.y
        ) * .08;

    /*
     * 맵 밖으로 카메라가
     * 너무 나가지 않게 한다.
     */
    camera.x =
        Math.max(
            -100,
            Math.min(
                camera.x,
                GAME.WIDTH
            )
        );

    camera.y =
        Math.max(
            -100,
            Math.min(
                camera.y,
                150
            )
        );
}

function applyCamera() {
    ctx.translate(
        -camera.x +
            screenShakeX,
        -camera.y +
            screenShakeY
    );
}

/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground() {
    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            GAME.HEIGHT
        );

    gradient.addColorStop(
        0,
        "#111827"
    );

    gradient.addColorStop(
        .55,
        "#172033"
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
        GAME.WIDTH,
        GAME.HEIGHT
    );

    /*
     * 먼 배경 빛
     */
    const glow =
        ctx.createRadialGradient(
            GAME.WIDTH * .5,
            180,
            20,
            GAME.WIDTH * .5,
            180,
            500
        );

    glow.addColorStop(
        0,
        "rgba(100,160,255,.12)"
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
        glow;

    ctx.fillRect(
        0,
        0,
        GAME.WIDTH,
        GAME.HEIGHT
    );
}

/* =========================================================
   MAP
========================================================= */

function drawMap() {
    const groundY = 600;

    /*
     * 땅
     */
    const ground =
        ctx.createLinearGradient(
            0,
            groundY,
            0,
            GAME.HEIGHT
        );

    ground.addColorStop(
        0,
        "#27313a"
    );

    ground.addColorStop(
        1,
        "#11161b"
    );

    ctx.fillStyle =
        ground;

    ctx.fillRect(
        -500,
        groundY,
        GAME.WIDTH + 1000,
        GAME.HEIGHT -
            groundY +
            500
    );

    /*
     * 지면 상단
     */
    ctx.fillStyle =
        "#4d6472";

    ctx.fillRect(
        -500,
        groundY,
        GAME.WIDTH + 1000,
        5
    );

    /*
     * 격자
     */
    ctx.strokeStyle =
        "rgba(255,255,255,.045)";

    ctx.lineWidth = 1;

    const startX =
        Math.floor(
            camera.x / 50
        ) * 50 - 100;

    const endX =
        camera.x +
        GAME.WIDTH +
        100;

    for (
        let x = startX;
        x < endX;
        x += 50
    ) {
        ctx.beginPath();

        ctx.moveTo(
            x,
            groundY
        );

        ctx.lineTo(
            x,
            GAME.HEIGHT + 100
        );

        ctx.stroke();
    }

    /*
     * 기본 플랫폼
     */
    drawPlatform(
        250,
        480,
        220,
        22
    );

    drawPlatform(
        810,
        430,
        220,
        22
    );
}

function drawPlatform(
    x,
    y,
    width,
    height
) {
    ctx.fillStyle =
        "#35434e";

    ctx.fillRect(
        x,
        y,
        width,
        height
    );

    ctx.fillStyle =
        "#607784";

    ctx.fillRect(
        x,
        y,
        width,
        4
    );

    ctx.strokeStyle =
        "rgba(255,255,255,.08)";

    ctx.strokeRect(
        x,
        y,
        width,
        height
    );
}

/* =========================================================
   PLAYERS
========================================================= */

function drawPlayers() {
    const players =
        Object.values(
            SW.game.players
        );

    /*
     * 뒤에 있는 플레이어부터
     */
    players.sort(
        (a, b) =>
            a.y - b.y
    );

    for (
        const player of players
    ) {
        drawPlayer(
            player
        );
    }
}

function drawPlayer(
    player
) {
    if (
        player.dead
    ) {
        return;
    }

    /*
     * 무적 시 깜빡임
     */
    if (
        player.invincible &&
        player.invincible > 0
    ) {
        if (
            Math.floor(
                player.invincible /
                60
            ) % 2 === 0
        ) {
            ctx.globalAlpha = .55;
        }
    }

    const x =
        player.x;

    const y =
        player.y;

    const color =
        player.color ||
        "#f2f5f7";

    /*
     * 그림자
     */
    drawPlayerShadow(
        player
    );

    /*
     * 무기 상태
     */
    const weaponState =
        getWeaponState(
            player.id
        );

    updateWeaponState(
        player.id,
        1000 / 60
    );

    /*
     * 뒤쪽 팔
     */
    drawBackArm(
        player,
        color
    );

    /*
     * 다리
     */
    drawLegs(
        player,
        color
    );

    /*
     * 몸
     */
    drawBody(
        player,
        color
    );

    /*
     * 머리
     */
    drawHead(
        player,
        color
    );

    /*
     * 앞쪽 팔 + 무기
     */
    drawFrontArmAndWeapon(
        player,
        color,
        weaponState
    );

    /*
     * 상태 효과
     */
    drawPlayerEffects(
        player
    );

    ctx.globalAlpha = 1;

    /*
     * UI
     */
    drawHealthBar(
        player
    );

    drawNickname(
        player
    );
}

function drawPlayerShadow(
    player
) {
    ctx.save();

    ctx.fillStyle =
        "rgba(0,0,0,.3)";

    ctx.beginPath();

    ctx.ellipse(
        player.x,
        603,
        25,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

function drawBackArm(
    player,
    color
) {
    ctx.strokeStyle =
        color;

    ctx.lineWidth = 7;
    ctx.lineCap =
        "round";

    ctx.beginPath();

    ctx.moveTo(
        player.x - 8,
        player.y + 28
    );

    ctx.lineTo(
        player.x -
            24,
        player.y + 49
    );

    ctx.stroke();
}

function drawFrontArmAndWeapon(
    player,
    color,
    weaponState
) {
    const facing =
        player.facing || 1;

    const progress =
        getAttackProgress(
            weaponState
        );

    let swingAngle = 0;

    if (
        weaponState.attacking
    ) {
        const smooth =
            progress *
            progress *
            (3 - 2 * progress);

        swingAngle =
            weaponState.attackStartAngle +
            (
                weaponState.attackEndAngle -
                weaponState.attackStartAngle
            ) *
            smooth;
    }

    const baseAngle =
        facing === -1
            ? Math.PI
            : 0;

    const weaponAngle =
        baseAngle +
        swingAngle *
        facing;

    /*
     * 팔
     */
    const handX =
        player.x +
        Math.cos(
            weaponAngle
        ) * 27;

    const handY =
        player.y +
        29 +
        Math.sin(
            weaponAngle
        ) * 27;

    ctx.strokeStyle =
        color;

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        player.x + 7,
        player.y + 28
    );

    ctx.lineTo(
        handX,
        handY
    );

    ctx.stroke();

    /*
     * 무기
     */
    const weaponId =
        player.weapon ||
        SW.inventory.selectedWeapon ||
        "wood_sword";

    const scale =
        getWeaponScale(
            weaponId
        );

    drawWeapon(
        ctx,
        handX,
        handY,
        weaponId,
        weaponAngle,
        scale,
        {
            time:
                performance.now(),

            player,

            weaponState
        }
    );

    /*
     * 공격 궤적
     */
    if (
        weaponState.attacking &&
        isMeleeWeapon(
            weaponId
        )
    ) {
        drawAttackTrail(
            player,
            weaponAngle,
            progress,
            weaponId
        );
    }
}

function getWeaponScale(
    weaponId
) {
    if (
        [
            "hammer",
            "axe",
            "railgun",
            "shotgun"
        ].includes(
            weaponId
        )
    ) {
        return .65;
    }

    if (
        [
            "dagger"
        ].includes(
            weaponId
        )
    ) {
        return .85;
    }

    if (
        [
            "blackhole",
            "star",
            "zero",
            "admin"
        ].includes(
            weaponId
        )
    ) {
        return .7;
    }

    return .75;
}

function isMeleeWeapon(
    weaponId
) {
    return [
        "wood_sword",
        "bat",
        "dagger",
        "axe",
        "hammer",
        "spear",
        "katana",
        "fire_sword",
        "gold_sword",
        "gold_axe",
        "diamond_blade",
        "diamond_fist",
        "hell_sword",
        "void_scythe"
    ].includes(
        weaponId
    );
}

function drawAttackTrail(
    player,
    angle,
    progress,
    weaponId
) {
    const radius =
        weaponId ===
        "void_scythe"
            ? 130
            : 95;

    const alpha =
        Math.sin(
            progress *
            Math.PI
        ) * .55;

    ctx.save();

    ctx.globalAlpha =
        Math.max(
            0,
            alpha
        );

    ctx.strokeStyle =
        getTrailColor(
            weaponId
        );

    ctx.lineWidth =
        weaponId ===
        "diamond_blade"
            ? 9
            : 6;

    ctx.lineCap =
        "round";

    const start =
        angle -
        .8;

    const end =
        angle +
        .8;

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y + 32,
        radius,
        start,
        end
    );

    ctx.stroke();

    ctx.restore();
}

function getTrailColor(
    weaponId
) {
    if (
        [
            "fire_sword",
            "hell_sword"
        ].includes(
            weaponId
        )
    ) {
        return "#ff4b19";
    }

    if (
        [
            "diamond_blade",
            "diamond_fist"
        ].includes(
            weaponId
        )
    ) {
        return "#6eeeff";
    }

    if (
        [
            "gold_sword",
            "gold_axe"
        ].includes(
            weaponId
        )
    ) {
        return "#ffd447";
    }

    if (
        weaponId ===
        "void_scythe"
    ) {
        return "#b15cff";
    }

    return "#ffffff";
}

/* =========================================================
   BODY
========================================================= */

function drawBody(
    player,
    color
) {
    ctx.strokeStyle =
        color;

    ctx.lineWidth = 8;
    ctx.lineCap =
        "round";

    ctx.beginPath();

    ctx.moveTo(
        player.x,
        player.y + 25
    );

    ctx.lineTo(
        player.x,
        player.y + 58
    );

    ctx.stroke();
}

function drawHead(
    player,
    color
) {
    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y + 13,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
     * 눈
     */
    const facing =
        player.facing || 1;

    ctx.fillStyle =
        "#151515";

    ctx.beginPath();

    ctx.arc(
        player.x +
            facing * 5,
        player.y + 11,
        2.2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawLegs(
    player,
    color
) {
    ctx.strokeStyle =
        color;

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        player.x - 5,
        player.y + 55
    );

    ctx.lineTo(
        player.x - 18,
        player.y + 76
    );

    ctx.moveTo(
        player.x + 5,
        player.y + 55
    );

    ctx.lineTo(
        player.x + 18,
        player.y + 76
    );

    ctx.stroke();
}

/* =========================================================
   PROJECTILES
========================================================= */

function drawProjectiles() {
    for (
        const projectile of
        SW.game.projectiles
    ) {
        drawProjectile(
            projectile
        );
    }
}

function drawProjectile(
    p
) {
    ctx.save();

    ctx.translate(
        p.x,
        p.y
    );

    const angle =
        Math.atan2(
            p.vy,
            p.vx
        );

    ctx.rotate(
        angle
    );

    switch (
        p.type
    ) {
        case "blackhole":
            drawBlackholeProjectile(
                p
            );
            break;

        case "explosive":
            drawRocket(
                p
            );
            break;

        default:
            drawNormalProjectile(
                p
            );
    }

    ctx.restore();
}

function drawNormalProjectile(
    p
) {
    ctx.shadowColor =
        "#bceeff";

    ctx.shadowBlur = 14;

    ctx.fillStyle =
        "#ffffff";

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        10,
        3,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#6edfff";

    ctx.beginPath();

    ctx.ellipse(
        -8,
        0,
        11,
        2,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawRocket(
    p
) {
    ctx.fillStyle =
        "#454d55";

    ctx.fillRect(
        -15,
        -5,
        30,
        10
    );

    ctx.fillStyle =
        "#dce2e7";

    ctx.beginPath();

    ctx.moveTo(
        15,
        -5
    );

    ctx.lineTo(
        26,
        0
    );

    ctx.lineTo(
        15,
        5
    );

    ctx.closePath();

    ctx.fill();

    ctx.shadowColor =
        "#ff3d00";

    ctx.shadowBlur = 15;

    ctx.fillStyle =
        "#ff5b18";

    ctx.beginPath();

    ctx.moveTo(
        -15,
        0
    );

    ctx.lineTo(
        -29,
        -5
    );

    ctx.lineTo(
        -24,
        0
    );

    ctx.lineTo(
        -29,
        5
    );

    ctx.closePath();

    ctx.fill();

    ctx.shadowBlur = 0;
}

function drawBlackholeProjectile(
    p
) {
    const pulse =
        1 +
        Math.sin(
            performance.now() *
                .01
        ) *
        .1;

    ctx.shadowColor =
        "#a14dff";

    ctx.shadowBlur = 30;

    ctx.fillStyle =
        "#050008";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        18 * pulse,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
        "#a14dff";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        27 * pulse,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.strokeStyle =
        "#e1bfff";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        34 * pulse,
        performance.now() *
            .002,
        performance.now() *
            .002 +
            Math.PI * 1.4
    );

    ctx.stroke();

    ctx.shadowBlur = 0;
}

/* =========================================================
   PARTICLES
========================================================= */

function drawParticles() {
    for (
        const p of
        SW.game.particles
    ) {
        const alpha =
            Math.max(
                0,
                p.life /
                    p.maxLife
            );

        ctx.save();

        ctx.globalAlpha =
            alpha;

        if (
            p.type ===
            "explosion"
        ) {
            ctx.fillStyle =
                "#ff6b2b";

            ctx.shadowColor =
                "#ff3b00";

            ctx.shadowBlur =
                15;
        }

        else if (
            p.type ===
            "lightning"
        ) {
            ctx.fillStyle =
                "#fff45c";

            ctx.shadowColor =
                "#fff000";

            ctx.shadowBlur =
                20;
        }

        else if (
            p.type ===
            "blackhole"
        ) {
            ctx.fillStyle =
                "#bd72ff";

            ctx.shadowColor =
                "#8b3dff";

            ctx.shadowBlur =
                15;
        }

        else if (
            p.type ===
            "star"
        ) {
            ctx.fillStyle =
                "#fff27a";

            ctx.shadowColor =
                "#fff000";

            ctx.shadowBlur =
                18;
        }

        else if (
            p.type ===
            "admin"
        ) {
            ctx.fillStyle =
                "#ffffff";

            ctx.shadowColor =
                "#ffffff";

            ctx.shadowBlur =
                25;
        }

        else {
            ctx.fillStyle =
                "#ffffff";
        }

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

/* =========================================================
   PLAYER EFFECTS
========================================================= */

function drawPlayerEffects(
    player
) {
    if (
        player.effects?.burn
    ) {
        drawEffectRing(
            player,
            "#ff4a18",
            1
        );
    }

    if (
        player.effects?.slow
    ) {
        drawEffectRing(
            player,
            "#59dfff",
            1
        );
    }

    if (
        player.effects?.shield
    ) {
        drawEffectRing(
            player,
            "#70a8ff",
            1.15
        );
    }

    if (
        player.blocking
    ) {
        drawBlockEffect(
            player
        );
    }
}

function drawEffectRing(
    player,
    color,
    scale
) {
    ctx.save();

    ctx.strokeStyle =
        color;

    ctx.globalAlpha =
        .55;

    ctx.lineWidth = 3;

    ctx.shadowColor =
        color;

    ctx.shadowBlur = 12;

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y + 35,
        34 * scale,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawBlockEffect(
    player
) {
    const direction =
        player.facing || 1;

    ctx.save();

    ctx.strokeStyle =
        "#80bfff";

    ctx.lineWidth = 5;

    ctx.globalAlpha =
        .75;

    ctx.beginPath();

    ctx.arc(
        player.x +
            direction * 17,
        player.y + 30,
        32,
        -Math.PI / 2,
        Math.PI / 2
    );

    ctx.stroke();

    ctx.restore();
}

/* =========================================================
   UI
========================================================= */

function drawGameUI() {
    drawTimer();
    drawScoreboard();
}

function drawTimer() {
    const time =
        Math.max(
            0,
            SW.game.time || 0
        );

    const seconds =
        Math.floor(
            time / 1000
        );

    const minutes =
        Math.floor(
            seconds / 60
        );

    const secs =
        seconds % 60;

    const text =
        `${String(minutes).padStart(
            2,
            "0"
        )}:${String(secs).padStart(
            2,
            "0"
        )}`;

    ctx.save();

    ctx.fillStyle =
        "rgba(10,14,20,.75)";

    ctx.beginPath();

    ctx.roundRect(
        GAME.WIDTH / 2 - 55,
        18,
        110,
        42,
        12
    );

    ctx.fill();

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 21px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        text,
        GAME.WIDTH / 2,
        39
    );

    ctx.restore();
}

function drawScoreboard() {
    const players =
        Object.values(
            SW.game.players
        );

    ctx.save();

    let y = 80;

    for (
        const player of players
    ) {
        ctx.fillStyle =
            "rgba(8,12,18,.7)";

        ctx.beginPath();

        ctx.roundRect(
            GAME.WIDTH - 210,
            y,
            190,
            34,
            8
        );

        ctx.fill();

        ctx.fillStyle =
            player.color ||
            "#fff";

        ctx.font =
            "bold 12px Arial";

        ctx.textAlign =
            "left";

        ctx.fillText(
            player.nickname ||
                "Player",
            GAME.WIDTH - 195,
            y + 14
        );

        ctx.fillStyle =
            "#9ca8b5";

        ctx.font =
            "11px Arial";

        ctx.fillText(
            `K ${player.kills || 0}   D ${player.deaths || 0}`,
            GAME.WIDTH - 195,
            y + 27
        );

        y += 42;
    }

    ctx.restore();
}

/* =========================================================
   HP / NAME
========================================================= */

function drawHealthBar(
    player
) {
    const width = 54;
    const height = 6;

    const x =
        player.x -
        width / 2;

    const y =
        player.y -
        13;

    ctx.fillStyle =
        "rgba(0,0,0,.7)";

    ctx.fillRect(
        x - 1,
        y - 1,
        width + 2,
        height + 2
    );

    ctx.fillStyle =
        "#e33b4e";

    ctx.fillRect(
        x,
        y,
        width,
        height
    );

    ctx.fillStyle =
        "#48df72";

    const hp =
        Math.max(
            0,
            Math.min(
                1,
                player.hp /
                    player.maxHp
            )
        );

    ctx.fillRect(
        x,
        y,
        width * hp,
        height
    );
}

function drawNickname(
    player
) {
    ctx.save();

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "bottom";

    ctx.fillStyle =
        "rgba(0,0,0,.6)";

    ctx.fillText(
        player.nickname ||
            "Player",
        player.x + 1,
        player.y - 19
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fillText(
        player.nickname ||
            "Player",
        player.x,
        player.y - 20
    );

    ctx.restore();
}

/* =========================================================
   WORLD EFFECTS
========================================================= */

function drawWorldEffectsBack() {
    /*
     * 나중에 맵별 안개/조명 등을 추가.
     */
}

function drawWorldEffectsFront() {
    /*
     * 전투 전면 이펙트.
     */
}

/* =========================================================
   HELPERS
========================================================= */

function getLocalPlayer() {
    if (
        SW.user?.uid &&
        SW.game.players[
            SW.user.uid
        ]
    ) {
        return SW.game.players[
            SW.user.uid
        ];
    }

    return Object.values(
        SW.game.players
    ).find(
        p => p.local
    );
}

export function shakeScreen(
    amount = 8
) {
    screenShake =
        Math.max(
            screenShake,
            amount
        );

    screenShakeX =
        (
            Math.random() -
            .5
        ) *
        amount;

    screenShakeY =
        (
            Math.random() -
            .5
        ) *
        amount;
}

export function getCamera() {
    return {
        ...camera
    };
}

export function getRendererContext() {
    return ctx;
}

export function getRendererCanvas() {
    return canvas;
}
