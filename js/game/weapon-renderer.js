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
        ctx.lineTo(i + 5, 6);
        ctx.stroke();
    }

    // pommel
    ctx.fillStyle = "#7d5228";
    ctx.beginPath();
    ctx.arc(-31, 0, 7, 0, TAU);
    ctx.fill();

    finish(ctx);
}

function bat(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    // handle
    ctx.fillStyle = "#7b4726";
    ctx.fillRect(-45, -5, 55, 10);

    // handle grip
    ctx.strokeStyle = "#4b2917";
    ctx.lineWidth = 3;

    for (let i = -40; i < 5; i += 9) {
        ctx.beginPath();
        ctx.moveTo(i, -5);
        ctx.lineTo(i + 6, 5);
        ctx.stroke();
    }

    // head
    const g = ctx.createLinearGradient(0, -22, 0, 22);
    g.addColorStop(0, "#b96e39");
    g.addColorStop(.5, "#8c4d25");
    g.addColorStop(1, "#5c301b");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(0, -19, 63, 38, 10);
    ctx.fill();

    // wood grain
    ctx.strokeStyle = "#d18a4e";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(12, -8);
    ctx.lineTo(48, -5);
    ctx.moveTo(8, 5);
    ctx.lineTo(39, 8);
    ctx.stroke();

    finish(ctx);
}

function dagger(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#cbd4dc";
    polygon(ctx, [
        [0, -5],
        [57, 0],
        [0, 5]
    ]);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    polygon(ctx, [
        [3, -3],
        [48, 0],
        [3, 1]
    ]);
    ctx.fill();

    ctx.fillStyle = "#bd8b45";
    ctx.fillRect(-7, -12, 7, 24);

    ctx.fillStyle = "#542f1b";
    ctx.fillRect(-31, -5, 24, 10);

    finish(ctx);
}

function pistol(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#30343a";

    // barrel
    ctx.fillRect(0, -8, 48, 13);

    // upper receiver
    ctx.fillRect(-4, -13, 36, 9);

    // grip
    polygon(ctx, [
        [-5, 3],
        [15, 3],
        [9, 38],
        [-4, 34]
    ]);
    ctx.fill();

    ctx.fillStyle = "#606873";
    ctx.fillRect(9, -8, 23, 3);

    ctx.fillStyle = "#16191d";
    ctx.beginPath();
    ctx.arc(43, -2, 3, 0, TAU);
    ctx.fill();

    finish(ctx);
}

function bow(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.strokeStyle = "#75451e";
    ctx.lineWidth = 7;

    ctx.beginPath();
    ctx.arc(0, 0, 45, -Math.PI * .72, Math.PI * .72);
    ctx.stroke();

    ctx.strokeStyle = "#dedede";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-14, -43);
    ctx.lineTo(-14, 43);
    ctx.stroke();

    // arrow
    ctx.strokeStyle = "#c7c7c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(63, 0);
    ctx.stroke();

    ctx.fillStyle = "#eeeeee";
    polygon(ctx, [
        [63, 0],
        [52, -5],
        [52, 5]
    ]);
    ctx.fill();

    finish(ctx);
}

function axe(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#70451f";
    ctx.fillRect(-35, -4, 75, 8);

    const g = ctx.createLinearGradient(0, -25, 0, 25);
    g.addColorStop(0, "#eef3f7");
    g.addColorStop(.5, "#89939c");
    g.addColorStop(1, "#424b53");

    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(20, -7);
    ctx.quadraticCurveTo(55, -37, 75, -17);
    ctx.quadraticCurveTo(84, 0, 75, 17);
    ctx.quadraticCurveTo(55, 37, 20, 7);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, -5);
    ctx.quadraticCurveTo(55, -27, 70, -12);
    ctx.stroke();

    finish(ctx);
}

/* =========================================================
   RARE
========================================================= */

function hammer(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#6c431f";
    ctx.fillRect(-40, -5, 100, 10);

    const g = ctx.createLinearGradient(15, -25, 15, 25);
    g.addColorStop(0, "#d8dee4");
    g.addColorStop(.5, "#737d86");
    g.addColorStop(1, "#30363b");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(15, -28, 58, 56, 8);
    ctx.fill();

    ctx.fillStyle = "#20252a";
    ctx.fillRect(23, -20, 42, 7);

    finish(ctx);
}

