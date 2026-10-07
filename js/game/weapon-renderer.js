/*
 * StickWar 2.0
 * Canvas Weapon Renderer
 *
 * 모든 무기는 Canvas에서 직접 렌더링된다.
 * emoji/icon은 게임 렌더링에 사용하지 않는다.
 */

const TAU = Math.PI * 2;

function setup(ctx, x, y, angle = 0, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

function finish(ctx) {
    ctx.restore();
}

function glow(ctx, color, blur) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
}

function noGlow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
}

function polygon(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.closePath();
}

/* =========================================================
   COMMON
========================================================= */

function woodSword(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    // blade shadow
    ctx.fillStyle = "#252525";
    polygon(ctx, [
        [8, -7],
        [83, -5],
        [101, 0],
        [83, 5],
        [8, 7]
    ]);
    ctx.fill();

    // blade
    const g = ctx.createLinearGradient(5, -8, 95, 8);
    g.addColorStop(0, "#dfe7ee");
    g.addColorStop(.45, "#ffffff");
    g.addColorStop(1, "#87929c");

    ctx.fillStyle = g;
    polygon(ctx, [
        [5, -6],
        [88, -4],
        [102, 0],
        [88, 4],
        [5, 6]
    ]);
    ctx.fill();

    // blade highlight
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, -3);
    ctx.lineTo(82, -2);
    ctx.stroke();

    // guard
    ctx.fillStyle = "#9b6a35";
    ctx.fillRect(-3, -12, 7, 24);

    // grip
    ctx.fillStyle = "#5b3219";
    ctx.fillRect(-29, -6, 27, 12);

    // grip wrapping
    ctx.strokeStyle = "#b47a42";
    ctx.lineWidth = 2;

    for (let i = -25; i < 0; i += 7) {
        ctx.beginPath();
        ctx.moveTo(i, -6);
        ctx.lineTo(i + 5, 6
