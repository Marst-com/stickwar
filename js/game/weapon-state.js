const states = new Map();

export function getWeaponState(playerId) {
    if (!states.has(playerId)) {
        states.set(playerId, {
            attacking: false,
            attackTime: 0,
            attackDuration: 180,
            attackStartAngle: -1.3,
            attackEndAngle: 1.3,

            recoil: 0,
            flash: 0,

            projectileFlash: 0
        });
    }

    return states.get(playerId);
}

export function startWeaponAttack(playerId, weapon) {
    const state = getWeaponState(playerId);

    state.attacking = true;
    state.attackTime = 0;

    state.attackDuration =
        weapon.cooldown
            ? Math.min(weapon.cooldown * 0.7, 350)
            : 180;

    state.attackStartAngle = -1.25;
    state.attackEndAngle = 1.25;

    state.recoil = 0;
}

export function updateWeaponState(playerId, dt) {
    const state = getWeaponState(playerId);

    if (state.attacking) {
        state.attackTime += dt;

        if (state.attackTime >= state.attackDuration) {
            state.attackTime = state.attackDuration;
            state.attacking = false;
        }
    }

    state.recoil = Math.max(0, state.recoil - dt * .012);
    state.flash = Math.max(0, state.flash - dt * .01);
    state.projectileFlash =
        Math.max(0, state.projectileFlash - dt * .01);
}

export function getAttackProgress(state) {
    if (!state.attacking && state.attackTime <= 0) {
        return 0;
    }

    return Math.min(
        1,
        state.attackTime / state.attackDuration
    );
}

export function clearWeaponStates() {
    states.clear();
}
