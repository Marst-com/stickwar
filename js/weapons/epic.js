export const EPIC_WEAPONS = {

    katana: {
        id: "katana",
        name: "카타나",
        rarity: "EPIC",
        damage: 44,
        type: "melee",
        range: 95,
        cooldown: 360,
        combo: true,
        icon: "⚔️"
    },

    fire_sword: {
        id: "fire_sword",
        name: "화염검",
        rarity: "EPIC",
        damage: 54,
        type: "melee",
        range: 70,
        cooldown: 550,
        burn: {
            damage: 5,
            duration: 3000
        },
        icon: "🔥"
    },

    laser: {
        id: "laser",
        name: "레이저건",
        rarity: "EPIC",
        damage: 49,
        type: "laser",
        range: 700,
        cooldown: 800,
        pierce: true,
        icon: "🔴"
    },

    plasma: {
        id: "plasma",
        name: "플라즈마포",
        rarity: "EPIC",
        damage: 64,
        type: "explosive",
        speed: 10,
        radius: 70,
        cooldown: 1100,
        icon: "🟣"
    },

    ice: {
        id: "ice",
        name: "빙결포",
        rarity: "EPIC",
        damage: 34,
        type: "projectile",
        speed: 12,
        cooldown: 650,
        slow: .45,
        slowDuration: 3000,
        icon: "❄️"
    },

    railgun: {
        id: "railgun",
        name: "레일건",
        rarity: "EPIC",
        damage: 88,
        type: "laser",
        range: 1200,
        cooldown: 1800,
        pierce: true,
        knockback: 16,
        icon: "⚡"
    }

};