function spear(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#7b4a23";
    ctx.fillRect(-55, -3, 115, 6);

    const g = ctx.createLinearGradient(55, -12, 82, 12);
    g.addColorStop(0, "#dce4ea");
    g.addColorStop(1, "#6c7882");

    ctx.fillStyle = g;
    polygon(ctx, [
        [50, -9],
        [92, 0],
        [50, 9]
    ]);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(54, -4);
    ctx.lineTo(83, 0);
    ctx.stroke();

    finish(ctx);
}

function shotgun(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#3a3f45";
    ctx.fillRect(-15, -11, 70, 20);

    ctx.fillStyle = "#171a1d";
    ctx.fillRect(35, -7, 32, 13);

    ctx.fillStyle = "#71431f";
    polygon(ctx, [
        [-18, 7],
        [8, 7],
        [2, 32],
        [-14, 28]
    ]);
    ctx.fill();

    ctx.fillStyle = "#777f87";
    ctx.fillRect(8, -14, 38, 4);

    finish(ctx);
}

function crossbow(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#75421e";
    ctx.fillRect(-35, -4, 75, 8);

    ctx.strokeStyle = "#8b949d";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.arc(5, 0, 31, Math.PI * .25, Math.PI * .75);
    ctx.stroke();

    ctx.strokeStyle = "#dce0e3";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-17, -25);
    ctx.lineTo(50, 0);
    ctx.lineTo(-17, 25);
    ctx.stroke();

    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(72, 0);
    ctx.stroke();

    finish(ctx);
}

function boomerang(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.strokeStyle = "#c17a2e";
    ctx.lineWidth = 14;

    ctx.beginPath();
    ctx.arc(0, 0, 42, -.9, .9);
    ctx.stroke();

    ctx.strokeStyle = "#f1b84e";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, 42, -.9, .9);
    ctx.stroke();

    finish(ctx);
}

/* =========================================================
   EPIC
========================================================= */

function katana(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    const g = ctx.createLinearGradient(0, -6, 100, 6);
    g.addColorStop(0, "#e5ebf0");
    g.addColorStop(.5, "#ffffff");
    g.addColorStop(1, "#78838c");

    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.quadraticCurveTo(60, -10, 108, 0);
    ctx.quadraticCurveTo(60, 10, 0, 4);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#aab3bb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, -2);
    ctx.quadraticCurveTo(60, -5, 94, 0);
    ctx.stroke();

    // guard
    ctx.strokeStyle = "#15191d";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(-3, 0, 10, 0, TAU);
    ctx.stroke();

    // handle
    ctx.fillStyle = "#20242a";
    ctx.fillRect(-48, -6, 45, 12);

    ctx.strokeStyle = "#a9a9a9";
    ctx.lineWidth = 2;

    for (let i = -42; i < -5; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, -6);
        ctx.lineTo(i + 5, 6);
        ctx.stroke();
    }

    finish(ctx);
}

function fireSword(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#ff5a00", 18);

    const g = ctx.createLinearGradient(0, -7, 105, 7);
    g.addColorStop(0, "#fff");
    g.addColorStop(.35, "#ffd43b");
    g.addColorStop(.7, "#ff6a00");
    g.addColorStop(1, "#d81919");

    ctx.fillStyle = g;

    polygon(ctx, [
        [0, -7],
        [88, -5],
        [108, 0],
        [88, 5],
        [0, 7]
    ]);

    ctx.fill();

    noGlow(ctx);

    ctx.fillStyle = "#5b2e18";
    ctx.fillRect(-31, -6, 27, 12);

    ctx.fillStyle = "#f2b632";
    ctx.fillRect(-5, -13, 7, 26);

    // flames
    glow(ctx, "#ff2b00", 12);
    ctx.fillStyle = "#ff7b00";

    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.quadraticCurveTo(30, -25, 43, -10);
    ctx.quadraticCurveTo(53, -32, 63, -7);
    ctx.quadraticCurveTo(75, -18, 79, 0);
    ctx.quadraticCurveTo(55, 10, 20, 0);
    ctx.fill();

    noGlow(ctx);

    finish(ctx);
}

