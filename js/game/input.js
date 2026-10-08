import { SW } from "../core/state.js";
import { requestAttack } from "./combat.js";

/*
 * StickWar 2.0
 * Input System
 *
 * 키보드:
 * A / ←        왼쪽
 * D / →        오른쪽
 * W / ↑ / Space 점프
 * J / F        공격
 * Shift        대시
 * S / ↓        방어
 *
 * 마우스:
 * 좌클릭       공격
 * 우클릭       방어
 *
 * 모바일:
 * renderer.js와 별도로 touch.js에서
 * SW.input 값을 변경할 수 있음.
 */

let initialized = false;

let previousAttack = false;
let previousJump = false;
let previousDash = false;

const keys = new Set();

/* =========================================================
   INIT
========================================================= */

export function setupGameInput() {
    if (initialized) {
        return;
    }

    initialized = true;

    window.addEventListener(
        "keydown",
        handleKeyDown,
        { passive: false }
    );

    window.addEventListener(
        "keyup",
        handleKeyUp,
        { passive: false }
    );

    window.addEventListener(
        "blur",
        clearInput
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.hidden
            ) {
                clearInput();
            }
        }
    );

    setupMouse();

    console.log(
        "[StickWar] Input initialized"
    );
}

/* =========================================================
   KEYBOARD
========================================================= */

function handleKeyDown(e) {
    const key =
        e.key.toLowerCase();

    keys.add(key);

    /*
     * 게임에서 사용하는 키의
     * 브라우저 기본 동작 방지
     */
    if (
        [
            " ",
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",
            "shift"
        ].includes(key)
    ) {
        e.preventDefault();
    }

    updateInputState();
}

function handleKeyUp(e) {
    const key =
        e.key.toLowerCase();

    keys.delete(key);

    updateInputState();
}

function updateInputState() {
    SW.input.left =
        keys.has("a") ||
        keys.has("arrowleft");

    SW.input.right =
        keys.has("d") ||
        keys.has("arrowright");

    SW.input.up =
        keys.has("w") ||
        keys.has("arrowup") ||
        keys.has(" ");

    SW.input.jump =
        SW.input.up;

    SW.input.attack =
        keys.has("j") ||
        keys.has("f");

    SW.input.dash =
        keys.has("shift");

    SW.input.block =
        keys.has("s") ||
        keys.has("arrowdown");
}

/* =========================================================
   MOUSE
========================================================= */

function setupMouse() {
    const canvas =
        document.getElementById(
            "gameCanvas"
        );

    if (!canvas) {
        return;
    }

    canvas.addEventListener(
        "contextmenu",
        e => {
            e.preventDefault();
        }
    );

    canvas.addEventListener(
        "mousedown",
        e => {
            /*
             * 좌클릭 = 공격
             */
            if (
                e.button === 0
            ) {
                SW.input.attack =
                    true;
            }

            /*
             * 우클릭 = 방어
             */
            if (
                e.button === 2
            ) {
                SW.input.block =
                    true;
            }
        }
    );

    window.addEventListener(
        "mouseup",
        e => {
            if (
                e.button === 0
            ) {
                SW.input.attack =
                    false;
            }

            if (
                e.button === 2
            ) {
                SW.input.block =
                    false;
            }
        }
    );

    /*
     * 마우스 위치
     */
    canvas.addEventListener(
        "mousemove",
        e => {
            const rect =
                canvas.getBoundingClientRect();

            SW.input.mouseX =
                e.clientX -
                rect.left;

            SW.input.mouseY =
                e.clientY -
                rect.top;
        }
    );
}

/* =========================================================
   ATTACK EDGE
========================================================= */

/*
 * 공격 버튼을 계속 누르고 있어도
 * 매 프레임 공격하지 않도록
 * "눌린 순간"만 감지한다.
 */

export function updateAttackInput() {
    const player =
        getLocalPlayer();

    if (!player) {
        previousAttack =
            SW.input.attack;

        return;
    }

    const attack =
        !!SW.input.attack;

    if (
        attack &&
        !previousAttack
    ) {
        requestAttack(player);
    }

    previousAttack =
        attack;
}

/* =========================================================
   JUMP EDGE
========================================================= */

export function updateJumpInput() {
    const player =
        getLocalPlayer();

    if (!player) {
        previousJump =
            SW.input.jump;

        return;
    }

    const jump =
        !!SW.input.jump;

    if (
        jump &&
        !previousJump &&
        player.grounded
    ) {
        player.vy =
            -13;

        player.grounded =
            false;
    }

    previousJump =
        jump;
}

/* =========================================================
   DASH EDGE
========================================================= */

export function updateDashInput() {
    const player =
        getLocalPlayer();

    if (!player) {
        previousDash =
            SW.input.dash;

        return;
    }

    const dash =
        !!SW.input.dash;

    if (
        dash &&
        !previousDash
    ) {
        performDash(player);
    }

    previousDash =
        dash;
}

function performDash(player) {
    if (
        player.dashTimer > 0
    ) {
        return;
    }

    const direction =
        player.facing || 1;

    player.vx =
        direction * 14;

    player.invincible =
        Math.max(
            player.invincible || 0,
            100
        );

    player.dashTimer =
        700;
}

/* =========================================================
   LOCAL PLAYER
========================================================= */

function getLocalPlayer() {
    /*
     * 가장 먼저 UID로 찾는다.
     */
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

    /*
     * fallback:
     * local=true인 플레이어
     */
    for (
        const player of Object.values(
            SW.game.players
        )
    ) {
        if (
            player.local
        ) {
            return player;
        }
    }

    return null;
}

/* =========================================================
   GAME INPUT UPDATE
========================================================= */

export function updateInput(dt) {
    const player =
        getLocalPlayer();

    if (!player) {
        return;
    }

    updateAttackInput();
    updateJumpInput();
    updateDashInput();

    /*
     * 이동
     */
    const speed =
        player.effects?.slow
            ? 5 *
              (
                  player.effects
                      .slow
                      .value ??
                  1
              )
            : 5;

    if (
        SW.input.left &&
        !SW.input.right
    ) {
        player.vx =
            -speed;

        player.facing =
            -1;
    }

    else if (
        SW.input.right &&
        !SW.input.left
    ) {
        player.vx =
            speed;

        player.facing =
            1;
    }

    else {
        /*
         * 자연 감속
         */
        player.vx *= .78;
    }

    /*
     * 방어
     */
    player.blocking =
        !!SW.input.block;

    /*
     * 방어 중 이동 감소
     */
    if (
        player.blocking
    ) {
        player.vx *= .45;
    }
}

/* =========================================================
   TOUCH SUPPORT
========================================================= */

export function setVirtualInput(
    name,
    value
) {
    if (
        !(name in SW.input)
    ) {
        return;
    }

    SW.input[name] =
        !!value;
}

export function resetVirtualInput() {
    SW.input.left = false;
    SW.input.right = false;
    SW.input.up = false;
    SW.input.jump = false;
    SW.input.attack = false;
    SW.input.dash = false;
    SW.input.block = false;
}

/* =========================================================
   CLEAR
========================================================= */

export function clearInput() {
    keys.clear();

    resetVirtualInput();

    previousAttack = false;
    previousJump = false;
    previousDash = false;
}

/* =========================================================
   DEBUG
========================================================= */

export function getInputState() {
    return {
        left: SW.input.left,
        right: SW.input.right,
        up: SW.input.up,
        jump: SW.input.jump,
        attack: SW.input.attack,
        dash: SW.input.dash,
        block: SW.input.block
    };
}
