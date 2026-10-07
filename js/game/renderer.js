import { SW } from "../core/state.js";
import { drawWeapon } from "./weapon-renderer.js";
import {
    getWeaponState,
    updateWeaponState,
    getAttackProgress
} from "./weapon-state.js";

function drawPlayer(ctx, player) {
    const x = player.x;
    const y = player.y;

    /*
     * 플레이어 뒤쪽 팔
     */
    ctx.strokeStyle = player.color || "#ffffff";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x - 8, y + 28);
    ctx.lineTo(x - 23, y + 50);
    ctx.stroke();

    /*
     * 다리
     */
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 55);
    ctx.lineTo(x - 17, y + 76);
    ctx.moveTo(x + 5, y + 55);
    ctx.lineTo(x + 18, y + 76);
    ctx.stroke();

    /*
     * 몸
     */
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x, y + 57);
    ctx.stroke();

    /*
     * 머리
     */
    ctx.fillStyle = player.color || "#ffffff";

    ctx.beginPath();
    ctx.arc(x, y + 13, 14, 0, Math.PI * 2);
    ctx.fill();

    /*
     * 무기
     */
    drawPlayerWeapon(ctx, player);

    /*
     * 앞쪽 팔
     */
    ctx.strokeStyle = player.color || "#ffffff";
    ctx.lineWidth = 7;

    const weaponAngle =
        getPlayerWeaponAngle(player);

    const armLength = 27;

    ctx.beginPath();
    ctx.moveTo(
        x + 7,
        y + 29
    );

    ctx.lineTo(
        x + 7 +
            Math.cos(weaponAngle) * armLength,
        y + 29 +
            Math.sin(weaponAngle) * armLength
    );

    ctx.stroke();

    /*
     * HP
     */
    drawHealthBar(ctx, player);

    /*
     * 닉네임
     */
    drawNickname(ctx, player);
}

function getPlayerWeaponAngle(player) {
    const state = getWeaponState(player.id);

    let base = player.facing === -1
        ? Math.PI
        : 0;

    if (!state.attacking) {
        return base;
    }

    const progress =
        getAttackProgress(state);

    /*
     * smoothstep
     */
    const smooth =
        progress * progress *
        (3 - 2 * progress);

    const swing =
        state.attackStartAngle +
        (
            state.attackEndAngle -
            state.attackStartAngle
        ) * smooth;

    return base + swing * player.facing;
}

function drawPlayerWeapon(ctx, player) {
    const weaponId =
        player.weapon ||
        SW.inventory.selectedWeapon ||
        "wood_sword";

    const state =
        getWeaponState(player.id);

    updateWeaponState(
        player.id,
        1000 / 60
    );

    const angle =
        getPlayerWeaponAngle(player);

    const facing =
        player.facing || 1;

    const handX =
        player.x + facing * 18;

    const handY =
        player.y + 32;

    /*
     * 무기 크기
     */
    let scale = 0.75;

    if (
        weaponId === "hammer" ||
        weaponId === "axe" ||
        weaponId === "railgun"
    ) {
        scale = 0.65;
    }

    if (
        weaponId === "dagger"
    ) {
        scale = 0.8;
    }

    if (
        weaponId === "blackhole" ||
        weaponId === "star" ||
        weaponId === "zero"
    ) {
        scale = 0.7;
    }

    drawWeapon(
        ctx,
        weaponId,
        handX,
        handY,
        angle,
        scale,
        {
            time: performance.now(),
            player,
            weaponState: state
        }
    );
}

function drawHealthBar(ctx, player) {
    const width = 52;
    const height = 6;

    const x =
        player.x - width / 2;

    const y =
        player.y - 17;

    ctx.fillStyle = "#171717";

    ctx.fillRect(
        x,
        y,
        width,
        height
    );

    ctx.fillStyle = "#45e06f";

    ctx.fillRect(
        x,
        y,
        width *
            Math.max(
                0,
                player.hp / player.maxHp
            ),
        height
    );
}

function drawNickname(ctx, player) {
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        player.nickname || "Player",
        player.x,
        player.y - 25
    );
}

export {
    drawPlayer,
    drawPlayerWeapon,
    getPlayerWeaponAngle
};