function laser(ctx, x, y, a, s, power = 1) {
    setup(ctx, x, y, a, s);

    // outer beam
    glow(ctx, "#ff164c", 25);

    ctx.strokeStyle = "rgba(255,30,80,.3)";
    ctx.lineWidth = 18 * power;

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(150, 0);
    ctx.stroke();

    ctx.strokeStyle = "#ff174f";
    ctx.lineWidth = 7 * power;

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(150, 0);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(150, 0);
    ctx.stroke();

    noGlow(ctx);

    // gun
    ctx.fillStyle = "#30343b";
    ctx.fillRect(-28, -10, 43, 20);

    ctx.fillStyle = "#5e6872";
    ctx.fillRect(-10, -15, 30, 6);

    finish(ctx);
}

function plasma(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#272b32";
    ctx.fillRect(-35, -9, 55, 18);

    glow(ctx, "#a000ff", 18);

    ctx.fillStyle = "#9b21ff";
    ctx.beginPath();
    ctx.arc(32, 0, 12, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#e7aaff";
    ctx.beginPath();
    ctx.arc(32, 0, 5, 0, TAU);
    ctx.fill();

    noGlow(ctx);

    finish(ctx);
}

function ice(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#69eaff", 14);

    ctx.fillStyle = "#74e9ff";

    polygon(ctx, [
        [0, -8],
        [45, -3],
        [58, 0],
        [45, 3],
        [0, 8]
    ]);

    ctx.fill();

    ctx.fillStyle = "#d9fbff";

    polygon(ctx, [
        [5, -3],
        [42, 0],
        [5, 3]
    ]);

    ctx.fill();

    noGlow(ctx);

    finish(ctx);
}

function railgun(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#252a31";
    ctx.fillRect(-42, -13, 105, 26);

    ctx.fillStyle = "#56616d";
    ctx.fillRect(-20, -21, 72, 7);

    ctx.fillStyle = "#15191d";
    ctx.fillRect(35, -9, 55, 18);

    glow(ctx, "#65d9ff", 14);

    ctx.fillStyle = "#73eaff";
    ctx.fillRect(52, -4, 45, 8);

    ctx.fillStyle = "#fff";
    ctx.fillRect(60, -1, 35, 2);

    noGlow(ctx);

    finish(ctx);
}

/* =========================================================
   GOLD
========================================================= */

function goldSword(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#ffd52b", 8);

    const g = ctx.createLinearGradient(0, -8, 100, 8);
    g.addColorStop(0, "#fff6a0");
    g.addColorStop(.35, "#ffd52b");
    g.addColorStop(.7, "#ffb300");
    g.addColorStop(1, "#fff09a");

    ctx.fillStyle = g;

    polygon(ctx, [
        [0, -7],
        [88, -5],
        [105, 0],
        [88, 5],
        [0, 7]
    ]);
    ctx.fill();

    noGlow(ctx);

    ctx.fillStyle = "#9c6418";
    ctx.fillRect(-32, -6, 28, 12);

    ctx.fillStyle = "#fff0a0";
    ctx.fillRect(-5, -13, 7, 26);

    finish(ctx);
}

function goldGun(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#ffd21f", 8);

    ctx.fillStyle = "#dca900";
    ctx.fillRect(-30, -11, 72, 20);

    ctx.fillStyle = "#fff0a0";
    ctx.fillRect(4, -8, 40, 5);

    noGlow(ctx);

    ctx.fillStyle = "#71430e";
    polygon(ctx, [
        [-18, 8],
        [5, 8],
        [0, 35],
        [-13, 30]
    ]);
    ctx.fill();

    finish(ctx);
}

function goldAxe(ctx, x, y, a, s) {
    axe(ctx, x, y, a, s);

    // overlay gold tint is intentionally separate
    setup(ctx, x, y, a, s);

    glow(ctx, "#ffd21f", 10);
    ctx.strokeStyle = "#ffd21f";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(50, 0, 23, -.8, .8);
    ctx.stroke();

    noGlow(ctx);

    finish(ctx);
}

function goldBow(ctx, x, y, a, s) {
    bow(ctx, x, y, a, s);

    setup(ctx, x, y, a, s);

    glow(ctx, "#ffd21f", 8);
    ctx.strokeStyle = "#ffd21f";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.arc(0, 0, 45, -.72, .72);
    ctx.stroke();

    noGlow(ctx);
    finish(ctx);
}

/* =========================================================
   DIAMOND
========================================================= */

function diamondBlade(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#4deaff", 15);

    const g = ctx.createLinearGradient(0, -10, 105, 10);
    g.addColorStop(0, "#b9ffff");
    g.addColorStop(.25, "#49e9ff");
    g.addColorStop(.55, "#dfffff");
    g.addColorStop(.8, "#44c9ff");
    g.addColorStop(1, "#b9ffff");

    ctx.fillStyle = g;

    polygon(ctx, [
        [0, -8],
        [85, -6],
        [108, 0],
        [85, 6],
        [0, 8]
    ]);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, -4);
    ctx.lineTo(91, 0);
    ctx.stroke();

    noGlow(ctx);

    ctx.fillStyle = "#8bdcff";
    ctx.fillRect(-30, -6, 27, 12);

    finish(ctx);
}

