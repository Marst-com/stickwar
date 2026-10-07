export function rectsOverlap(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

export function circleHit(
    cx,
    cy,
    radius,
    target
) {
    const nearestX =
        Math.max(
            target.x,
            Math.min(
                cx,
                target.x + target.width
            )
        );

    const nearestY =
        Math.max(
            target.y,
            Math.min(
                cy,
                target.y + target.height
            )
        );

    const dx = cx - nearestX;
    const dy = cy - nearestY;

    return (
        dx * dx +
        dy * dy <=
        radius * radius
    );
}

export function pointInRect(
    x,
    y,
    rect
) {
    return (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
    );
}

export function lineIntersectsRect(
    x1,
    y1,
    x2,
    y2,
    rect
) {
    const steps = 24;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const x =
            x1 +
            (x2 - x1) * t;

        const y =
            y1 +
            (y2 - y1) * t;

        if (pointInRect(x, y, rect)) {
            return true;
        }
    }

    return false;
}

export function playerRect(player) {
    return {
        x: player.x - player.width / 2,
        y: player.y,
        width: player.width,
        height: player.height
    };
}

export function getPlayerCenter(player) {
    return {
        x: player.x,
        y: player.y + player.height / 2
    };
  }