function diamondCannon(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    ctx.fillStyle = "#2b3138";
    ctx.fillRect(-30, -13, 55, 26);

    glow(ctx, "#39e7ff", 20);

    ctx.fillStyle = "#51eaff";
    polygon(ctx, [
        [18, -10],
        [63, -5],
        [72, 0],
        [63, 5],
        [18, 10]
    ]);
    ctx.fill();

    noGlow(ctx);

    finish(ctx);
}

function diamondBow(ctx, x, y, a, s) {
    bow(ctx, x, y, a, s);

    setup(ctx, x, y, a, s);

    glow(ctx, "#43eaff", 12);

    ctx.strokeStyle = "#43eaff";
    ctx.lineWidth = 7;

    ctx.beginPath();
    ctx.arc(0, 0, 45, -.72, .72);
    ctx.stroke();

    noGlow(ctx);
    finish(ctx);
}

function diamondFist(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#5ceeff", 18);

    ctx.fillStyle = "#55ddff";

    // fist
    ctx.beginPath();
    ctx.roundRect(-5, -24, 40, 45, 9);
    ctx.fill();

    // fingers
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.roundRect(0 + i * 8, -32, 8, 18, 4);
        ctx.fill();
    }

    ctx.fillStyle = "#d9ffff";
    ctx.fillRect(4, -18, 26, 5);

    noGlow(ctx);

    finish(ctx);
}

/* =========================================================
   LEGENDARY
========================================================= */

function thunder(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#fff000", 25);

    ctx.strokeStyle = "#ffe600";
    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(5, -18);
    ctx.lineTo(-2, -3);
    ctx.lineTo(28, -20);
    ctx.lineTo(15, 2);
    ctx.lineTo(47, -5);
    ctx.stroke();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(5, -18);
    ctx.lineTo(-2, -3);
    ctx.lineTo(28, -20);
    ctx.lineTo(15, 2);
    ctx.lineTo(47, -5);
    ctx.stroke();

    noGlow(ctx);

    finish(ctx);
}

function hellSword(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#ff2300", 22);

    const g = ctx.createLinearGradient(0, -8, 115, 8);
    g.addColorStop(0, "#ffdb57");
    g.addColorStop(.3, "#ff6500");
    g.addColorStop(.65, "#d90000");
    g.addColorStop(1, "#5b0000");

    ctx.fillStyle = g;

    polygon(ctx, [
        [0, -8],
        [92, -6],
        [120, 0],
        [92, 6],
        [0, 8]
    ]);
    ctx.fill();

    noGlow(ctx);

    ctx.fillStyle = "#1b1212";
    ctx.fillRect(-35, -7, 30, 14);

    ctx.fillStyle = "#ff3b00";
    ctx.fillRect(-8, -15, 7, 30);

    // flames
    glow(ctx, "#ff2a00", 18);

    ctx.fillStyle = "#ff4100";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.quadraticCurveTo(30, -32, 43, -7);
    ctx.quadraticCurveTo(55, -35, 70, -4);
    ctx.quadraticCurveTo(86, -25, 90, 0);
    ctx.quadraticCurveTo(55, 14, 15, 0);
    ctx.fill();

    noGlow(ctx);

    finish(ctx);
}

function blackhole(ctx, x, y, a, s, time = 0) {
    setup(ctx, x, y, a, s);

    const pulse = 1 + Math.sin(time * .008) * .08;

    glow(ctx, "#8d45ff", 28);

    ctx.fillStyle = "#160025";
    ctx.beginPath();
    ctx.arc(35, 0, 30 * pulse, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "#8b42ff";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.arc(35, 0, 38 * pulse, time * .003, time * .003 + Math.PI * 1.5);
    ctx.stroke();

    ctx.strokeStyle = "#d7a8ff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(35, 0, 44 * pulse, -time * .002, -time * .002 + Math.PI * 1.2);
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(35, 0, 17 * pulse, 0, TAU);
    ctx.fill();

    noGlow(ctx);

    finish(ctx);
}

function voidScythe(ctx, x, y, a, s) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#9a42ff", 15);

    ctx.strokeStyle = "#32164f";
    ctx.lineWidth = 9;

    ctx.beginPath();
    ctx.moveTo(-45, 25);
    ctx.lineTo(42, -32);
    ctx.stroke();

    ctx.strokeStyle = "#b85cff";
    ctx.lineWidth = 7;

    ctx.beginPath();
    ctx.arc(42, -15, 46, -.2, Math.PI * .75);
    ctx.stroke();

    ctx.strokeStyle = "#f0d8ff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(42, -15, 46, -.2, Math.PI * .75);
    ctx.stroke();

    noGlow(ctx);

    finish(ctx);
}

/* =========================================================
   ??? / EVENT
========================================================= */

function star(ctx, x, y, a, s, time = 0) {
    setup(ctx, x, y, a + time * .0005, s);

    glow(ctx, "#fff36b", 30);

    ctx.fillStyle = "#fff36b";

    ctx.beginPath();

    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 42 : 17;
        const ang = -Math.PI / 2 + i * Math.PI / 5;

        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }

    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, TAU);
    ctx.fill();

    noGlow(ctx);

    finish(ctx);
}

function zero(ctx, x, y, a, s, time = 0) {
    setup(ctx, x, y, a, s);

    glow(ctx, "#ff3bff", 25);

    ctx.strokeStyle = "#ff47ff";
    ctx.lineWidth = 12;

    ctx.beginPath();
    ctx.ellipse(35, 0, 35, 45, 0, 0, TAU);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.ellipse(35, 0, 35, 45, 0, 0, TAU);
    ctx.stroke();

    noGlow(ctx);

    finish(ctx);
}

function admin(ctx, x, y, a, s, time = 0) {
    setup(ctx, x, y, a + Math.sin(time * .004) * .08, s);

    // mysterious aura
    glow(ctx, "#ffffff", 35);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 7;

    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, TAU);
    ctx.stroke();

    ctx.strokeStyle = "#9b59ff";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, 59, time * .002, time * .002 + Math.PI * 1.5);
    ctx.stroke();

    // core
    ctx.fillStyle = "#080808";
    ctx.beginPath();
    ctx.arc(0, 0, 27, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", 0, 1);

    noGlow(ctx);

    finish(ctx);
}

/* =========================================================
   PUBLIC API
========================================================= */

const DRAWERS = {
    wood_sword: woodSword,
    bat,
    dagger,
    pistol,
    bow,
    axe,

    hammer,
    spear,
    shotgun,
    crossbow,
    boomerang,

    katana,
    fire_sword: fireSword,
    laser,
    plasma,
    ice,
    railgun,

    gold_sword: goldSword,
    gold_gun: goldGun,
    gold_axe: goldAxe,
    gold_bow: goldBow,

    diamond_blade: diamondBlade,
    diamond_cannon: diamondCannon,
    diamond_bow: diamondBow,
    diamond_fist: diamondFist,

    thunder,
    hell_sword: hellSword,
    blackhole,
    void_scythe: voidScythe,

    star,
    zero,
    admin
};

export function drawWeapon(
    ctx,
    weaponId,
    x,
    y,
    angle = 0,
    scale = 1,
    options = {}
) {
    const drawer = DRAWERS[weaponId];

    if (!drawer) {
        drawUnknownWeapon(ctx, x, y, angle, scale);
        return;
    }

    drawer(
        ctx,
        x,
        y,
        angle,
        scale,
        options.time ?? performance.now(),
        options
    );
}

function drawUnknownWeapon(ctx, x, y, angle, scale) {
    setup(ctx, x, y, angle, scale);

    ctx.fillStyle = "#888";

    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", 0, 1);

    finish(ctx);
}

export function hasWeaponRenderer(id) {
    return !!DRAWERS[id];
}

export { DRAWERS };
